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
	var deproject2 = [];
	
	var indexes = [];
	for (var i = 0; i < data.length; i++) {
		data[i].id = i;
		indexes[i] = { entry:data[i], sortBy:i, id:i };
		
		projectX[i] = (i % columns)*thumbWidth;
		projectY[i] = Math.floor(i/columns)*thumbHeight;
		
		var x = Math.floor(i/rows), y = (i % rows);
		projectX2[i] = x*thumbWidth;
		projectY2[i] = y*thumbHeight;
		if (deproject2[x] === undefined) deproject2[x] = [];
		deproject2[x][y] = i;
	}
	
	nodeOverlay.mouseenter(function (e) { me.toolTip.show(e.offsetX, e.offsetY) });
	nodeOverlay.mousemove( function (e) { me.toolTip.show(e.offsetX, e.offsetY) });
	nodeOverlay.mouseleave(function (e) { me.toolTip.hide() });
	nodeOverlay.click(function (e) {
		me.toolTip.showInfobox();
	});
	
	me.toolTip = new (function () {
		var me = this;
		var status = {};
		var markedEntry;
		
		var tooltip = $('#tooltip');
		var marker = $('#marker');
		var infobox = $('#infobox');
		var infoboxContent = $('#infoboxContent');
		var infoboxTemplate = infoboxContent.html();
		
		$('#infobox .close').click(function () { infobox.hide() });
		
		me.hide = function () {
			if (status.shown) {
				tooltip.hide();
				marker.hide();
			}
			status.shown = false;
		}
		
		me.show = function (x, y) {
			if (!status.shown) {
				tooltip.show();
				marker.show();
			}
			status.shown = true;
			
			var offset = $('#grid').offset();
			
			var xi = clamp(Math.floor(x/thumbWidth ), 0, columns-1);
			var yi = clamp(Math.floor(y/thumbHeight), 0, rows   -1); 
			var index = deproject2[xi][yi];
			var id = index.id
			var entry = indexes[index].entry;
			var html = '<b>'+entry.title+'</b><br>'+entry.hint;
			var content = html+xi+'_'+yi;
			
			if (status.content != content) {
				tooltip.html(html);
				
				var tx = xi*thumbWidth  + offset.left;
				var ty = yi*thumbHeight + offset.top;
				
				tooltip.css({
					left: tx + thumbWidth/2 - tooltip.outerWidth()/2,
					top:  ty + thumbHeight
				});
				
				marker.css({
					left: tx-3,
					top:  ty-3
				});
			}
			
			status.content = content;
			markedEntry = entry;
		}
		
		function replace(text, regexp, value) {
			value = value.replace(/%/g, '&#37;');
			return text.replace(regexp, value);
		}
		
		me.showInfobox = function () {
			infobox.show();
			
			var c = markedEntry.restrictionCountries;
			var countries = [];
			for (var i = 0; i < c.length; i++) countries.push('<span title="'+countryCodes[c[i]]+'">'+c[i]+'</span>');
			if (countries.length == 0) {
				countries = 'Nirgends \\o/';
			} else {
				countries = countries.join(', ');
			}
			
			var html = infoboxTemplate;
			
			html = replace(html, /%title%/g,                   markedEntry.title);
			html = replace(html, /%published%/g,    formatDate(markedEntry.published));
			html = replace(html, /%url%/g,                     markedEntry.url);
			html = replace(html, /%author%/g,                  markedEntry.author);
			html = replace(html, /%description%/g,             markedEntry.description);
			html = replace(html, /%restriction%/g,             markedEntry.restriction ? 'Ja' : 'Nein');
			html = replace(html, /%restrictionCountries%/g,    countries);
			html = replace(html, /%reason%/g,                  markedEntry.reason);
			html = replace(html, /%thumbnail%/g,               markedEntry.thumbnail);
			html = replace(html, /%rating%/g,     formatRating(markedEntry.rating));
			html = replace(html, /%viewCount%/g, formatInteger(markedEntry.viewCount));
			html = replace(html, /%category%/g,                markedEntry.category);
			
			if (!markedEntry.restriction) html = replace(html, /%de%.*?%\/de%/g, '');
			
			html = replace(html, /%.*?%/g, '');
			
			infoboxContent.html(html);
			$('#infoboxContent span').tooltip();
		}
	})();

	me.reset = function () {
		context.clearRect(0, 0, width, height);
	}
	
	me.sort = function (options) {
		for (var i = 0; i < data.length; i++) {
			indexes[i].sortBy = options.callback(indexes[i].entry);
			indexes[i].entry.hint = options.hint(indexes[i].entry);
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
		/*
		var colorTrue  = generateRGBA(options.colors[1]);
		var colorFalse = generateRGBA(options.colors[0]);
		*/
		for (var i = 0; i < indexes.length; i++) {
			var entry = indexes[i].entry;
			var color = options.callback(entry);
			color = generateRGBA(color);
			
			context.fillStyle = color;
			context.fillRect(projectX2[i], projectY2[i], thumbWidth, thumbHeight);
		}
	}
	
	function generateRGBA(array) {
		return 'rgba('+array.join(',')+')';
	}
	
	function clamp(value, min, max) {
		if (value < min) value = min;
		if (value > max) value = max;
		return value; 
	}
	
	return me;
}
