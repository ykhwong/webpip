const ipc = require('electron').ipcRenderer;
const frontend_dir = 'file://' + __dirname + '/frontend/';
const remote = require('electron').remote;
const fs = require("fs");
const config_file = "config.ini";

$(document).ready(function() {

	function create_grid() {
		var url_addr = $('#g_url').val().trim();
		var y_offset = $('#y-offset').val().trim();
		var grid = $('#grid').val().trim();

		if (/^\d+$/.test(y_offset)) {
			ipc.send( "setYoffset", y_offset );
		} else {
			ipc.send( "setYoffset", "" );
		}
		ipc.send( "setGrid", grid );
		ipc.send( "setDefaultURL", url_addr );
		ipc.send('remote', "open_" + grid);
	}

	function load_data(data) {
		var res = data.replace(/\r\n/g, "\n").split("\n");
		res.forEach(function(entry) {
			var c_entry = entry.trim();
			if (c_entry !="") {
				if (c_entry.match(new RegExp("^URL=",""))) {
					c_entry = c_entry.replace(/^URL=/g, "")
					$('#g_url').val(c_entry);
				} else if (entry.trim().match(new RegExp("^Y-OFFSET=",""))) {
					c_entry = c_entry.replace(/^Y-OFFSET=/g, "")
					$('#y-offset').val(c_entry);
				} else if (entry.trim().match(new RegExp("^GRID=",""))) {
					c_entry = c_entry.replace(/^GRID=/g, "")
					$('#grid').val(c_entry);
				}
			}
		});
	}

	$('#g_url, #y-offset').keypress(function (e) {
		if (e.which == 13) {
			create_grid();
			return false;
		}
	});

	$('#create').click(function() {
		create_grid();
	});

	$('#set_as_default').click(function() {
		var result = "";
		result += "URL=" + $('#g_url').val() + "\n";
		result += "Y-OFFSET=" + $('#y-offset').val() + "\n";
		result += "GRID=" + $('#grid').val() + "\n";
		fs.writeFileSync(config_file, result);
	});

	fs.readFile(config_file, 'utf-8', (err, data) => {
		if(err) {
			//alert("An error ocurred reading the file :" + err.message);
			return;
		}
		load_data(data);
	});

});
