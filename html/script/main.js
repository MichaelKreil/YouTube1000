var canvas;

var colorRed   = 'rgba(237,  28,  36, 0.5)';
var colorBlue  = 'rgba(171, 199, 255, 0.8)';
var colorGreen = 'rgba(204, 255, 178, 0.8)';

$(function () {
	canvas = new Canvas({
		node:$('#gridCanvas'),
		nodeOverlay:$('#gridCanvasOverlay'),
		thumbWidth:24,
		thumbHeight:18,
		columns:40,
		data:data
	});
	canvas.filter({
		callback: function (entry) { return entry.restriction },
		colorTrue:  colorRed,
		colorFalse: colorGreen,
	});
	
	$('#gridContainer a').click(function (e) {
  		e.preventDefault();
  		$(this).tab('show');
	})
	
	//$('#gridContainer a[href="#blocked_in_germany"]').click();
});