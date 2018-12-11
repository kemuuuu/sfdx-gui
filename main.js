const electron = require('electron')
const path = require('path')
const url = require('url')
const exec = require('child_process').exec

const app = electron.app
const BrowserWindow = electron.BrowserWindow
const ipc = electron.ipcMain

let mainWindow
app.on('ready', createWindow)
app.on('window-all-closed', function() {
  if (process.platform !== 'darwin') app.quit()
})
app.on('activate', function() {
  if (mainWindow === null) createWindow()
})

function createWindow() {
  mainWindow = new BrowserWindow({width: 800, height: 700})
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  mainWindow.on('closed', function() {
    mainWindow = null
  })
}

/* Step1*/
ipc.on('create-folder', (event, arg) => {
  const cmd = 'sfdx force:project:create -d ' + arg.path + ' -n ' + arg.name;
  exec(cmd, (error, stdout, stderr) => {
    if(stdout)console.log('stdout: ' + stdout)
    if(stderr)console.log('stderr: ' + stderr)
    if (error !== null) console.log('Exec error: ' + error)
  })
  event.returnValue = true;
})

/* Step2 promise*/
// ipc.on('auth-org', (event, arg) => {
//   const cmd = 'cd ' + arg.path + '/' + arg.name
//   exec(cmd, (error, stdout, stderr) => {
//     if (error === null) { 
//       exeAuth.then((msg) => {
//         event.returnValue = msg
//       })
//     }
//   })
// })
// const exeAuth = new Promise((resolve, reject) => {
//   const cmd = 'sfdx force:auth:web:login -s'
//   exec(cmd, (error, stdout, stderr) => {
//     if(stdout) {
//       console.log('stdout: ' + stdout)
//       resolve(stdout)
//     }
//     if(stderr)console.log('stderr: ' + stderr)
//     if (error !== null) console.log('Exec error: ' + error)
//   })
// })

/* Step2 */
ipc.on('auth-org', (event, arg) => {
  const cmd = 'cd ' + arg.path + '/' + arg.name
  exec(cmd, (error, stdout, stderr) => {
    if (error === null) { 
      const cmd2 = 'sfdx force:auth:web:login -s'
      exec(cmd2, (error, stdout, stderr) => {
        if(stdout) {
          console.log('stdout: ' + stdout)
          event.returnValue = stdout
        }
        if(stderr) console.log('stderr: ' + stderr)
        if (error !== null) console.log('Exec error: ' + error)
      })
    }
  })
})

// const exeAuth = () => {
//   const cmd2 = 'sfdx force:auth:web:login -s'
//   exec(cmd2, (error, stdout, stderr) => {
//     if(stdout) {
//       console.log('stdout: ' + stdout)
//       result = stdout;
//     }
//     if(stderr) console.log('stderr: ' + stderr)
//     if (error !== null) console.log('Exec error: ' + error)
//   })
//   return result
// }

/* Step3 */
ipc.on('sobj-list', (event, arg) => {
  const cmd = 'cd ' + arg.path + '/' + arg.name
  exec(cmd, (error, stdout, stderr) => {
    if (error === null) {
      const cmd2 = 'sfdx force:schema:sobject:list -c all --json'
      exec(cmd2, (error, stdout, stderr) => {
        if(stdout) {
          console.log('stdout: ' + stdout)
          event.returnValue = stdout
        }
        if(stderr)console.log('stderr: ' + stderr)
        if (error !== null) console.log('Exec error: ' + error)
      })
    }
  })
})

// const getList = () => {
//   const cmd = 'sfdx force:schema:sobject:list -c all --json'
//   let result = '';
//   exec(cmd, (error, stdout, stderr) => {
//     if(stdout) {
//       console.log('stdout: ' + stdout)
//       result = stdout;
//     }
//     if(stderr)console.log('stderr: ' + stderr)
//     if (error !== null) console.log('Exec error: ' + error)
//   })
//   return result;
// }

/* Step4 */
ipc.on('fetch-set', (event, arg) => {
  const cmd = 'cd ' + arg.path + '/' + arg.name
  exec(cmd, (error, stdout, stderr) => {
    if (error === null) {
      const cmd2 = 'sfdx force:schema:sobject:describe --json -s ' + arg.selected + 
                   ' > ' + arg.path + '/' + arg.name + '/' + arg.selected + '_schema.json'
      exec(cmd2, (error, stdout, stderr) => {
        if(stdout) console.log('stdout: ' + stdout)
        if(stderr)console.log('stderr: ' + stderr)
        if (error !== null) console.log('Exec error: ' + error)
        event.returnValue = '0'
      })
    }
  })
})
