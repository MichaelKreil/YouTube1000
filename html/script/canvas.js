function Canvas(options) {
	var me = this;
	
	var imageNode = options.imageNode;
	var node = options.node;
	var nodeOverlay = options.nodeOverlay;
	
	var context = node[0].getContext("2d");
	var contextOverlay = nodeOverlay[0].getContext("2d");
	
	var data = options.data;
	var columns = options.columns;
	var rows = (data.length/columns);
	var thumbWidth = options.thumbWidth;
	var thumbHeight = options.thumbHeight;
	
	var width = thumbWidth*columns;
	var height = thumbHeight*rows;
	
	var projectX  = [];
	var projectY  = [];
	var projectX2 = [];
	var projectY2 = [];
	
	var indexes = [];
	for (var i = 0; i < data.length; i++) {
		data[i].id = i;
		indexes[i] = { entry:data[i], sortBy:i, id:i };
		projectX[i] = (i % columns)*thumbWidth;
		projectY[i] = Math.floor(i/columns)*thumbHeight;
		projectX2[i] = Math.floor(i/rows)*thumbWidth;
		projectY2[i] = (i % rows)*thumbHeight;
	}

	me.reset = function () {
		context.clearRect(0, 0, width, height);
	}
	
	me.sort = function (options) {
		for (var i = 0; i < data.length; i++) {
			indexes[i].sortBy = options.callback(indexes[i].entry);
		}
		
		indexes.sort(function (a, b) { return (a.sortBy == b.sortBy) ? (b.entry.viewCount - a.entry.viewCount) : ((a.sortBy < b.sortBy) ? -1 :  1); });
		
		var image = imageNode[0];
		for (var i = 0; i < indexes.length; i++) {
			var entry = indexes[i].entry;
			var id = entry.id;
			var x = i % columns;
			var y = Math.floor(i/columns);
			
			context.drawImage(
				image,
				projectX2[id],
				projectY2[id],
				thumbWidth,
				thumbHeight,
				projectX2[i],
				projectY2[i],
				thumbWidth,
				thumbHeight
			);
		}
	}
	
	me.flag = function (options) {
		var colorTrue  = generateRGBA(options.colors[1]);
		var colorFalse = generateRGBA(options.colors[0]);
		for (var i = 0; i < indexes.length; i++) {
			var entry = indexes[i].entry;
			var show = options.callback(entry);
			
			context.fillStyle = show ? colorTrue : colorFalse;
			context.fillRect(projectX2[i], projectY2[i], thumbWidth, thumbHeight);
		}
	}
	
	function generateRGBA(array) {
		return 'rgba('+array.join(',')+')';
	}
	
	return me;
}