const {app, BrowserWindow, Tray, Menu} = require('electron')
const path = require('path')

app.commandLine.appendSwitch('disable-frame-rate-limit')
//Dual GPU Support
app.commandLine.appendSwitch('supports-dual-gpu=true')
app.commandLine.appendSwitch('autoplay-policy', 'no-user-gesture-required');
app.commandLine.appendSwitch('disable-gpu-sandbox')
app.commandLine.appendSwitch('ignore-gpu-blacklist', 'true');
app.commandLine.appendSwitch('disable-composited-antialiasing')
//app.commandLine.appendSwitch('disable-gpu-memory-buffer-compositor-resources')
app.commandLine.appendSwitch('enable-gpu-async-worker-context')
app.commandLine.appendSwitch('enable-hardware-overlays')
app.commandLine.appendSwitch('enable-native-gpu-memory-buffers')
app.commandLine.appendSwitch('enable-tcp-fastopen')
//app.commandLine.appendSwitch('show-fps-counter')
app.commandLine.appendSwitch('force-gpu-rasterization')

//Fixes WebGL support on old GPUS that get false unsupported message.
app.commandLine.appendSwitch('ignore-gpu-blacklist', 'true');

let mainWindow

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1350,
    height: 900,
    icon: __dirname + 'icon.png',
    webPreferences: {
      plugins: false,
      nodeIntegration: false,
      enableRemoteModule: false},
      show: false
  })

  let splash = new BrowserWindow({width: 500, height: 500, transparent: true, frame: false});
  mainWindow.loadFile('index.html')
  mainWindow.loadURL('https://gw-ui.netlify.com',{ userAgent: "Mozilla/5.0 rv:73.0) Gecko/20100101 Firefox/73.0'"})

  mainWindow.once('ready-to-show', () => {
    splash.destroy();
    mainWindow.maximize() // start maximized
    mainWindow.setMenuBarVisibility(false)
    mainWindow.setMenu(null)
    mainWindow.$ = mainWindow.jQuery = require('jquery');
    mainWindow.show();
  });
  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

//WILL BE USED ONCE PROPERLY IMPLEMENTED
  //main.webContents.on('new-window', function(e, url) {
    // make sure local urls stay in electron perimeter
    //if('file://' === url.substr(0, 'file://'.length)) {
      //return;
    //}

    // and open every other protocols on the browser
    //e.preventDefault();
    //shell.openExternal(url);
  //});

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })

  const tray = new Tray(
    path.resolve(__dirname, 'icon.png'),
  );
  tray.setContextMenu(
    Menu.buildFromTemplate([
      {
        label: "Quit",
        click() {
          tray.destroy();
          app.quit();
        },
      },
    ]),
  );
}

app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow()
})
