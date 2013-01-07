

var generateThumbs = false;
var generateGridHTML = 'simple'; // false, 'info', 'simple'
var generateJSON = true;
	
var width = 16;   // Höhe der Thumbnails
var height = 12;  // Breite der Thumbnails
var f = 1.6;      // Ausschnitt, um die 16:9-Ränder zu verhindern. 1 = nicht ausschneiden
var columns = 25; // Wieviele Spalten hat das Ding



var reasons2restriction = {
	"Wir haben deine Spracheinstellung festgelegt.":0,
	"Führe ein Upgrade auf die aktuelle Flash Player-Version aus, um die Wiedergabequalität zu verbessern.  Jetzt aktualisieren  oder  weitere Informationen  erhalten":0,
	"Inhaltswarnung":1,
	"Dieses Video ist in Deutschland nicht verfügbar, weil es möglicherweise Musik enthält, für die die erforderlichen Musikrechte von der GEMA nicht eingeräumt wurden.":2,
	"Leider ist dieses Video, das Musik von SME beinhaltet, in Deutschland nicht verfügbar, da die GEMA die Verlagsrechte hieran nicht eingeräumt hat.":3,
	"Leider ist dieses Video, das Musik von UMG beinhaltet, in Deutschland nicht verfügbar, da die GEMA die Verlagsrechte hieran nicht eingeräumt hat.":3,
	"Leider ist dieses Video, das Musik von EMI beinhaltet, in Deutschland nicht verfügbar, da die GEMA die Verlagsrechte hieran nicht eingeräumt hat.":3,
	"Dieses Video enthält Content von UMG. Dieser Partner hat das Video in deinem Land aus urheberrechtlichen Gründen gesperrt.":4,
	"Dieses Video enthält Content von BPI (British Recorded Music Industry) Limited und Beggars. Einer oder mehrere dieser Partner haben das Video aus urheberrechtlichen Gründen gesperrt.":4,
	"Dieses Video ist in deinem Land nicht verfügbar.":4,
}
 


var fs = require('fs');
var sys = require('sys')
var spawn = require('child_process').spawn;

var list = JSON.parse(fs.readFileSync('../data/top1000.json', 'utf8'));

list.sort(function (a,b) { return b.viewCount - a.viewCount});
list.length = 1000;

var rows = list.length/columns;

if (generateThumbs) {
	var child = spawn('bash', [], {cwd: '../images', stdio: [null, process.stdout, process.stderr]});
	
	for (var i = 0; i < list.length; i++) {
		var s = ''
		id = list[i].id;
		s += 'convert "originals/thumb_'+id+'.jpg" -resize '+Math.round(width*f)+'x'+Math.round(height*f)+'^ -gravity center -crop '+width+'x'+height+'+0+0 "thumbs/thumb'+i+'.png"\n';
		if ((i+1) % 100 == 0) {
			s += 'echo "converting Thumbs: '+(100*(i+1)/list.length).toFixed(0)+'%"\n';
		}
		child.stdin.write(s);
	}
	child.stdin.end();
}

if (generateJSON) {
	for (var i = 0; i < list.length; i++) {
		var entry = list[i];
		//if (entry.description.length > 200) entry.description = entry.description.substr(0,200)+'...';
		entry.description = undefined;
		
		var restricted = reasons2restriction[entry.reason];
		if (restricted === undefined) {
			console.error('url "'+entry.url+'"');
			console.error('Unknown reason "'+entry.reason+'"');
		} else {
			if (entry.restrictedInDE != (restricted > 1)) {
				console.error(entry);
			}
			entry.restrictedInDE = restricted;
			if (restricted > 1) {
				if (entry.restrictionsAll.join(',').indexOf('DE') < 0) {
					entry.restrictionsAll.push('DE');
					entry.restrictionsAll.sort();
				}
			} else {
				if (entry.restrictionsAll.join(',').indexOf('DE') >= 0) {
					entry.restrictionsAll = entry.restrictionsAll.join(',').replace(/DE/g, '').replace(/\,\,/g, ',').split(',');
				}
			}
		}
	}
	var data = 'var data = '+JSON.stringify(list, null, '\t');
	fs.writeFileSync('../html/data/data.js', data, 'utf8');
}

if (generateGridHTML) {
	if (generateGridHTML == 'info') {
		list.sort(function (a,b) { return (b.restriction ? 1 : 0) - (a.restriction ? 1 : 0); })
	};
	
	var html = [];
	
	for (var i = 0; i < list.length; i++) {
		var x = i % columns;
		var y = Math.floor(i/columns);
	
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
	
	html = html.join('\n');
	
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