const {app, BrowserWindow} = require('electron')
const path = require('path')

// Disabled VSync due to WebGL issues
app.commandLine.appendSwitch('disable-frame-rate-limit')
//Dual GPU Support
app.commandLine.appendSwitch('supports-dual-gpu=true')
app.commandLine.appendSwitch('autoplay-policy', 'no-user-gesture-required');
app.commandLine.appendSwitch('disable-gpu-sandbox')
app.commandLine.appendSwitch('ignore-gpu-blacklist', 'true');
app.commandLine.appendSwitch('disable-composited-antialiasing')
//app.commandLine.appendSwitch('disable-gpu-memory-buffer-compositor-resources')
app.commandLine.appendSwitch('enable-experimental-fullscreen-exit-ui')
app.commandLine.appendSwitch('enable-gpu-async-worker-context')
app.commandLine.appendSwitch('enable-hardware-overlays')
app.commandLine.appendSwitch('enable-native-gpu-memory-buffers')
app.commandLine.appendSwitch('enable-tcp-fastopen')
//app.commandLine.appendSwitch('show-fps-counter')
app.commandLine.appendSwitch('force-gpu-rasterization')

// Specify flash path, supposing it is placed in the same directory with main.js.
const pluginList = {
  'win32':  '/legacy/pepflashplayer.dll',
  'darwin': '/legacy/PepperFlashPlayer.plugin',
  'linux':  '/legacy/libpepflashplayer.so'
}
app.commandLine.appendSwitch('ppapi-flash-path', path.join(__dirname, pluginList[process.platform]))

//Fixes WebGL support on old GPUS that get false unsupported message.
app.commandLine.appendSwitch('ignore-gpu-blacklist', 'true');

// Optional: Specify flash version, for example, v17.0.0.169
app.commandLine.appendSwitch('ppapi-flash-version', '30.0.0.154')

let main = null
const createWindow = () => {
  main = new BrowserWindow({width: 1350, height: 900, icon: __dirname + '/icon.png', webPreferences: {plugins: false, experimentalFeatures: true,}, show: false})

  let splash = new BrowserWindow({width: 500, height: 500, transparent: true, frame: false});
  splash.loadURL('file://' + __dirname + '/index.html') // Load splash screen
  main.loadURL('https://gw-ui.netlify.com') // start loading application

  main.once('ready-to-show', () => {
    splash.destroy();
    main.maximize() // start maximized
    main.setMenuBarVisibility(false)
    main.setMenu(null)
    main.$ = main.jQuery = require('jquery');
    main.show();
  });

  main.webContents.on('will-navigate', ev => {
    ev.preventDefault()
  })
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // Fix OS X issue where applications and their menu bar
  // stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin')
    app.quit()
})

app.on('activate', () => {
  // Fix OS X issue where windows in the app are re-created when the
  // dock icon is clicked and there are no other windows open.
  if (main === null)
    createWindow()
})

app.on('ready', createWindow)
