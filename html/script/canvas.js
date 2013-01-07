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
	var deproject = [];
	
	var indexes = [];
	for (var i = 0; i < data.length; i++) {
		data[i].id = i;
		indexes[i] = { entry:data[i], sortBy:i, id:i };
		
		var x = (i % columns);
		var y = Math.floor(i/columns);
		
		projectX[i] = x*thumbWidth;
		projectY[i] = y*thumbHeight;
		
		if (deproject[x] === undefined) deproject[x] = [];
		
		deproject[x][y] = i;
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
			
			var xi = clamp(Math.floor(x/thumbWidth ), 0, columns - 1);
			var yi = clamp(Math.floor(y/thumbHeight), 0, rows    - 1); 
			var index = deproject[xi][yi];
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
		
		var highlightCountries = {
			// Deutschland
			'DE':4,
			// deutschsprachig
			'CH':3,'AT':3,
			// EU
			'FR':2,'BE':2,'BG':2,'DK':2,'EE':2,'FI':2,'GR':2,'IE':2,'IT':2,'LV':2,'LT':2,'LU':2,'MT':2,'NL':2,'PL':2,'PT':2,'RO':2,'SE':2,'SK':2,'SI':2,'ES':2,'CZ':2,'HU':2,'GB':2,'CY':2,
			// westliche Staaten
			'US':1
		};
		
		me.showInfobox = function () {
			infobox.show();
			
			var c = markedEntry.restrictionsAll;
			var countries = [];
			for (var i = 0; i < c.length; i++) {
				var countryName = countryCodes[c[i]];
				if (countryName === undefined) console.error('Unbekannter Code: '+c[i]);
				
				var style = 'color:#888';
				switch (highlightCountries[c[i]]) {
					case 1:
					case 2:
					case 3: style = 'color:#000'; break; 
					case 4: style = 'color:#000;font-weight:bold'; break;
				} 
				countries.push('<span title="'+countryName+'" style="'+style+'">'+c[i]+'</span>');
			}
			if (countries.length == 0) {
				countries = 'Keinem Land';
			} else {
				countries = countries.join(', ');
			}
			
			var html = infoboxTemplate;
			
			html = replace(html, /%title%/g,                   markedEntry.title);
			html = replace(html, /%published%/g,    formatDate(markedEntry.published));
			html = replace(html, /%url%/g,                     markedEntry.url);
			html = replace(html, /%author%/g,                  markedEntry.author);
			html = replace(html, /%restriction%/g,             markedEntry.restrictedInDE ? 'Ja' : 'Nein');
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
				projectX[id],
				projectY[id],
				thumbWidth,
				thumbHeight,
				projectX[i],
				projectY[i],
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
			context.fillRect(projectX[i], projectY[i], thumbWidth, thumbHeight);
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
