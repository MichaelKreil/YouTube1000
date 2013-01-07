
var minViewCount = 38000000;

var fs = require('fs');
var downloader = require('./modules/downloader.js');
var results = {};
var queued = 0;
var finished = 0;

// Die YouTube-API ist ein bisschen wackelig. Z.B. kommt in der normalen mostviewd-Liste nicht "Gangnam Style" vor.
// Deswegen mal systematisch zusätzliche Suchbegriffe und Kategorien ausprobieren:
var modes = [
	'',
	'q=',
	'q=rights', // für "... All rights reserved ..."
	'q=video',
	'q=music',
	'q=by',
	'q=download',
	'q=and',
	'q=iTunes',
	'q=cat',
	'q=movie',
	'q=song',
	'q=pop',
	'q=rock',
	'category=Music',
	'category=Entertainment',
	'category=Comedy',
	'category=Movies',
	'category=Shows',
	'category=Nonprofit',
	'category=Trailers',
	'category=Games'
];

// Da einige Länder unterschiedlich sperren, einfach mal mehrere "freiheitliche" Länder durchprobieren
var countries = [
	'US', 'DE', 'ET', 'CH', 'LU', 'TV'
];


// Alle Kombinationen aus Ländern und Suchvarianten durchprobieren
for (var i = 0; i < countries.length; i++) {
	for (var j = 0; j < modes.length; j++) {
		var country = countries[i];
		var mode = modes[j] 
		download(0, country, mode);
	}
}

function getPageUrl(pageId, country, mode) {
	var parameters = ['alt=json', 'start-index='+(pageId*50+1), 'max-results=50', 'orderby=viewCount', 'restriction=' + country, 'region=' + country, mode, 'v=2'];
	return 'http://gdata.youtube.com/feeds/api/videos?' + parameters.join('&');
}

function download(pageId, country, mode) {
	queued++;
	
	var url = getPageUrl(pageId, country, mode);
	downloader.download(url, function (data) {
		finished++;
		
		data = JSON.parse(data);
		data = data.feed.entry;
		var nextPage = (pageId < 19);
		
		for (var i = 0; i < data.length; i++) {
			var entry = data[i];
			var viewCount;
			
			try {
				viewCount = parseInt(entry.yt$statistics.viewCount, 10);
				if (viewCount > minViewCount) {
					var id = entry.media$group.yt$videoid.$t;
					results['_'+id] = viewCount;
				} else {
					nextPage = false;
				}
			} catch (e) {
			}
		}
		
		if (nextPage) {
			download(pageId+1, country, mode); 
		}
		
		check();
	});
}
	

function check() {
	// Wenn alles gescraped ist, dann als JSON auswerfen
	console.log(queued, finished, (100*finished/queued).toFixed(1)+'%');
	if (queued == finished) {
		var listUrl = '../data/list.json';
		var list;
		
		if (fs.existsSync(listUrl)) {
			list = JSON.parse(fs.readFileSync(listUrl, 'utf8'));
		} else {
			list = {};
		}
		
		for (var i in results) {
			list[i] = results[i];
		}
		
		fs.writeFileSync('../data/list.json', JSON.stringify(list, null, '\t'), 'utf8');
	}
}