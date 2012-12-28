function Canvas(options) {
	var me = this;
	
	var node = options.node;
	var nodeOverlay = options.nodeOverlay;
	
	var context = node[0].getContext("2d");
	var contextOverlay = nodeOverlay[0].getContext("2d");
	
	var data = options.data;
	var columns = options.columns;
	var thumbWidth = options.thumbWidth;
	var thumbHeight = options.thumbHeight;
	
	me.filter = function (options) {
		for (var i = 0; i < data.length; i++) {
			var entry = data[i];
			var show = options.callback(entry);
			context.fillStyle = show ? options.colorTrue : options.colorFalse;
			var x = i % columns;
			var y = Math.floor(i/columns);
			context.fillRect(x*thumbWidth, y*thumbHeight, thumbWidth, thumbHeight);
		}
	}
	
	return me;
}