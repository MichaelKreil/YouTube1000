
var generateGrid = true;

var fs = require('fs');
var data = JSON.parse(fs.readFileSync('../charts/data.json'));



if (generateGrid) {
	generateGridSVG(
		'grid_by_rank',
		function (entry) { return entry.rank },
		function (entry) { return (entry.restrictedInDE > 1) }
	);
	generateGridSVG(
		'grid_by_reason',
		function (entry) { return -entry.restrictedInDE },
		function (entry) { return (entry.restrictedInDE > 1) }
	);
}



var countryCodes = {'AC':'Ascension','AD':'Andorra','AE':'Vereinigte Arabische Emirate','AF':'Afghanistan','AG':'Antigua und Barbuda','AI':'Anguilla','AL':'Albanien','AM':'Armenien','AO':'Angola','AQ':'Antarktika','AR':'Argentinien','AS':'Amerikanisch-Samoa','AT':'Österreich','AU':'Australien','AW':'Aruba','AX':'Åland','AZ':'Aserbaidschan','BA':'Bosnien und Herzegowina','BB':'Barbados','BD':'Bangladesch','BE':'Belgien','BF':'Burkina Faso','BG':'Bulgarien','BH':'Bahrain','BI':'Burundi','BJ':'Benin','BL':'Saint-Barthélemy','BM':'Bermuda','BN':'Brunei Darussalam','BO':'Bolivien','BQ':'Bonaire, Sint Eustatius und Saba (Niederlande)','BR':'Brasilien','BS':'Bahamas','BT':'Bhutan','BU':'Burma (jetzt Myanmar)','BV':'Bouvetinsel','BW':'Botswana','BY':'Belarus (Weißrussland)','BZ':'Belize','CA':'Kanada','CC':'Kokosinseln','CD':'Kongo, Demokratische Republik (ehem. Zaire)','CF':'Zentralafrikanische Republik','CG':'Republik Kongo','CH':'Schweiz (Confoederatio Helvetica)','CI':'Côte d’Ivoire (Elfenbeinküste)','CK':'Cookinseln','CL':'Chile','CM':'Kamerun','CN':'China, Volksrepublik','CO':'Kolumbien','CR':'Costa Rica','CU':'Kuba','CV':'Kap Verde','CW':'Curaçao','CX':'Weihnachtsinsel','CY':'Zypern','CZ':'Tschechische Republik','DE':'Deutschland','DJ':'Dschibuti','DK':'Dänemark','DM':'Dominica','DO':'Dominikanische Republik','DZ':'Algerien','EA':'Ceuta, Melilla','EC':'Ecuador','EE':'Estland','EG':'Ägypten','EH':'Westsahara','ER':'Eritrea','ES':'Spanien','ET':'Äthiopien','FI':'Finnland','FJ':'Fidschi','FK':'Falklandinseln','FM':'Mikronesien','FO':'Färöer','FR':'Frankreich','GA':'Gabun','GB':'Vereinigtes Königreich Großbritannien und Nordirland','GD':'Grenada','GE':'Georgien','GF':'Französisch-Guayana','GG':'Guernsey (Kanalinsel)','GH':'Ghana','GI':'Gibraltar','GL':'Grönland','GM':'Gambia','GN':'Guinea','GP':'Guadeloupe','GQ':'Äquatorialguinea','GR':'Griechenland','GS':'Südgeorgien und die Südlichen Sandwichinseln','GT':'Guatemala','GU':'Guam','GW':'Guinea-Bissau','GY':'Guyana','HK':'Hongkong','HM':'Heard und McDonaldinseln','HN':'Honduras','HR':'Kroatien','HT':'Haiti','HU':'Ungarn','IC':'Kanarische Inseln','ID':'Indonesien','IE':'Irland','IL':'Israel','IM':'Insel Man','IN':'Indien','IO':'Britisches Territorium im Indischen Ozean','IQ':'Irak','IR':'Iran, Islamische Republik','IS':'Island','IT':'Italien','JE':'Jersey (Kanalinsel)','JM':'Jamaika','JO':'Jordanien','JP':'Japan','KE':'Kenia','KG':'Kirgisistan','KH':'Kambodscha','KI':'Kiribati','KM':'Komoren','KN':'St. Kitts und Nevis','KP':'Korea, Demokratische Volksrepublik (Nordkorea)','KR':'Korea, Republik (Südkorea)','KW':'Kuwait','KY':'Kaimaninseln','KZ':'Kasachstan','LA':'Laos, Demokratische Volksrepublik','LB':'Libanon','LC':'St. Lucia','LI':'Liechtenstein','LK':'Sri Lanka','LR':'Liberia','LS':'Lesotho','LT':'Litauen','LU':'Luxemburg','LV':'Lettland','LY':'Libyen','MA':'Marokko','MC':'Monaco','MD':'Moldawien (Republik Moldau)','ME':'Montenegro','MF':'Saint-Martin (franz. Teil)','MG':'Madagaskar','MH':'Marshallinseln','MK':'Mazedonien, ehem. jugoslawische Republik','ML':'Mali','MM':'Myanmar (Burma)','MN':'Mongolei','MO':'Macao','MP':'Nördliche Marianen','MQ':'Martinique','MR':'Mauretanien','MS':'Montserrat','MT':'Malta','MU':'Mauritius','MV':'Malediven','MW':'Malawi','MX':'Mexiko','MY':'Malaysia','MZ':'Mosambik','NA':'Namibia','NC':'Neukaledonien','NE':'Niger','NF':'Norfolkinsel','NG':'Nigeria','NI':'Nicaragua','NL':'Niederlande','NO':'Norwegen','NP':'Nepal','NR':'Nauru','NU':'Niue','NZ':'Neuseeland','OM':'Oman','PA':'Panama','PE':'Peru','PF':'Französisch-Polynesien','PG':'Papua-Neuguinea','PH':'Philippinen','PK':'Pakistan','PL':'Polen','PM':'Saint-Pierre und Miquelon','PN':'Pitcairninseln','PR':'Puerto Rico','PS':'Palästinensische Autonomiegebiete','PT':'Portugal','PW':'Palau','PY':'Paraguay','QA':'Katar','RE':'Réunion','RO':'Rumänien','RS':'Serbien','RU':'Russische Föderation','RW':'Ruanda','SA':'Saudi-Arabien','SB':'Salomonen','SC':'Seychellen','SD':'Sudan','SE':'Schweden','SG':'Singapur','SH':'St. Helena','SI':'Slowenien','SJ':'Svalbard und Jan Mayen','SK':'Slowakei','SL':'Sierra Leone','SM':'San Marino','SN':'Senegal','SO':'Somalia','SR':'Suriname','SS':'Südsudan','ST':'São Tomé und Príncipe','SV':'El Salvador','SX':'Sint Maarten (niederl. Teil)','SY':'Syrien, Arabische Republik','SZ':'Swasiland','TC':'Turks- und Caicosinseln','TD':'Tschad','TF':'Französische Süd- und Antarktisgebiete','TG':'Togo','TH':'Thailand','TJ':'Tadschikistan','TK':'Tokelau','TL':'Osttimor (Timor-Leste)','TM':'Turkmenistan','TN':'Tunesien','TO':'Tonga','TR':'Türkei','TT':'Trinidad und Tobago','TV':'Tuvalu','TW':'Republik China (Taiwan)','TZ':'Tansania, Vereinigte Republik','UA':'Ukraine','UG':'Uganda','UM':'United States Minor Outlying Islands','US':'Vereinigte Staaten von Amerika','UY':'Uruguay','UZ':'Usbekistan','VA':'Vatikanstadt','VC':'St. Vincent und die Grenadinen','VE':'Venezuela','VG':'Britische Jungferninseln','VI':'Amerikanische Jungferninseln','VN':'Vietnam','VU':'Vanuatu','WF':'Wallis und Futuna','WS':'Samoa','YE':'Jemen','YT':'Mayotte','ZA':'Südafrika','ZM':'Sambia','ZW':'Simbabwe'};
var count = {};
for (var i = 0; i < data.length; i++) {
	var entry = data[i];
	var restrictions = entry.restrictionsAll;
	for (var j = 0; j < restrictions.length; j++) {
		var country = restrictions[j];
		if (count[country] === undefined) count[country] = 0;
		count[country]++;
	} 
}
var lines = [];
for (var i in count) lines.push([count[i], i, countryCodes[i]]);
lines = lines.sort(function (a, b) { return b[0] - a[0] } );
for (var i = 0; i < lines.length; i++) lines[i] = lines[i].join('\t');
fs.writeFileSync('../charts/countries.tsv', lines.join('\r'), 'utf8');



var count = {};
for (var i = 0; i < data.length; i++) {
	var entry = data[i];
	var reason = entry.reason;
	if (count[reason] === undefined) count[reason] = 0;
	count[reason]++;
}
var lines = [];
for (var i in count) lines.push([count[i], i]);
lines = lines.sort(function (a, b) { return b[0] - a[0] } );
for (var i = 0; i < lines.length; i++) lines[i] = lines[i].join('\t');
fs.writeFileSync('../charts/reason.tsv', lines.join('\r'), 'utf8');





/*
if (generateChart) {
	
	
}
*/

function generateGridSVG(filename, sortCallback, flagCallback) {
	var thumbWidth  = 343;
	var thumbHeight = 257;
	var columns = 25;
	var rows = 40;
	
	var scale = 10;
	
	for (var i = 0; i < data.length; i++) data[i].sortValue = sortCallback(data[i]);
	data = data.sort(function (a, b) {
		return (a.sortValue == b.sortValue) ? (b.viewCount - a.viewCount) : ((a.sortValue < b.sortValue) ? -1 :  1)
	});
	
	var svg = [];
	svg.push('<?xml version="1.0" encoding="UTF-8"?>');
	svg.push('<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">');
	svg.push('<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:ev="http://www.w3.org/2001/xml-events" version="1.1" baseProfile="full" width="'+(thumbWidth*columns/scale)+'px" height="'+(thumbHeight*rows/scale)+'px">');
	
	for (var i = 0; i < data.length; i++) {
		var x = (i % columns)*thumbWidth;
		var y = Math.floor(i / columns)*thumbHeight;
		
		//var url = '../images/thumbs/thumb'+(data[i].rank-1)+'.png';
		var url = '../images/hugethumbs/thumb_'+data[i].id+'.jpg';
		svg.push('<image x="'+x/scale+'px" y="'+y/scale+'px" width="'+(thumbWidth/scale+1)+'px" height="'+(thumbHeight/scale+1)+'px" xlink:href="'+url+'" style="stroke:none" />');
	}
	
	for (var i = 0; i < data.length; i++) {
		var x = (i % columns)*thumbWidth;
		var y = Math.floor(i / columns)*thumbHeight;
		
		var style = flagCallback(data[i]) ? 'fill:rgb(237,28,36);fill-opacity:0.6;stroke:none' : 'fill:rgb(255,255,255);fill-opacity:0.8;stroke:none';
		
		svg.push('<rect x="'+x/scale+'px" y="'+y/scale+'px" width="'+thumbWidth/scale+'px" height="'+thumbHeight/scale+'px" style="'+style+'"/>');
	}
	
	svg.push('</svg>');
	
	svg = svg.join('\r');
	
	fs.writeFileSync('../charts/'+filename+'.svg', svg, 'utf8'); 
} 






