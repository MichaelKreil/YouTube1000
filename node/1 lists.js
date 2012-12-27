var fs = require('fs');
var downloader = require('./modules/downloader.js');
var results = {};
var queued = 0;


// Die YouTube-API ist ein bisschen wackelig. Z.B. kommt in der normalen mostviewd-Liste nicht "Gangnam Style" vor.
// Deswegen mal systematisch zusätzliche Suchbegriffe und Kategorien ausprobieren:
var modes = [
	'',
	'q=',
	'q=rights', // für "... All rights reserved ..."
	'q=video',
	'category=Film',
	'category=Autos',
	'category=Music',
	'category=Animals',
	'category=Sports',
	'category=Travel',
	'category=Games',
	'category=People',
	'category=Comedy',
	'category=Entertainment',
	'category=News',
	'category=Howto',
	'category=Education',
	'category=Tech',
	'category=Nonprofit',
	'category=Movies',
	'category=Shows',
	'category=Trailers'
];

// Da einige Länder unterschiedlich sperren, einfach mal mehrere "freiheitliche" Länder durchprobieren
var countries = [
	'US', 'DE', 'ET', 'CH', 'LU', 'TV'
];


// Alle Kombinationen aus Ländern und Suchvarianten durchprobieren
for (var k = 0; k < countries.length; k++) {
	for (var j = 0; j < modes.length; j++) {
		// Jeweils 20 Seiten a 50 Ergebnisse runterladen
		for (var i = 0; i < 20; i++) { 
			var country = countries[k];
			(function () {
				queued++;
				
				var parameters = ['alt=json', 'start-index='+(i*50+1), 'max-results=50', 'orderby=viewCount', 'restriction=' + country, 'region=US', modes[j], 'v=2'];
				var url = 'http://gdata.youtube.com/feeds/api/videos?' + parameters.join('&');
				
				downloader.download(url, function (data) {
					console.log(queued);
					//console.log(url);
					queued--;
					
					// Daten parsen
					data = JSON.parse(data);
					data = data.feed.entry;
					for (var i = 0; i < data.length; i++) {
						var entry = data[i];
						var id = entry.media$group.yt$videoid.$t;
						results['_'+id] = entry;
					}
					
					// Wenn alles gescraped ist, dann als JSON auswerfen
					if (queued == 0) {
						fs.writeFileSync('../data/list.json', JSON.stringify(results, null, '\t'), 'utf8');
					}
				});
			})();
		}
	}
}

function getUrl(pageNo, mode, country) {
}

