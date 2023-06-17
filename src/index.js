const http = require('http')
const { resolve } = require('path')

const { getIp } = require('./utils/getIp')
const { cloneCode, runDocker } = require('./utils/execSh')
const { safeParse } = require('./utils/objUtils')

const PORT = 9500
const server = http.createServer((req, res) => {
  const { headers } = req;
  const userAgent = headers['user-agent'];
  const eventType = headers['x-github-event'] || headers['X-Gitee-Event'];


  if (!userAgent.includes('GitHub-Hookshot') || !userAgent.includes('git-oschina-hook')) {
    res.statusCode = 400;
    res.end('Bad Request');
    return;
  }

  let rawBody = '';
  req.on('data', chunk => {
    rawBody += chunk.toString();
  });

  req.on('end', async () => {
    const body = safeParse(rawBody)

    const { repository: { name, clone_url }, commits: [{ message }], pusher, sender } = body

    if (!name || !clone_url) {
      res.statusCode = 400;
      res.end('Bad Request');
      return
    }
    res.end('OK');

    if (!pusher) {
      pusher = sender
    }

    console.log(`info:
     repository: ${name},
     url: ${clone_url},
     event type: ${eventType},
     user: ${pusher.name}
     commits: ${message},
    `)


    try {
      const getCodePath = resolve(__dirname, './script/getCode.sh')
      const runDockerPath = resolve(__dirname, './script/runDockerfile.sh')

      const isStep1Fail = await cloneCode(getCodePath, clone_url, name)
      if (isStep1Fail) return
      const pathStr = getPortStr(name)
      runDocker(runDockerPath, name, pathStr)
    } catch (err) {
      return
    }
  });
})

function getPortStr(name) {
  if (name.endsWith('front')) {
    return '-dp 80:80'
  } else {
    return '-d -p 9527:9527 -p 9528:9528'
  }
}

server.listen(PORT, () => {
  console.log(`Server listening on ${getIp()}:${PORT}`);
});

server.on('connection', (socket) => {
  console.log(`New connection from ${socket.remoteAddress}:${socket.remotePort}`);
});