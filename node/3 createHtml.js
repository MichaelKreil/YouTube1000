

var generateJSON = true;
var generateThumbs = true;
var generateGridHTML = 'simple'; // false, 'info', 'simple'
var generateChart = true;
	
var width = 20;   // Höhe der Thumbnails
var height = 15;  // Breite der Thumbnails
var f = 1.4;      // Ausschnitt, um die 16:9-Ränder zu verhindern. 1 = nicht ausschneiden
var columns = 25; // Wieviele Spalten hat das Ding



var reasons2restriction = {
	"Wir haben deine Spracheinstellung festgelegt.":0,
	"Führe ein Upgrade auf die aktuelle Flash Player-Version aus, um die Wiedergabequalität zu verbessern.  Jetzt aktualisieren  oder  weitere Informationen  erhalten":0,
	
	"Inhaltswarnung":1,
	
	"Dieses Video enthält Content von UMG. Dieser Partner hat das Video in deinem Land aus urheberrechtlichen Gründen gesperrt.":2,
	"Dieses Video enthält Content von BPI (British Recorded Music Industry) Limited und Beggars. Einer oder mehrere dieser Partner haben das Video aus urheberrechtlichen Gründen gesperrt.":2,
	"Dieses Video ist in deinem Land nicht verfügbar.":2,
	"Der betreffende Nutzer hat das Video in deinem Land nicht zur Verfügung gestellt.":2,
	
	"Dieses Video ist in Deutschland nicht verfügbar, weil es möglicherweise Musik enthält, für die die erforderlichen Musikrechte von der GEMA nicht eingeräumt wurden.":3,
	
	"Leider ist dieses Video, das Musik von SME beinhaltet, in Deutschland nicht verfügbar, da die GEMA die Verlagsrechte hieran nicht eingeräumt hat.":4,
	"Leider ist dieses Video, das Musik von UMG beinhaltet, in Deutschland nicht verfügbar, da die GEMA die Verlagsrechte hieran nicht eingeräumt hat.":4,
	"Leider ist dieses Video, das Musik von EMI beinhaltet, in Deutschland nicht verfügbar, da die GEMA die Verlagsrechte hieran nicht eingeräumt hat.":4,
}
 


var fs = require('fs');
var sys = require('sys')
var spawn = require('child_process').spawn;

var list = JSON.parse(fs.readFileSync('../data/top1000.json', 'utf8'));

list.sort(function (a,b) { return b.viewCount - a.viewCount});
list.length = 1000;

var rows = list.length/columns;


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
	entry.reason = entry.reason.replace(/verf[^a-z]{2}gbar/g, 'verfügbar');
	entry.reason = entry.reason.replace(/ f[^a-z]{2}r /g, ' für ');
}

function obj2List(obj) {
	var l = [];
	for (var i in obj) if (obj[i]) l.push(i);
	l.sort();
	return l;
}

if (generateJSON) {
	
	console.log('generate JSON');
	
	var data = [];
	for (var i = 0; i < list.length; i++) {
		var entry = list[i];

		entry.description = undefined;
		entry.rank = i+1;
		
		var restricted = reasons2restriction[entry.reason];
		if (restricted === undefined) {
			console.error('url "'+entry.url+'"');
			console.error('Unknown reason "'+entry.reason+'"');
		} else {
			if (entry.restrictedInDE != (restricted > 1)) {
				console.error(entry);
			}
			entry.restrictedInDE = restricted;
			entry.restrictionsAll['DE'] = (restricted > 1);
		}
		data[i] = {
			id: entry.id,
			viewCount: entry.viewCount,
			reason: entry.reason,
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
	data = 'var data = '+JSON.stringify(data, null, '\t');
	fs.writeFileSync('../html/data/data.js', data, 'utf8');
}

if (generateChart) {
	
	console.log('generate charts');
	
	var countryCodes = {'AC':'Ascension','AD':'Andorra','AE':'Vereinigte Arabische Emirate','AF':'Afghanistan','AG':'Antigua und Barbuda','AI':'Anguilla','AL':'Albanien','AM':'Armenien','AO':'Angola','AQ':'Antarktika','AR':'Argentinien','AS':'Amerikanisch-Samoa','AT':'Österreich','AU':'Australien','AW':'Aruba','AX':'Åland','AZ':'Aserbaidschan','BA':'Bosnien und Herzegowina','BB':'Barbados','BD':'Bangladesch','BE':'Belgien','BF':'Burkina Faso','BG':'Bulgarien','BH':'Bahrain','BI':'Burundi','BJ':'Benin','BL':'Saint-Barthélemy','BM':'Bermuda','BN':'Brunei Darussalam','BO':'Bolivien','BQ':'Bonaire, Sint Eustatius und Saba (Niederlande)','BR':'Brasilien','BS':'Bahamas','BT':'Bhutan','BU':'Burma (jetzt Myanmar)','BV':'Bouvetinsel','BW':'Botswana','BY':'Belarus (Weißrussland)','BZ':'Belize','CA':'Kanada','CC':'Kokosinseln','CD':'Kongo, Demokratische Republik (ehem. Zaire)','CF':'Zentralafrikanische Republik','CG':'Republik Kongo','CH':'Schweiz (Confoederatio Helvetica)','CI':'Côte d’Ivoire (Elfenbeinküste)','CK':'Cookinseln','CL':'Chile','CM':'Kamerun','CN':'China, Volksrepublik','CO':'Kolumbien','CR':'Costa Rica','CU':'Kuba','CV':'Kap Verde','CW':'Curaçao','CX':'Weihnachtsinsel','CY':'Zypern','CZ':'Tschechische Republik','DE':'Deutschland','DJ':'Dschibuti','DK':'Dänemark','DM':'Dominica','DO':'Dominikanische Republik','DZ':'Algerien','EA':'Ceuta, Melilla','EC':'Ecuador','EE':'Estland','EG':'Ägypten','EH':'Westsahara','ER':'Eritrea','ES':'Spanien','ET':'Äthiopien','FI':'Finnland','FJ':'Fidschi','FK':'Falklandinseln','FM':'Mikronesien','FO':'Färöer','FR':'Frankreich','GA':'Gabun','GB':'Vereinigtes Königreich Großbritannien und Nordirland','GD':'Grenada','GE':'Georgien','GF':'Französisch-Guayana','GG':'Guernsey (Kanalinsel)','GH':'Ghana','GI':'Gibraltar','GL':'Grönland','GM':'Gambia','GN':'Guinea','GP':'Guadeloupe','GQ':'Äquatorialguinea','GR':'Griechenland','GS':'Südgeorgien und die Südlichen Sandwichinseln','GT':'Guatemala','GU':'Guam','GW':'Guinea-Bissau','GY':'Guyana','HK':'Hongkong','HM':'Heard und McDonaldinseln','HN':'Honduras','HR':'Kroatien','HT':'Haiti','HU':'Ungarn','IC':'Kanarische Inseln','ID':'Indonesien','IE':'Irland','IL':'Israel','IM':'Insel Man','IN':'Indien','IO':'Britisches Territorium im Indischen Ozean','IQ':'Irak','IR':'Iran, Islamische Republik','IS':'Island','IT':'Italien','JE':'Jersey (Kanalinsel)','JM':'Jamaika','JO':'Jordanien','JP':'Japan','KE':'Kenia','KG':'Kirgisistan','KH':'Kambodscha','KI':'Kiribati','KM':'Komoren','KN':'St. Kitts und Nevis','KP':'Korea, Demokratische Volksrepublik (Nordkorea)','KR':'Korea, Republik (Südkorea)','KW':'Kuwait','KY':'Kaimaninseln','KZ':'Kasachstan','LA':'Laos, Demokratische Volksrepublik','LB':'Libanon','LC':'St. Lucia','LI':'Liechtenstein','LK':'Sri Lanka','LR':'Liberia','LS':'Lesotho','LT':'Litauen','LU':'Luxemburg','LV':'Lettland','LY':'Libyen','MA':'Marokko','MC':'Monaco','MD':'Moldawien (Republik Moldau)','ME':'Montenegro','MF':'Saint-Martin (franz. Teil)','MG':'Madagaskar','MH':'Marshallinseln','MK':'Mazedonien, ehem. jugoslawische Republik','ML':'Mali','MM':'Myanmar (Burma)','MN':'Mongolei','MO':'Macao','MP':'Nördliche Marianen','MQ':'Martinique','MR':'Mauretanien','MS':'Montserrat','MT':'Malta','MU':'Mauritius','MV':'Malediven','MW':'Malawi','MX':'Mexiko','MY':'Malaysia','MZ':'Mosambik','NA':'Namibia','NC':'Neukaledonien','NE':'Niger','NF':'Norfolkinsel','NG':'Nigeria','NI':'Nicaragua','NL':'Niederlande','NO':'Norwegen','NP':'Nepal','NR':'Nauru','NU':'Niue','NZ':'Neuseeland','OM':'Oman','PA':'Panama','PE':'Peru','PF':'Französisch-Polynesien','PG':'Papua-Neuguinea','PH':'Philippinen','PK':'Pakistan','PL':'Polen','PM':'Saint-Pierre und Miquelon','PN':'Pitcairninseln','PR':'Puerto Rico','PS':'Palästinensische Autonomiegebiete','PT':'Portugal','PW':'Palau','PY':'Paraguay','QA':'Katar','RE':'Réunion','RO':'Rumänien','RS':'Serbien','RU':'Russische Föderation','RW':'Ruanda','SA':'Saudi-Arabien','SB':'Salomonen','SC':'Seychellen','SD':'Sudan','SE':'Schweden','SG':'Singapur','SH':'St. Helena','SI':'Slowenien','SJ':'Svalbard und Jan Mayen','SK':'Slowakei','SL':'Sierra Leone','SM':'San Marino','SN':'Senegal','SO':'Somalia','SR':'Suriname','SS':'Südsudan','ST':'São Tomé und Príncipe','SV':'El Salvador','SX':'Sint Maarten (niederl. Teil)','SY':'Syrien, Arabische Republik','SZ':'Swasiland','TC':'Turks- und Caicosinseln','TD':'Tschad','TF':'Französische Süd- und Antarktisgebiete','TG':'Togo','TH':'Thailand','TJ':'Tadschikistan','TK':'Tokelau','TL':'Osttimor (Timor-Leste)','TM':'Turkmenistan','TN':'Tunesien','TO':'Tonga','TR':'Türkei','TT':'Trinidad und Tobago','TV':'Tuvalu','TW':'Republik China (Taiwan)','TZ':'Tansania, Vereinigte Republik','UA':'Ukraine','UG':'Uganda','UM':'United States Minor Outlying Islands','US':'Vereinigte Staaten von Amerika','UY':'Uruguay','UZ':'Usbekistan','VA':'Vatikanstadt','VC':'St. Vincent und die Grenadinen','VE':'Venezuela','VG':'Britische Jungferninseln','VI':'Amerikanische Jungferninseln','VN':'Vietnam','VU':'Vanuatu','WF':'Wallis und Futuna','WS':'Samoa','YE':'Jemen','YT':'Mayotte','ZA':'Südafrika','ZM':'Sambia','ZW':'Simbabwe'};
	var count = {};
	for (var i = 0; i < list.length; i++) {
		var entry = list[i];
		var restrictions = obj2List(entry.restrictionsAll);
		for (var j = 0; j < restrictions.length; j++) {
			var country = restrictions[j];
			if (count[country] === undefined) count[country] = 0;
			count[country]++;
		} 
	}
	var line = [];
	for (var i in count) {
		line.push([i, countryCodes[i], count[i]].join('\t'));	
	}
	fs.writeFileSync('../data/countries.tsv', line.join('\r'), 'utf8');
}

if (generateThumbs) {
	var child = spawn('bash', [], {cwd: '..', stdio: [null, process.stdout, process.stderr]});
	
	child.stdin.write('echo "generate thumbs"\n');
	
	for (var i = 0; i < list.length; i++) {
		var s = '';
		id = list[i].id;
		s += 'convert "images/originals/thumb_'+id+'.jpg" -resize '+Math.round(width*f)+'x'+Math.round(height*f)+'^ -gravity center -crop '+width+'x'+height+'+0+0 "images/thumbs/thumb'+i+'.png"\n';
		if ((i+1) % 100 == 0) {
			s += 'echo "   '+(100*(i+1)/list.length).toFixed(0)+'%"\n';
		}
		child.stdin.write(s);
	}
	child.stdin.write('echo "   generate grid image"\n');
	child.stdin.write('montage -tile '+columns+'x'+rows+' -geometry '+width+'x'+height+'+0+0 \'images/thumbs/thumb%d.png[0-999]\' html/images/grid.png\n');
	child.stdin.write('convert html/images/grid.png -quality 90 -interlace JPEG html/images/grid.jpg\n');
	child.stdin.end();
}

