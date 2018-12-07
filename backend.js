const electron = require('electron');
const ipc = electron.ipcMain;
const fs = require("fs");
const {
	app,
	BrowserWindow
} = require('electron');
const frontend_dir = 'file://' + __dirname + '/frontend/';
const path = require('path');
var recursive = require("recursive-readdir");

let mainWindow;
let subwin = [];

app.on('window-all-closed', (e) => {
	if (process.platform != 'darwin')
		app.quit();
});

function createWMpoperty(r_width, r_height, r_x, r_y) {
	var data = {
		width: r_width,	height: r_height,
		x: r_x, y: r_y,
		frame: false,
		resizable: false,
		movable: false,
		alwaysOnTop: true,
		useContentSize: true,
		fullscreenable: false,
		skipTaskbar: true,
		thickFrame: false,

		webPreferences: {
			webSecurity: false,
			plugins: true,
			preload: path.resolve(frontend_dir, 'preload.js')
		}
	};
	return data;
}

app.on('ready', function() {
	loadExtensions();
	mainWindow = new BrowserWindow({
		width: 1280,
		height: 720,
		title: "",
		icon: __dirname + '/icon.png',
		resize: true,
		frame: true
	});

	mainWindow.loadURL(frontend_dir + 'home.html');
	mainWindow.setMenu(null);
	mainWindow.focus();

	mainWindow.on('close', function(e) {
		subwin = [];
		mainWindow = null;
		app.quit();
	});

	ipc.on('remote', (event, data) => {
		var screenElectron = electron.screen;
		var mainScreen = screenElectron.getPrimaryDisplay();
		var dimensions = mainScreen.size;
		var r_width = 0;
		var r_height = 0;

		if (data == "open_2x2") {
			r_width = dimensions.width / 2;
			r_height = dimensions.height / 2;
			subwin = [];
			subwin[0] = new BrowserWindow(createWMpoperty(r_width, r_height, 0, 0));
			subwin[1] = new BrowserWindow(createWMpoperty(r_width, r_height, r_width, 0));
			subwin[2] = new BrowserWindow(createWMpoperty(r_width, r_height, 0, r_height));
			subwin[3] = new BrowserWindow(createWMpoperty(r_width, r_height, r_width, r_height));
		} else if (data == "open_4x4") {
			// 4x4 is not supported as of now
		}
		if (data.match(new RegExp("^open_",""))) {
			for (var i = 0; i < subwin.length; i++) {
				subwin[i].loadURL(frontend_dir + '/grid_window_webview.html');
				subwin[i].focus();
				subwin[i].on('close', function(e){
					for (var i = 0; i < subwin.length; i++) {
						if (!subwin[i].isDestroyed()) {
							subwin[i].destroy();
						}
					}
				});
				subwin[i].on('focus', function(e){
					for (var i = 0; i < subwin.length; i++) {
						subwin[i].setAlwaysOnTop(true);
					}
				});
			}
		}
	});

	function loadExtensions() {
		if (process.platform === "win32") {
			let ext_dir = process.env.LOCALAPPDATA + "\\Google\\Chrome\\User Data\\Default\\Extensions";
			if (!fs.existsSync(ext_dir)) {
				ext_dir = process.env.LOCALAPPDATA + "\\Google\\Chrome Beta\\User Data\\Default\\Extensions";
			}
			if (!fs.existsSync(ext_dir)) {
				return;
			}
			recursive(ext_dir, function (err, files) {
				files.forEach(function(file) {
					if (file.match(new RegExp("manifest\.json","i"))) {
						file = file.replace(/\\manifest\.json/i, "")
						file = file.replace(/\\/g, "/")
						//console.log(file);
						try {
							BrowserWindow.addExtension( file );
						} catch (err) {
							// Ignore errors
						}
					}
				});
			});
		}
	}

	app.on('web-contents-created', (e, contents) => {
		if (contents.getType() == 'webview') {
			contents.on('new-window', (e, url) => {
				e.preventDefault()
				let win = new BrowserWindow({
					width: 800,
					height: 600,
					title: "",
					icon: __dirname + '/icon.png',
					resize: true
				});

				win.loadURL(url);
				win.setMenu(null);
				win.focus();
				win.setAlwaysOnTop(true);
			})
		}
	})

	ipc.on( "setGrid", ( event, myGrid ) => {
		global.myGrid = myGrid;
	});
	ipc.on( "setDefaultURL", ( event, myDefaultURL ) => {
		global.myDefaultURL = myDefaultURL;
	});
	ipc.on( "setYoffset", ( event, myYoffset ) => {
		global.myYoffset = myYoffset;
	});

	// For debugging:
	// mainWindow.webContents.openDevTools();
});
