function exec(args, isLog = true) {
  return new Promise((resolve, reject) => {
    if (!isLog) {
      const { exec } = require('child_process');
      exec(args.join(' '), (error, stdout, stderr) => {
        if (error) {
          reject(error)
          return;
        }
        resolve(stdout)
      });
      return
    }

    const { spawn } = require('child_process');

    const script = spawn(args.shift(), args);

    script.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);
    });

    script.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`);
    });

    script.on('close', (code) => {
      console.log(`child process exited with code ${code}`);
      if (code) {
        reject(1)
      } resolve(0)
    });
  })
}

exports.cloneCode = function (scriptPath, url, name) {
  return exec([scriptPath, url, name]).then((suc) => {
    console.log("仓库克隆成功！")
    return 0
  })
    .catch(err => {
      console.log("仓库克隆失败");
      return 1
    })
}

exports.runDocker = function (scriptPath, imageName, portStr) {
  return exec([scriptPath, imageName, portStr]).then((suc) => {
    console.log("docker 容器运行成功！")
    return 0
  })
    .catch(err => {
      console.log("docker 容器运行失败");
      return 1
    })
}