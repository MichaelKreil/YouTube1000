// https:// gdata.youtube.com/feeds/api/videos?orderby=viewCount&max-results=50&restriction=US&v=2&alt=json&start-index=1

var fs = require('fs');
var downloader = require('./modules/downloader.js');

console.log('Lese "list.json"');
var results = JSON.parse(fs.readFileSync('../data/list.json', 'utf8'));
console.log('Beginne Analyse');

var entries = [];

for (var i in results) {
	var entry = results[i];

	if (entry.yt$statistics) {
		entry.viewCount = parseInt(entry.yt$statistics.viewCount, 10);
		entry.id = entry.media$group.yt$videoid.$t;
		entries.push(entry);
	}
}

entries.sort(function (a, b) {
	return b.viewCount - a.viewCount;
});

entries.length = 1000;

var queued = 0;
var maxQueued = 0;

for (var i = 0; i < entries.length; i++) {
	var entry = entries[i];
	var id = entry.id;
	
	var restriction = entry.media$group.media$restriction;
	var restrictionCountries = [];
	if (restriction === undefined) {
		restriction = false;
	} else {
		restrictionCountries = restriction[0].$t.split(' ');
		restriction = (restriction[0].$t.indexOf('DE') >= 0);
	}
	
	entry = {
		published: entry.published.$t,
		updated: entry.updated.$t,
		title: entry.title.$t,
		id: entry.id,
		url: 'http://www.youtube.com/watch?v='+id,
		author: entry.author[0].name.$t,
		description: entry.media$group.media$description.$t,
		restriction: restriction,
		restrictionCountries: restrictionCountries,
		reason: '',
		thumbnail: "http://i.ytimg.com/vi/"+id+"/default.jpg",
		image: "http://i.ytimg.com/vi/"+id+"/hqdefault.jpg",
		rating: (entry.gd$rating === undefined) ? -1 : parseFloat(entry.gd$rating.average),
		viewCount: entry.viewCount,
		category: entry.media$group.media$category[0].label
	};
	
	downloadThumb(entry.image, i);
	
	if (restriction) {
		queued++;
		maxQueued++;
		getReason(entry.url, entry);
	}
	
	entries[i] = entry;
}

var lastPercent = -1;

function check() {
	var percent = 100*queued/maxQueued;
	percent = Math.round(percent/10)*10;
	percent = percent.toFixed(0)+'%';
	if (percent != lastPercent) {
		console.log(percent);
		lastPercent = percent;
	}
	
	if (queued == 0) {
		
		fs.writeFileSync('../data/top1000.json', JSON.stringify(entries, null, '\t'), 'utf8');
		
		var keys = [];
		for (var key in entries[0]) keys.push(key);
		var lines = [keys.join('\t')];
		for (var i = 0; i < entries.length; i++) {
			var entry = entries[i];
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


function getReason(url, entry) {
	//console.log('Start "'+entry.url+'"');
	
	downloader.download(
		url,
		function (html) {
			queued--;
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
			console.log(text);
			entry.reason = text;
			check();
		},
		true
	);
}


function downloadThumb(url, id) {
	downloader.download(
		url,
		function (data) {
			console.log('Downloaded Thumb '+id);
			fs.writeFileSync('../images/originals/thumb'+id+'.jpg', data, 'binary');
		},
		false,
		true
	);
}

/* Why is always this fucking */function/* missing to */trim/* a fucking */(text)/* ??? */ { return text.replace(/^\s*|\s*$/g, ''); }