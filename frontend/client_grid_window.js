const ipc = require('electron').ipcRenderer;
const frontend_dir = 'file://' + __dirname + '/frontend/';
const remote = require('electron').remote;
const fs = require("fs");
const config_file = "config.ini";

$(document).ready(function() {
	var screenElectron = remote.screen;
	var mainScreen = screenElectron.getPrimaryDisplay();
	var dimensions = mainScreen.size;
	var r_height = dimensions.height / 2;

	var num = remote.getGlobal( "myYoffset" );
	if (/^\d+$/.test(num)) {
		var offset_height = r_height + ( num * 2 );
		$('#innerframe').css({
			"top" : "-" + num.toString() + "px",
			"height": offset_height.toString() + "px",
		});
	}

	function go_to_url() {
		var url_addr = $('#url').val();
		window.location.href = url_addr;
	}

	$('#url').val(remote.getGlobal( "myDefaultURL" ));
	$('#url').keypress(function (e) {
		if (e.which == 13) {
			go_to_url();
			return false;
		}
	});

	$("#url_go").click(function(){
		go_to_url();
	});

});
