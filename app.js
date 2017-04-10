const {app, BrowserWindow} = require('electron')
const path = require('path')
const url = require('url')
const gpsd = require('node-gpsd')
const FIFO = require('fifo-js')

let win
let daemon
let fifo

function createWindow(){
    win = new BrowserWindow({width: 800, height: 600})

    win.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }))

    startGpsDeamon()
    console.log("opening fifo")
    fifo = new FIFO("/tmp/gps")
    let json
    fifo.setReader((text) =>{
	if(!(text === '')){
	    console.log(text);
	    json = JSON.parse(text)
	    win.webContents.executeJavaScript(`map.updateBaloonGPS({lat: ${json.lat}, lon: ${json.lon}})`)
	    //win.webContents.executeJavaScript(`map.mapView.flyTo([${tvp.lat}, ${tvp.lon}], 13)`)
	}			
    })
    
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
        })

        listener.connect(function(){
            listener.watch()
	    console.log("CONNECTED LISTENER")
        })

	console.log("DAEMON STARTED")
    })
    daemon.start()
}
