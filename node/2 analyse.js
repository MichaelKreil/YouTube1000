
var downloadDetail = true;
var downloadThumbs = true;
var downloadReason = true;

var fs = require('fs');
var downloader = require('./modules/downloader.js');
var queuedIn = 0;
var queuedOut = 0;
var allCountries = ['AD','AE','AF','AG','AI','AL','AM','AO','AQ','AR','AS','AT','AU','AW','AX','AZ','BA','BB','BD','BE','BF','BG','BH','BI','BJ','BM','BN','BO','BQ','BR','BS','BT','BV','BW','BY','BZ','CA','CC','CD','CF','CG','CH','CI','CK','CL','CM','CN','CO','CR','CU','CV','CW','CX','CY','CZ','DE','DJ','DK','DM','DO','DZ','EC','EE','EG','EH','ER','ES','ET','FI','FJ','FK','FM','FO','FR','GA','GB','GD','GE','GF','GH','GI','GL','GM','GN','GP','GQ','GR','GT','GU','GW','GY','HK','HM','HN','HR','HT','HU','ID','IE','IL','IN','IO','IQ','IR','IS','IT','JM','JO','JP','KE','KG','KH','KI','KM','KN','KP','KR','KW','KY','KZ','LA','LB','LC','LI','LK','LR','LS','LT','LU','LV','LY','MA','MC','MD','ME','MG','MH','MK','ML','MM','MN','MO','MP','MQ','MR','MS','MT','MU','MV','MW','MX','MY','MZ','NA','NC','NE','NF','NG','NI','NL','NO','NP','NR','NU','NZ','OM','PA','PE','PF','PG','PH','PK','PL','PM','PN','PR','PS','PT','PW','PY','QA','RE','RO','RS','RU','RW','SA','SB','SC','SD','SE','SG','SH','SI','SJ','SK','SL','SM','SN','SO','SR','SS','ST','SV','SX','SY','SZ','TC','TD','TF','TG','TH','TJ','TK','TL','TM','TN','TO','TR','TT','TV','TW','TZ','UA','UG','UM','US','UY','UZ','VA','VC','VE','VG','VI','VN','VU','WF','WS','YE','YT','ZA','ZM','ZW'];
var usedCountries = {};
for (var i = 0; i < allCountries.length; i++) usedCountries[allCountries[i]] = true;

console.log('Lese "list.json"');
var list = JSON.parse(fs.readFileSync('../data/list.json', 'utf8'));



console.log('Beginne Analyse');

var entries = [];
for (var i in list) {
	var id = i.substr(1);
	entries.push({
		id:        id,
		viewCount: list[i],
		thumbnail: 'http://i.ytimg.com/vi/'+id+'/default.jpg',
		image:     'http://i.ytimg.com/vi/'+id+'/hqdefault.jpg',
		url:       'http://www.youtube.com/watch?v='+id,
		use:       true
	});
}

for (var i = 0; i < entries.length; i++) {
	if (downloadDetail) {
		(function () {
			var entry = entries[i];
			queuedIn++;
			var url = 'http://gdata.youtube.com/feeds/api/videos/'+entry.id+'?alt=json&key=AI39si6r5kwUQTFCnTgPIyn10GRX_L5LtaPW7Rs4HJUCSXmQmmeJJZ2g7L62NOhpWkF4H1p4AJCo51Q_R7TjQENATfasT7NkXA&v=2';
			downloader.download(
				url,
				function (data, ok) {
					queuedOut++;
					
					if (ok) {
						data = JSON.parse(data);
						data = data.entry;
		
						var restrictions = data.media$group.media$restriction;
						//console.log(entry.id, restrictions);
						var restrictedInDE  = false
						var restrictionsAll = [];
						
						if (restrictions !== undefined) {
							if (restrictions.length != 1) console.error('Erwarte Länge = 1');
							restrictions = restrictions[0];
							
							if (restrictions.type != 'country') console.error('Erwarte type = country');
							
							var t = restrictions.$t;
							switch (restrictions.relationship) {
								case 'allow':
									restrictionsAll = [];
									for (var j = 0; j < allCountries.length; j++) {
										if (t.indexOf(allCountries[j]) < 0) restrictionsAll.push(allCountries[j]);
									}
									restrictionsAll.sort();
									restrictedInDE  = (t.indexOf('DE') < 0);
								break;
								case 'deny':
									var temp = t.split(' ');
									restrictionsAll = [];
									for (var j = 0; j < temp.length; j++) if (usedCountries[temp[j]]) restrictionsAll.push(temp[j]);
									restrictionsAll.sort();
									restrictedInDE  = (t.indexOf('DE') >= 0);
								break;
								default:
									console.error('Unbekannte Beziehung: '+restrictions.relationship)
							}
						}
						
						entry.published       = data.published.$t;
						entry.updated         = data.updated.$t;
						entry.title           = data.title.$t;
						entry.author          = data.author[0].name.$t;
						entry.description     = data.media$group.media$description.$t;
						entry.restrictedInDE  = restrictedInDE;
						entry.restrictionsAll = restrictionsAll;
						entry.rating          = (data.gd$rating === undefined) ? -1 : parseFloat(data.gd$rating.average);
						entry.viewCount       = parseInt(data.yt$statistics.viewCount, 10);
						entry.category        = data.media$group.media$category[0].label;

						if (downloadReason && restrictedInDE) {
							queuedIn++;
							downloader.download(
								entry.url,
								function (html, ok) {
									queuedOut++;
									if (ok) { entry.reasonDE = extractReason(html); } else { entry.use = false; }
									check();
								},
								true
							);
							
							queuedIn++;
							downloader.download(
								entry.url,
								function (html, ok) {
									queuedOut++;
									if (ok) { entry.reasonEN = extractReason(html); } else { entry.use = false; }
									check();
								},
								false
							);
						}
					} else {
						entry.use = false;
					}
					
					check();
				},
				true
			);
		})();
	}
	
	if (downloadThumbs) {
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

check();

var lastPercent = -1;

function check() {
	var percent = 100*queuedOut/queuedIn;
	percent = Math.floor(percent/5)*5;
	percent = percent.toFixed(0)+'%';
	if (percent != lastPercent) {
		console.log(percent);
		lastPercent = percent;
	}
	
	if (queuedOut == queuedIn) {
		
		var result = [];
		for (var i = 0; i < entries.length; i++) {
			if (true) result.push(entries[i]);
		}
		
		var json = JSON.stringify(result, null, '\t');
		fs.writeFileSync('../data/top1000.json', json, 'utf8');
		var date = (new Date()).toISOString();
		date = date.substr(0, 19).replace(/\:/g, '-');
		fs.writeFileSync('../data/archive/top1000_'+date+'.json', json, 'utf8');
		
		var keys = [];
		for (var key in result[0]) keys.push(key);
		var lines = [keys.join('\t')];
		for (var i = 0; i < result.length; i++) {
			var entry = result[i];
			var line = [];
			for (var j = 0; j < keys.length; j++) {
				var key = keys[j];
				var value = entry[key];
				value = (value === undefined) ? 'undefined' : value.toString();
				value = value.replace(/\t/g, '\\t');
				value = value.replace(/\n/g, '\\n');
				value = value.replace(/\r/g, '\\r');
				line.push(value);
			}
			lines.push(line.join('\t'));
		}
		fs.writeFileSync('../data/top1000.tsv', lines.join('\r'), 'utf8');
	}
}

function extractReason(html) {
	html = html.replace(/[\r\n]/g, ' ');
	var text = html.match(/\<div\s*class\=\"content\"\>.*?\<\/h1\>/i);
	if (text == null) {
		text = html.match(/\<div\s*class\=\"yt\-alert\-message\"\>.*?\<\/div\>/i)[0];
	} else {
		text = text[0];
	}
	text = text.replace(/\<.*?>/g, ' ');
	text = text.replace(/[ \s\t]*>/g, ' ');
	text = trim(text);
	return text;
}


/* Why is always this fucking */function/* missing to */trim/* a fucking */(text)/* ??? */ { return text.replace(/^\s*|\s*$/g, ''); }