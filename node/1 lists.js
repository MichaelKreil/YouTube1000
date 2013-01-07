
var minViewCount = 42000000;

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

var endless = (process.argv[2] !== undefined);

var results = {};
var queued = 0;
var finished = 0;
var lastProgress = 0;

var fs = require('fs');
var util = require('util');
var downloader = require('./modules/downloader.js');

if (endless) {
	setInterval(run, 5*60*1000);
} else {
	run();
}

	
function run() {
	results = {};
	queued = 0;
	finished = 0;
	lastProgress = 0;
	
	// Alle Kombinationen aus Ländern und Suchvarianten durchprobieren
	for (var i = 0; i < countries.length; i++) {
		for (var j = 0; j < modes.length; j++) {
			var country = countries[i];
			var mode = modes[j] 
			download(0, country, mode);
		}
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
	progress = Math.floor(10*finished/queued);
	if (progress > lastProgress) {
		//util.print((progress-1).toFixed(0)+' ');
		util.print('.');
		lastProgress = progress;
	}
	
	// Wenn alles gescraped ist, dann als JSON auswerfen
	if (queued == finished) {
		var listUrl = '../data/list.json';
		var list;
		
		if (fs.existsSync(listUrl)) {
			list = JSON.parse(fs.readFileSync(listUrl, 'utf8'));
		} else {
			list = {};
		}
		
		var newVideos = 0;
		for (var i in results) {
			if (list[i] === undefined) newVideos++;
			list[i] = results[i];
		}
		
		for (var i in list) if (list[i] < minViewCount) list[i] = undefined;
		
		fs.writeFileSync('../data/list.json', JSON.stringify(list, null, '\t'), 'utf8');
		console.log(' - new videos: '+newVideos);
	}
}