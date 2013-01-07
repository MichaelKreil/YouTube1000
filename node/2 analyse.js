
var downloadDetail = true;
var downloadThumbs = true;
var downloadReason = true;

var fs = require('fs');
var downloader = require('./modules/downloader.js');
var queuedIn = 0;
var queuedOut = 0;



console.log('Lese "list.json"');
var list = JSON.parse(fs.readFileSync('../data/list.json', 'utf8'));



console.log('Beginne Analyse');

var entries = [];
for (var i in list) {
	var id = i.substr(1);
	entries.push({
		id:        id,
		viewCount: list[i],
		reason:    '',
		thumbnail: 'http://i.ytimg.com/vi/'+id+'/default.jpg',
		image:     'http://i.ytimg.com/vi/'+id+'/hqdefault.jpg',
		url:       'http://www.youtube.com/watch?v='+id,
		use:       true
	});
}

//entries.length = 10;

if (downloadDetail) {
	for (var i = 0; i < entries.length; i++) {
		(function () {
			var entry = entries[i];
			queuedIn++;
			downloader.download(
				'http://gdata.youtube.com/feeds/api/videos/'+entry.id+'?alt=json&key=AI39si6r5kwUQTFCnTgPIyn10GRX_L5LtaPW7Rs4HJUCSXmQmmeJJZ2g7L62NOhpWkF4H1p4AJCo51Q_R7TjQENATfasT7NkXA&v=2',
				function (data, ok) {
					queuedOut++;
					
					if (ok) {
						data = JSON.parse(data);
						data = data.entry;
		
						var restrictions = data.media$group.media$restriction;
						var restrictionDE = false
						var restrictionAll = [];
						
						if (restrictions !== undefined) {
							restrictionAll = restrictions[0].$t.split(' ');
							restrictionDE = (restrictions[0].$t.indexOf('DE') >= 0);
						}
						
						entry.published      = data.published.$t;
						entry.updated        = data.updated.$t;
						entry.title          = data.title.$t;
						entry.author         = data.author[0].name.$t;
						entry.description    = data.media$group.media$description.$t;
						entry.restrictionDE  = restrictionDE;
						entry.restrictionAll = restrictionAll;
						entry.rating         = (data.gd$rating === undefined) ? -1 : parseFloat(data.gd$rating.average);
						entry.viewCount      = data.viewCount;
						entry.category       = data.media$group.media$category[0].label;
					} else {
						entry.use = false;
					}
					
					check();
				}
			);
		})();
	}
}


if (downloadThumbs) {
	for (var i = 0; i < entries.length; i++) {
		(function () {
			var url = entries[i].image;
			var id  = entries[i].id;
			var filename = '../images/originals/thumb_'+id+'.jpg';
			if (!fs.existsSync(filename)) {
				queuedIn++;
				downloader.download(
					url,
					function (data) {
						queuedOut++;
						
						console.log('Downloaded Thumb '+id);
						fs.writeFileSync(filename, data, 'binary');
						
						check();
					},
					false,
					true
				);
			}
		})();
	}
}

if (downloadReason) {
	for (var i = 0; i < entries.length; i++) {
		(function () {
			var entry = entries[i];
			
			queuedIn++;
			downloader.download(
				entry.url,
				function (html, ok) {
					queuedOut++;
					if (ok) {
						html = html.replace(/[\r\n]/g, ' ');
						text = html.match(/\<div\s*class\=\"content\"\>.*?\<\/h1\>/i);
						if (text == null) {
							text = html.match(/\<div\s*class\=\"yt\-alert\-message\"\>.*?\<\/div\>/i)[0];
						} else {
							text = text[0];
						}
						text = text.replace(/\<.*?>/g, ' ');
						text = text.replace(/[ \s\t]*>/g, ' ');
						text = trim(text);
						//console.log(text);
						entry.reason = text;
					} else {
						entry.use = false;
					}
					check();
				},
				true
			);
		})();
	}
}

check();

var lastPercent = -1;

function check() {
	var percent = 100*queuedOut/queuedIn;
	percent = Math.round(percent/20)*20;
	percent = percent.toFixed(0)+'%';
	if (percent != lastPercent) {
		console.log(percent);
		lastPercent = percent;
	}
	
	if (queuedOut == queuedIn) {
		
		var result = [];
		for (var i = 0; i < entries.length; i++) {
			if (entries[i].use) result.push(entries[i]);
		}
		
		fs.writeFileSync('../data/top1000.json', JSON.stringify(result, null, '\t'), 'utf8');
		
		var keys = [];
		for (var key in result[0]) keys.push(key);
		var lines = [keys.join('\t')];
		for (var i = 0; i < result.length; i++) {
			var entry = result[i];
			var line = [];
			for (var j = 0; j < keys.length; j++) {
				var key = keys[j];
				line.push(entry[key]);
			}
			lines.push(line.join('\t'));
		}
		fs.writeFileSync('../data/top1000.tsv', lines.join('\r'), 'utf8');
	}
}

/* Why is always this fucking */function/* missing to */trim/* a fucking */(text)/* ??? */ { return text.replace(/^\s*|\s*$/g, ''); }