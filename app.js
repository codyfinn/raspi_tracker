const {app, BrowserWindow} = require('electron')
const path = require('path')
const url = require('url')
const gpsd = require('node-gpsd')

let win
let daemon

function createWindow(){
    win = new BrowserWindow({width: 800, height: 600})

    win.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }))

    win.webContents.openDevTools()
    win.webContents.executeJavaScript("map.updateUserGPS({latitude: 0, longitude: 0})")

    win.on('closed', () => {
        win = null
    })    
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
    if(process.platform !== 'darwin'){
        app.quit()
    }
})

app.on('active', () => {
    if(win === null){
        createWindow()
    }
})

function startGpsDeamon(){
    daemon = new gpsd.Daemon({
        program: '/usr/local/sbin/gpsd',
        device: '/dev/ttyS0'
    })

    daemon.start(function(){
        var listener = new gpsd.Listener();

        listener.on('TPV', function(){
            //What happends when the listener gets an update
        })

        listener.connect(function(){
            listener.watch()
        })
    })
    daemon.start()
}
