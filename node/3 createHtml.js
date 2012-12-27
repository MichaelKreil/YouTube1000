// https:// gdata.youtube.com/feeds/api/videos?orderby=viewCount&max-results=50&restriction=US&v=2&alt=json&start-index=1

var generateThumbs = true;
var generateGridHTML = 'simple'; // false, 'info', 'simple'
	
var width = 24;
var height = 18;
var f = 1.6;
var columns = 40;

var fs = require('fs');
var sys = require('sys')
var spawn = require('child_process').spawn;

var list = JSON.parse(fs.readFileSync('../data/top1000.json', 'utf8'));

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

if (generateGridHTML) {
	if (generateGridHTML == 'info') {
		list.sort(function (a,b) { return (b.restriction ? 1 : 0) - (a.restriction ? 1 : 0); })
		columns = Math.round(1000/columns);
	};
	
	var rows = [];
	
	for (var i = 0; i < list.length; i++) {
		var x = (i % columns);
		var y = Math.floor(i/columns);
	
		var className = '';
		if (list[i].restriction) {
			className = ' restricted';
		}
		if (generateGridHTML == 'info') {
			rows.push('<div class="img'+className+'" style="top:'+(height*x)+'px;left:'+(width*y)+'px"><img src="thumbs/thumb'+i+'.png"></div>');
		} else {
			rows.push('<img src="thumbs/thumb'+i+'.png" style="top:'+(height*y)+'px;left:'+(width*x)+'px">');
		}
	}
	
	var html = rows.join('');
	
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