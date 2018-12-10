const electron = require('electron');
const ipc = electron.ipcMain;
const fs = require("fs");
const {
	app,
	BrowserWindow
} = require('electron');
const frontend_dir = 'file://' + __dirname + '/frontend/';
const path = require('path');
const recursive = require("recursive-readdir");

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
			preload: path.resolve(__dirname + '/frontend/' + 'preload.js')
		}
	};
	return data;
}

function createWM(r_width, r_height, multiply, arr) {
	var len = Math.pow(multiply, 2);
	for (var i = 0; i < len; i++) {
		subwin[i] = new BrowserWindow(
			createWMpoperty(
				r_width, r_height,
				arr[i * 2],
				arr[i * 2 + 1]
			)
		);
	}
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
		var grid_case = Boolean(data.match(new RegExp("^open_","")));
		var screenElectron = electron.screen;
		var mainScreen = screenElectron.getPrimaryDisplay();
		var dimensions = mainScreen.size;
		var r_width = 0;
		var r_height = 0;
		var arr;

		if (grid_case) {
			subwin = [];
			if (data == "open_2x2") {
				r_width = dimensions.width / 2;
				r_height = dimensions.height / 2;
				arr = [
					0, 0,
					r_width, 0,

					0, r_height,
					r_width, r_height
				];
				createWM(r_width, r_height, 2, arr);
			} else if (data == "open_4x4") {
				r_width = dimensions.width / 4;
				r_height = dimensions.height / 4;

				arr = [
					0, 0,
					r_width, 0,
					r_width * 2, 0,
					r_width * 3, 0,

					0, r_height,
					r_width, r_height,
					r_width * 2, r_height,
					r_width * 3, r_height,

					0, r_height * 2,
					r_width, r_height * 2,
					r_width * 2, r_height * 2,
					r_width * 3, r_height * 2,

					0, r_height * 3,
					r_width, r_height * 3,
					r_width * 2, r_height * 3,
					r_width * 3, r_height * 3
				];
				createWM(r_width, r_height, 4, arr);
			}

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
				subwin[i].webContents.session.clearCache(function(){ });
				subwin[i].webContents.openDevTools();
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
