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

    startGpsDeamon()
    
    win.webContents.openDevTools()

    win.on('closed', () => {
        win = null
    })    
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
    daemon.stop()
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
        var listener = new gpsd.Listener()

        listener.on('TPV', function(tpv){            
	    win.webContents.executeJavaScript(`map.updateUserGPS({lat: ${tpv.lat}, lon: ${tpv.lon}})`)
	    win.webContents.executeJavaScript(`map.mapView.flyTo([${tpv.lat}, ${tpv.lon}], 13)`)
        })

        listener.connect(function(){
            listener.watch()
	    console.log("CONNECTED LISTENER")
        })

	console.log("DAEMON STARTED")
    })
    daemon.start()
}
