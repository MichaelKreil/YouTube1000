

var generateJSON = true;
var generateThumbs = true;
var generateHugeThumbs = true;
var generateGridHTML = 'simple'; // false, 'info', 'simple'

var parameters = [
	{ width:20, height:15, f:1.4, columns:25, rows:40, suffix:'860' },
	{ width:16, height:12, f:1.4, columns:25, rows:40, suffix:'640' },
	{ width:11, height:09, f:1.4, columns:25, rows:40, suffix:'520' }
];

var widthHuge  = Math.round(Math.min(480, 360*parameters[0].width/parameters[0].height)/parameters[0].f);
var heightHuge = Math.round(Math.min(360, 480*parameters[0].height/parameters[0].width)/parameters[0].f); 
 
var reason2info = {
	"Wir haben deine Spracheinstellung festgelegt.": {
		code: 0,
		newDE: 'Nicht gesperrt',
		newEN: 'not blocked',
		en: 'Added to'
	},
	"Führe ein Upgrade auf die aktuelle Flash Player-Version aus, um die Wiedergabequalität zu verbessern.  Jetzt aktualisieren  oder  weitere Informationen  erhalten":{
		code:0,
		newDE: 'Nicht gesperrt',
		newEN: 'not blocked',
		en: 'Added to'
	},
	
	
	"Inhaltswarnung":{
		code:1,
		en:'Content Warning'
	},
	
	
	"Dieses Video ist in Deutschland nicht verfügbar, weil es möglicherweise Musik enthält, für die die erforderlichen Musikrechte von der GEMA nicht eingeräumt wurden.":{
		code:2,
		en:'Unfortunately, this video is not available in Germany because it may contain music for which GEMA has not granted the respective music rights.'
	},
	
	
	"Leider ist dieses Video, das Musik von SME beinhaltet, in Deutschland nicht verfügbar, da die GEMA die Verlagsrechte hieran nicht eingeräumt hat.":{
		code:3,
		en:'Unfortunately, this SME-music-content is not available in Germany because GEMA has not granted the respective music publishing rights.'
	},
	"Leider ist dieses Video, das Musik von UMG beinhaltet, in Deutschland nicht verfügbar, da die GEMA die Verlagsrechte hieran nicht eingeräumt hat.":{
		code:3,
		en:'Unfortunately, this UMG-music-content is not available in Germany because GEMA has not granted the respective music publishing rights.'
	},
	"Leider ist dieses Video, das Musik von EMI beinhaltet, in Deutschland nicht verfügbar, da die GEMA die Verlagsrechte hieran nicht eingeräumt hat.":{
		code:3,
		en:'Unfortunately, this EMI-music-content is not available in Germany because GEMA has not granted the respective music publishing rights.'
	},
	
	
	"Dieses Video enthält Content von UMG. Dieser Partner hat das Video in deinem Land aus urheberrechtlichen Gründen gesperrt.":{
		code:4,
		en:'This video contains content from UMG, who has blocked it in your country on copyright grounds.'
	},
	"Dieses Video enthält Content von BPI (British Recorded Music Industry) Limited und Beggars. Einer oder mehrere dieser Partner haben das Video aus urheberrechtlichen Gründen gesperrt.":{
		code:4,
		en:'This video contains content from BPI (British Recorded Music Industry) Limited and Beggars, one or more of whom have blocked it on copyright grounds.'
	},
	"Dieses Video enthält Content von Sony ATV Publishing und UMPG Publishing. Einer oder mehrere dieser Partner haben das Video in deinem Land aus urheberrechtlichen Gründen gesperrt.":{code:4,en:''},
	"Dieses Video ist in deinem Land nicht verfügbar.":{
		code:4,
		en:'This video is not available in your country.'
	},
	"Der betreffende Nutzer hat das Video in deinem Land nicht zur Verfügung gestellt.":{
		code:4,
		en:'The uploader has not made this video available in your country.'
	}
}
 


var fs = require('fs');
var sys = require('sys')
var spawn = require('child_process').spawn;

var list = JSON.parse(fs.readFileSync('../data/top1000.json', 'utf8'));

var t = list;
list = [];
for (var i = 0; i < t.length; i++) {
	if (t[i].use != false) list.push(t[i]);
}

list.sort(function (a,b) { return b.viewCount - a.viewCount});
list.length = 1000;


for (var i = 0; i < list.length; i++) {
	var countries = {};
	var entry = list[i];
	var r = entry.restrictionsAll;
	for (var j = 0; j < r.length; j++) {
		var c = r[j];
		if (countries[c] === undefined) countries[c] = true;
	}
	entry.restrictionsAll = countries;
	
	// Fixe UTF-8-Fehler
	var reason = entry.reasonDE;
	reason = reason.replace(/verf[^a-z]{2}gbar/g, 'verfügbar');
	reason = reason.replace(/ f[^a-z]{2}r /g, ' für ');
	reason = reason.replace(/m[^a-z]{2}glicher/g, 'möglicher');
	reason = reason.replace(/einger[^a-z]{2}umt/g, 'eingeräumt');
	reason = reason.replace(/enth[^a-z]{2}lt/g, 'enthält');
	entry.reasonDE = reason;
}

if (generateJSON) {

	require('child_process').exec('cp ../data/top1000.tsv ../html/data/top1000.tsv');
	
	console.log('generate JSON');
	
	var data = [];
	for (var i = 0; i < list.length; i++) {
		var entry = list[i];

		entry.description = undefined;
		entry.rank = i+1;
		
		var restrictInfo = reason2info[entry.reasonDE];
		if (restrictInfo === undefined) {
			console.error('url "'+entry.url+'"');
			console.error('Unknown reason "' + entry.reasonDE + '"');
		} else {
			if (entry.restrictedInDE != (restrictInfo.code > 1)) {
				console.error('Irgendwas ist nicht in Ordnung', entry);
			}
			if ((restrictInfo.en !== undefined) && (restrictInfo.en != entry.reasonEN)) {
				console.error(entry.reasonDE);
				console.error(entry.reasonEN);
			}
			entry.restrictedInDE = restrictInfo.code;
			entry.restrictionsAll['DE'] = (restrictInfo.code > 1);
		}
		
		if (entry.reasonEN == '') {
			console.error('kein en-reason');
		}
		
		data[i] = {
			id: entry.id,
			viewCount: entry.viewCount,
			reasonDE: restrictInfo.newDE ? restrictInfo.newDE : entry.reasonDE,
			reasonEN: restrictInfo.newEN ? restrictInfo.newEN : entry.reasonEN,
			thumbnail: entry.thumbnail,
			image: entry.image,
			url: entry.url,
			published: entry.published,
			updated: entry.updated,
			title: entry.title,
			author: entry.author,
			restrictedInDE: entry.restrictedInDE,
			restrictionsAll: obj2List(entry.restrictionsAll),
			rating: entry.rating,
			category: entry.category,
			rank: entry.rank
		}
	}
	fs.writeFileSync('../html/data/data.js', 'var data = '+JSON.stringify(data), 'utf8');
	fs.writeFileSync('../charts/data.json', JSON.stringify(data, null, '\t'), 'utf8');
}

if (generateThumbs || generateHugeThumbs) {
	var child = spawn('bash', [], {cwd: '..', stdio: [null, process.stdout, process.stderr]});
	
	for (var j = 0; j < parameters.length; j++) parameters[j].thumbList = [];
	
	child.stdin.write('echo "generate thumbs"\n');
	
	for (var i = 0; i < list.length; i++) {
		var s = '';
		id = list[i].id;
		
		if (generateThumbs) {
			for (var j = 0; j < parameters.length; j++) {
				var p = parameters[j];
				var filename = 'images/thumbs_'+p.suffix+'/thumb_'+id+'.png';
				
				p.thumbList.push(filename);
				
				if (!fs.existsSync('../'+filename)) {
					child.stdin.write('convert "images/originals/thumb_'+id+'.jpg" -resize '+Math.round(p.width*p.f)+'x'+Math.round(p.height*p.f)+'^ -gravity center -crop '+p.width+'x'+p.height+'+0+0 "'+filename+'"\n');
				}
			}
		}
		
		if (generateHugeThumbs) {
			var filename = 'images/hugethumbs/thumb_'+id+'.jpg';
			if (!fs.existsSync('../'+filename)) {
				child.stdin.write('convert "images/originals/thumb_'+id+'.jpg" -gravity center -crop '+widthHuge+'x'+heightHuge+'+0+0 -quality 95 "'+filename+'"\n');
			}
		}
		
		if ((i+1) % 100 == 0) {
			child.stdin.write('echo "   '+(100*(i+1)/list.length).toFixed(0)+'%"\n');
		}
	}
	
	if (generateThumbs) {
		for (var j = 0; j < parameters.length; j++) {
			var p = parameters[j];
			child.stdin.write('echo "   generate grid image '+(j+1)+'/'+parameters.length+'"\n');
			
			child.stdin.write('montage -tile '+p.columns+'x'+p.rows+' -geometry '+p.width+'x'+p.height+'+0+0 \''+p.thumbList.join('\' \'')+'\' html/assets/img/grid_'+p.suffix+'.png\n');
			child.stdin.write('convert html/assets/img/grid_'+p.suffix+'.png -quality 90 -interlace JPEG html/assets/img/grid_'+p.suffix+'.jpg\n');
		}
	}
	
	child.stdin.end();
}




function obj2List(obj) {
	var l = [];
	for (var i in obj) if (obj[i]) l.push(i);
	l.sort();
	return l;
}



