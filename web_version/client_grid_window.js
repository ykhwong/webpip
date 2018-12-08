$(document).ready(function() {
	var top_offset = 0;
	var left_offset = 0;
	var bottom_offset = 0;
	var right_offset = 0;

	window.addEventListener('message', function(event) { 
		var msg = event.data.split(",");
		if (/^\d+$/.test(msg[0])) {
			top_offset = parseInt(msg[0], 10);
		}
		if (/^\d+$/.test(msg[1])) {
			left_offset = parseInt(msg[1], 10);
		}
		if (/^\d+$/.test(msg[2])) {
			bottom_offset = parseInt(msg[2], 10);
		}
		if (/^\d+$/.test(msg[3])) {
			right_offset = parseInt(msg[3], 10);
		}
		$("#url").val(msg[4]);
		return;
	});

	function create_grid() {
		if (/^\d+$/.test($('#top-offset').val().trim())) {
			top_offset = parseInt($('#top-offset').val().trim(), 10);
		}
		if (/^\d+$/.test($('#left-offset').val().trim())) {
			left_offset = parseInt($('#left-offset').val().trim(), 10);
		}
		if (/^\d+$/.test($('#bottom-offset').val().trim())) {
			bottom_offset = parseInt($('#bottom-offset').val().trim(), 10);
		}
		if (/^\d+$/.test($('#right-offset').val().trim())) {
			right_offset = parseInt($('#right-offset').val().trim(), 10);
		}
		g_url = $('#g_url').val().trim();

		$('#home').hide();
		$("#innerframe").show();
		for (var i = 0; i < 4; i++) {
			var frame = document.getElementById('innerframe' + (i+1).toString());
			var offsets = top_offset.toString() + "," + left_offset.toString() + "," + bottom_offset.toString() + "," + right_offset.toString() + "," + g_url.toString();
			frame.contentWindow.postMessage(offsets, '*'); 
		}
		window.removeEventListener("message", function(event) { });
	}

	function go_to_url() {
		var url_addr = $('#url').val();
		window.removeEventListener("message", function(event) { });
		window.location.href = url_addr;
	}

	window.onresize = function (event) {
		var maxHeight = window.screen.height,
		maxWidth = window.screen.width,
		curHeight = window.innerHeight,
		curWidth = window.innerWidth;
		if (maxWidth == curWidth && maxHeight == curHeight) {
			$('.frames').css({
				"clip-path" : "inset(" + top_offset.toString() + "px " + right_offset.toString() + "px " + bottom_offset.toString() + "px " + left_offset.toString() + "px)",
				"height": ($('#innerframe1').height() + top_offset + bottom_offset).toString() + "px",
				"width": ($('#innerframe1').width() + left_offset + right_offset).toString() + "px",
			});
			$('#innerframe1').css({
				"top" : "-" + top_offset.toString() + "px",
				"left" : "-" + left_offset.toString() + "px",
			});
			$('#innerframe2').css({
				"top" : "-" + top_offset.toString() + "px",
				"left" : (curWidth / 2 - left_offset).toString(),
			});
			$('#innerframe3').css({
				"top" : (curHeight / 2 - top_offset).toString(),
				"left" : "-" + left_offset.toString() + "px",
			});
			$('#innerframe4').css({
				"top" : (curHeight / 2 - top_offset).toString(),
				"left" : (curWidth / 2 - left_offset).toString(),
			});

		} else {
			$('.frames').css({
				"clip-path" : "inset(0 0 0 0)",
				"height": "50%",
				"width": "50%",
			});
			$('#innerframe1').css({
				"top" : "0",
				"left" : "0",
			});
			$('#innerframe2').css({
				"top" : "0",
				"left" : "50%",
			});
			$('#innerframe3').css({
				"top" : "50%",
				"left" : "0",
			});
			$('#innerframe4').css({
				"top" : "50%",
				"left" : "50%",
			});
		}
	};

	$('#create').click(function() {
		create_grid();
	});

	$('#g_url, #top-offset, #left-offset, #bottom-offset, #right-offset').keypress(function (e) {
		if (e.which == 13) {
			create_grid();
			return false;
		}
	});
	
	$('#url_go, #url').keypress(function (e) {
		if (e.which == 13) {
			go_to_url();
			return false;
		}
	});

	$("#url_go").click(function(){
		go_to_url();
	});
});
