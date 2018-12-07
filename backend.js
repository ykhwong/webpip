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
let subwin1, subwin2, subwin3, subwin4;

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
	
	function close_all_grids() {
		if (!subwin1.isDestroyed()) { subwin1.destroy(); }
		if (!subwin2.isDestroyed()) { subwin2.destroy(); }
		if (!subwin3.isDestroyed()) { subwin3.destroy(); }
		if (!subwin4.isDestroyed()) { subwin4.destroy(); }
	}

	function focus_all_grids() {
		subwin1.setAlwaysOnTop(true);
		subwin2.setAlwaysOnTop(true);
		subwin3.setAlwaysOnTop(true);
		subwin4.setAlwaysOnTop(true);
	}

	mainWindow.on('close', function(e) {
		subwin1 = null;
		subwin2 = null;
		subwin3 = null;
		subwin4 = null;
		mainWindow = null;
		app.quit();
	});

	ipc.on('remote', (event, data) => {
		var screenElectron = electron.screen;
		var mainScreen = screenElectron.getPrimaryDisplay();
		var dimensions = mainScreen.size;
		var r_width = 0;
		var r_height = 0;

		if (data == "open_4x4") {
			r_width = dimensions.width / 2;
			r_height = dimensions.height / 2;
			subwin1 = new BrowserWindow(createWMpoperty(r_width, r_height, 0, 0));
			subwin2 = new BrowserWindow(createWMpoperty(r_width, r_height, r_width, 0));
			subwin3 = new BrowserWindow(createWMpoperty(r_width, r_height, 0, r_height));
			subwin4 = new BrowserWindow(createWMpoperty(r_width, r_height, r_width, r_height));
			subwin1.loadURL(frontend_dir + '/grid_window_webview.html');
			subwin2.loadURL(frontend_dir + '/grid_window_webview.html');
			subwin3.loadURL(frontend_dir + '/grid_window_webview.html');
			subwin4.loadURL(frontend_dir + '/grid_window_webview.html');
			subwin1.focus();
			subwin2.focus();
			subwin3.focus();
			subwin4.focus();

			subwin1.on('close', function(e){ close_all_grids(); });
			subwin2.on('close', function(e){ close_all_grids(); });
			subwin3.on('close', function(e){ close_all_grids(); });
			subwin4.on('close', function(e){ close_all_grids(); });

			subwin1.on('focus', function(e){ focus_all_grids() });
			subwin2.on('focus', function(e){ focus_all_grids() });
			subwin3.on('focus', function(e){ focus_all_grids() });
			subwin4.on('focus', function(e){ focus_all_grids() });

		} else if (data == "open_8x8") {
			// 8x8 is not supported as of now
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
