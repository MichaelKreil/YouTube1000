

var generateThumbs = true;
var generateGridHTML = 'simple'; // false, 'info', 'simple'
var generateJSON = true;
	
var width = 24;   // Höhe der Thumbnails
var height = 18;  // Breite der Thumbnails
var f = 1.6;      // Ausschnitt, um die 16:9-Ränder zu verhindern. 1 = nicht ausschneiden
var columns = 40; // Wieviele Spalten hat das Ding

 


var fs = require('fs');
var sys = require('sys')
var spawn = require('child_process').spawn;

var list = JSON.parse(fs.readFileSync('../data/top1000.json', 'utf8'));

var rows = list.length/columns;

if (generateThumbs) {
	var child = spawn('bash', [], {cwd: '../images', stdio: [null, process.stdout, process.stderr]});
	
	for (var i = 0; i < list.length; i++) {
		var s = ''
		s += 'convert "originals/thumb'+i+'.jpg" -resize '+Math.round(width*f)+'x'+Math.round(height*f)+'^ -gravity center -crop '+width+'x'+height+'+0+0 "thumbs/thumb'+i+'.png"\n';
		if ((i+1) % 100 == 0) {
			s += 'echo "converting Thumbs: '+(100*(i+1)/list.length).toFixed(0)+'%"\n';
		}
		child.stdin.write(s);
	}
	child.stdin.end();
}

if (generateJSON) {
	fs.writeFileSync('../html/data/data.js', 'var data = '+JSON.stringify(list), 'utf8');
}

if (generateGridHTML) {
	if (generateGridHTML == 'info') {
		list.sort(function (a,b) { return (b.restriction ? 1 : 0) - (a.restriction ? 1 : 0); })
		columns = Math.round(1000/columns);
	};
	
	var html = [];
	
	for (var i = 0; i < list.length; i++) {
		var x = Math.floor(i/rows);
		var y = (i % rows);
	
		var className = '';
		if (list[i].restriction) {
			className = ' restricted';
		}
		if (generateGridHTML == 'info') {
			html.push('<div class="img'+className+'" style="top:'+(height*x)+'px;left:'+(width*y)+'px"><img src="thumbs/thumb'+i+'.png"></div>');
		} else {
			html.push('<img src="thumbs/thumb'+i+'.png" style="top:'+(height*y)+'px;left:'+(width*x)+'px">');
		}
	}
	
	html = html.join('');
	
	var style = '';
	if (generateGridHTML == 'info') {
		style += '.img {background:#0072bc;text-align:center;width:'+width+'px;height:'+height+'px;position:absolute}';
		style += '.img.restricted {background:#ed1c24}';
		style += 'img {opacity:0.5;width:'+width+'px;height:'+height+'px}';
	} else {
		style += 'img {width:'+width+'px;height:'+height+'px;position:absolute}';
	}
		
	html = '<body style="position:relative">' + html + '</body>';
	html = '<html><head><style>'+style+'</style></head>' + html + '</head>';
	
	fs.writeFileSync('../images/grid.html', html, 'utf8');
}