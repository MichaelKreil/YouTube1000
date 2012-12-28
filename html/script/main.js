var canvas;

var colorRed   = [237,  28,  36, 0.6];
var colorBlue  = [171, 199, 255, 0.8];
var colorGreen = [204, 255, 178, 0.8];
var colorWhite = [255, 255, 255, 0.8];

$(function () {
	for (var i = 0; i < data.length; i++) {
		var entry = data[i];
		entry.publishedTS = (new Date(entry.published)).getTime();
		entry.updatedTS   = (new Date(entry.updated)).getTime();
	}
	
	canvas = new Canvas({
		imageNode: $('#gridImage'),
		node: $('#gridCanvas'),
		nodeOverlay: $('#gridCanvasOverlay'),
		thumbWidth: 24,
		thumbHeight: 18,
		columns: 40,
		data: data
	});
	
	$('#gridFlag button').click(function (e) {
		updateCanvas({ flagType:$(e.target).attr('value') });
	})
	
	$('#gridSort button').click(function (e) {
		updateCanvas({ sortType:$(e.target).attr('value') });
	})
	
	updateCanvas();
	//$('#gridContainer a[href="#blocked_in_germany"]').click();
});

function updateCanvas(options) {
	canvas.reset();
	options = options || {};
	var sortType = options.sortType || $('#gridSort .active').attr('value');
	
	var callback;
	var sortDesc = false;
	switch (sortType) {
		case 'views':
			callback = function (entry) { return -entry.viewCount };
		break;
		case 'title':
			callback = function (entry) { return entry.title.toLowerCase() };
		break;
		case 'category':
			callback = function (entry) { return entry.category.toLowerCase() };
		break;
		case 'date':
			callback = function (entry) { return entry.published };
		break;
		case 'rating':
			callback = function (entry) { return -entry.rating };
		break;
	};
	
	canvas.sort({
		callback: callback,
	});
	
	
	var flagType = options.flagType || $('#gridFlag .active').attr('value');

	switch (flagType) {
		case 'germany':
			callback = function (entry) { return entry.restriction };
		break;
		case 'precautionary':
			callback = function (entry) { return (entry.reason.indexOf('möglicherweise') >= 0) };
		break;
	};
	if (flagType != 'none') {
		canvas.flag({
			callback: callback,
			colors: [colorWhite, colorRed]
		});
	}
}
