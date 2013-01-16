var canvas;

var colorDarkRed = [158,  11,  15, 0.6]; // CMYK: 0.0 1.0 1.0 0.4
var colorRed     = [237,  28,  36, 0.6]; // CMYK: 0.0 1.0 1.0 0.0
var colorOrange  = [247, 148,  29, 0.6]; // CMYK: 0.0 0.5 1.0 0.0
var colorYellow  = [255, 242,   0, 0.6]; // CMYK: 0.0 0.0 1.0 0.0
var colorBlue    = [171, 199, 255, 0.8];
var colorGreen   = [204, 255, 178, 0.8];
var colorWhite   = [255, 255, 255, 0.8];
var colorGrey    = [191, 191, 191, 0.8];

var countryCodes = {
	'AC':'Ascension',
	'AD':'Andorra',
	'AE':'Vereinigte Arabische Emirate',
	'AF':'Afghanistan',
	'AG':'Antigua und Barbuda',
	'AI':'Anguilla',
	'AL':'Albanien',
	'AM':'Armenien',
	'AO':'Angola',
	'AQ':'Antarktika',
	'AR':'Argentinien',
	'AS':'Amerikanisch-Samoa',
	'AT':'Österreich',
	'AU':'Australien',
	'AW':'Aruba',
	'AX':'Åland',
	'AZ':'Aserbaidschan',
	'BA':'Bosnien und Herzegowina',
	'BB':'Barbados',
	'BD':'Bangladesch',
	'BE':'Belgien',
	'BF':'Burkina Faso',
	'BG':'Bulgarien',
	'BH':'Bahrain',
	'BI':'Burundi',
	'BJ':'Benin',
	'BL':'Saint-Barthélemy',
	'BM':'Bermuda',
	'BN':'Brunei Darussalam',
	'BO':'Bolivien',
	'BQ':'Bonaire, Sint Eustatius und Saba (Niederlande)',
	'BR':'Brasilien',
	'BS':'Bahamas',
	'BT':'Bhutan',
	'BU':'Burma (jetzt Myanmar)',
	'BV':'Bouvetinsel',
	'BW':'Botswana',
	'BY':'Belarus (Weißrussland)',
	'BZ':'Belize',
	'CA':'Kanada',
	'CC':'Kokosinseln',
	'CD':'Kongo, Demokratische Republik (ehem. Zaire)',
	'CF':'Zentralafrikanische Republik',
	'CG':'Republik Kongo',
	'CH':'Schweiz (Confoederatio Helvetica)',
	'CI':'Côte d’Ivoire (Elfenbeinküste)',
	'CK':'Cookinseln',
	'CL':'Chile',
	'CM':'Kamerun',
	'CN':'China, Volksrepublik',
	'CO':'Kolumbien',
	'CR':'Costa Rica',
	'CU':'Kuba',
	'CV':'Kap Verde',
	'CW':'Curaçao',
	'CX':'Weihnachtsinsel',
	'CY':'Zypern',
	'CZ':'Tschechische Republik',
	'DE':'Deutschland',
	'DJ':'Dschibuti',
	'DK':'Dänemark',
	'DM':'Dominica',
	'DO':'Dominikanische Republik',
	'DZ':'Algerien',
	'EA':'Ceuta, Melilla',
	'EC':'Ecuador',
	'EE':'Estland',
	'EG':'Ägypten',
	'EH':'Westsahara',
	'ER':'Eritrea',
	'ES':'Spanien',
	'ET':'Äthiopien',
	'FI':'Finnland',
	'FJ':'Fidschi',
	'FK':'Falklandinseln',
	'FM':'Mikronesien',
	'FO':'Färöer',
	'FR':'Frankreich',
	'GA':'Gabun',
	'GB':'Vereinigtes Königreich Großbritannien und Nordirland',
	'GD':'Grenada',
	'GE':'Georgien',
	'GF':'Französisch-Guayana',
	'GG':'Guernsey (Kanalinsel)',
	'GH':'Ghana',
	'GI':'Gibraltar',
	'GL':'Grönland',
	'GM':'Gambia',
	'GN':'Guinea',
	'GP':'Guadeloupe',
	'GQ':'Äquatorialguinea',
	'GR':'Griechenland',
	'GS':'Südgeorgien und die Südlichen Sandwichinseln',
	'GT':'Guatemala',
	'GU':'Guam',
	'GW':'Guinea-Bissau',
	'GY':'Guyana',
	'HK':'Hongkong',
	'HM':'Heard und McDonaldinseln',
	'HN':'Honduras',
	'HR':'Kroatien',
	'HT':'Haiti',
	'HU':'Ungarn',
	'IC':'Kanarische Inseln',
	'ID':'Indonesien',
	'IE':'Irland',
	'IL':'Israel',
	'IM':'Insel Man',
	'IN':'Indien',
	'IO':'Britisches Territorium im Indischen Ozean',
	'IQ':'Irak',
	'IR':'Iran, Islamische Republik',
	'IS':'Island',
	'IT':'Italien',
	'JE':'Jersey (Kanalinsel)',
	'JM':'Jamaika',
	'JO':'Jordanien',
	'JP':'Japan',
	'KE':'Kenia',
	'KG':'Kirgisistan',
	'KH':'Kambodscha',
	'KI':'Kiribati',
	'KM':'Komoren',
	'KN':'St. Kitts und Nevis',
	'KP':'Korea, Demokratische Volksrepublik (Nordkorea)',
	'KR':'Korea, Republik (Südkorea)',
	'KW':'Kuwait',
	'KY':'Kaimaninseln',
	'KZ':'Kasachstan',
	'LA':'Laos, Demokratische Volksrepublik',
	'LB':'Libanon',
	'LC':'St. Lucia',
	'LI':'Liechtenstein',
	'LK':'Sri Lanka',
	'LR':'Liberia',
	'LS':'Lesotho',
	'LT':'Litauen',
	'LU':'Luxemburg',
	'LV':'Lettland',
	'LY':'Libyen',
	'MA':'Marokko',
	'MC':'Monaco',
	'MD':'Moldawien (Republik Moldau)',
	'ME':'Montenegro',
	'MF':'Saint-Martin (franz. Teil)',
	'MG':'Madagaskar',
	'MH':'Marshallinseln',
	'MK':'Mazedonien, ehem. jugoslawische Republik',
	'ML':'Mali',
	'MM':'Myanmar (Burma)',
	'MN':'Mongolei',
	'MO':'Macao',
	'MP':'Nördliche Marianen',
	'MQ':'Martinique',
	'MR':'Mauretanien',
	'MS':'Montserrat',
	'MT':'Malta',
	'MU':'Mauritius',
	'MV':'Malediven',
	'MW':'Malawi',
	'MX':'Mexiko',
	'MY':'Malaysia',
	'MZ':'Mosambik',
	'NA':'Namibia',
	'NC':'Neukaledonien',
	'NE':'Niger',
	'NF':'Norfolkinsel',
	'NG':'Nigeria',
	'NI':'Nicaragua',
	'NL':'Niederlande',
	'NO':'Norwegen',
	'NP':'Nepal',
	'NR':'Nauru',
	'NU':'Niue',
	'NZ':'Neuseeland',
	'OM':'Oman',
	'PA':'Panama',
	'PE':'Peru',
	'PF':'Französisch-Polynesien',
	'PG':'Papua-Neuguinea',
	'PH':'Philippinen',
	'PK':'Pakistan',
	'PL':'Polen',
	'PM':'Saint-Pierre und Miquelon',
	'PN':'Pitcairninseln',
	'PR':'Puerto Rico',
	'PS':'Palästinensische Autonomiegebiete',
	'PT':'Portugal',
	'PW':'Palau',
	'PY':'Paraguay',
	'QA':'Katar',
	'RE':'Réunion',
	'RO':'Rumänien',
	'RS':'Serbien',
	'RU':'Russische Föderation',
	'RW':'Ruanda',
	'SA':'Saudi-Arabien',
	'SB':'Salomonen',
	'SC':'Seychellen',
	'SD':'Sudan',
	'SE':'Schweden',
	'SG':'Singapur',
	'SH':'St. Helena',
	'SI':'Slowenien',
	'SJ':'Svalbard und Jan Mayen',
	'SK':'Slowakei',
	'SL':'Sierra Leone',
	'SM':'San Marino',
	'SN':'Senegal',
	'SO':'Somalia',
	'SR':'Suriname',
	'SS':'Südsudan',
	'ST':'São Tomé und Príncipe',
	'SV':'El Salvador',
	'SX':'Sint Maarten (niederl. Teil)',
	'SY':'Syrien, Arabische Republik',
	'SZ':'Swasiland',
	'TC':'Turks- und Caicosinseln',
	'TD':'Tschad',
	'TF':'Französische Süd- und Antarktisgebiete',
	'TG':'Togo',
	'TH':'Thailand',
	'TJ':'Tadschikistan',
	'TK':'Tokelau',
	'TL':'Osttimor (Timor-Leste)',
	'TM':'Turkmenistan',
	'TN':'Tunesien',
	'TO':'Tonga',
	'TR':'Türkei',
	'TT':'Trinidad und Tobago',
	'TV':'Tuvalu',
	'TW':'Republik China (Taiwan)',
	'TZ':'Tansania, Vereinigte Republik',
	'UA':'Ukraine',
	'UG':'Uganda',
	'UM':'United States Minor Outlying Islands',
	'US':'Vereinigte Staaten von Amerika',
	'UY':'Uruguay',
	'UZ':'Usbekistan',
	'VA':'Vatikanstadt',
	'VC':'St. Vincent und die Grenadinen',
	'VE':'Venezuela',
	'VG':'Britische Jungferninseln',
	'VI':'Amerikanische Jungferninseln',
	'VN':'Vietnam',
	'VU':'Vanuatu',
	'WF':'Wallis und Futuna',
	'WS':'Samoa',
	'YE':'Jemen',
	'YT':'Mayotte',
	'ZA':'Südafrika',
	'ZM':'Sambia',
	'ZW':'Simbabwe'
};

$(function () {
	for (var i = 0; i < data.length; i++) {
		var entry = data[i];
		entry.publishedTS = (new Date(entry.published)).getTime();
		entry.updatedTS   = (new Date(entry.updated  )).getTime();
	}
	
	canvas = new Canvas({
		imageNode: $('#gridImage'),
		node: $('#gridCanvas'),
		nodeOverlay: $('#gridCanvasOverlay'),
		thumbWidth: 20,
		thumbHeight: 15,
		columns: 25,
		data: data
	});
	
	$('#gridFlag button').click(function (e) {
		updateCanvas({ flagType:$(e.target).attr('value') });
	})
	
	$('#gridSort button').click(function (e) {
		updateCanvas({ sortType:$(e.target).attr('value') });
	})
	
	updateCanvas({initialize:true});
});

function updateCanvas(options) {
	options = options || {};
	var flagType = options.flagType || $('#gridFlag .active').attr('value');
	var sortType = options.sortType || $('#gridSort .active').attr('value');
	
	var flag;
	var sort = function (entry) { return -entry.restrictedInDE };
	var hint = function (entry) { return (entry.restrictedInDE > 1) ? 'Begründung:<br><i>'+entry.reason+'</i>' : '' };
	
	switch (flagType) {
		case 'germany':
			flag = function (entry) { return [0,0,0.5,1,1][entry.restrictedInDE] };
			hint
		break;
		case 'gema':
			flag = function (entry) { return (entry.restrictedInDE == 2) ? 1 : 0 };
		break;
		case 'other':
			flag = function (entry) { return (entry.restrictedInDE > 2) ? 1 : 0 };
		break;
		case 'foreign':
			flag = function (entry) { return  (entry.restrictionsAll.length > ((entry.restrictedInDE > 1) ? 1 : 0)) ? 1 : 0 };
			sort = function (entry) {
				var inDE = (entry.restrictedInDE > 1) ? 1 : 0;
				var onlyForeign = entry.restrictionsAll.length - inDE;
				if (onlyForeign > 0) {
					return -(onlyForeign+10);
				} else {
					return -entry.restrictedInDE
				}
			};
			hint = function (entry) {
				if (entry.restrictedInDE > 1) {
					if (entry.restrictionsAll.length > 1) {
						if (entry.restrictionsAll.length > 2) {
							return 'gesperrt in '+(entry.restrictionsAll.length-1)+' Ländern,<br>zusätzlich auch in Deutschland';
						} else {
							var id = (entry.restrictionsAll[0] == 'DE') ? 1 : 0; 
							return 'gesperrt in einem Land ('+countryCodes[entry.restrictionsAll[id]]+'),<br>zusätzlich auch in Deutschland';
						}
					} else {
						return 'gesperrt nur in Deutschland';
					}
				} else {
					if (entry.restrictionsAll.length > 1) {
						return 'gesperrt in '+entry.restrictionsAll.length+' Ländern,<br>aber nicht in Deutschland';
					} else if (entry.restrictionsAll.length > 0) {
						return 'gesperrt in einem Land ('+countryCodes[entry.restrictionsAll[0]]+')';
						
					} else {
						return 'nirgends gesperrt';
					}
				}
			}
		break;
	}
	
	switch (sortType) {
		case 'rank':
			sort = function (entry) { return entry.rank	};
		break;
		case 'rating':
			sort = function (entry) { return -entry.rating	};
		break;
		case 'category':
			sort = function (entry) { return  entry.category.toLowerCase() };
		break;
	}
	
	canvas.sort({
		callback: sort,
		hint: hint
	});
	
	var value = canvas.flag({
		callback: flag
	});
	
	setCounter(value);
	
	if (options.initialize) {
		canvas.makeItFast();
	} else {
		canvas.makeItSo();
	}
}

var oldValue, newValue, counterInterval;
function setCounter(value) {
	function setValue(value) {
		value = (value/10).toFixed(1).replace(/\./, ',')+'%';
		if (value.length < 5) value = '&nbsp;&nbsp;'+value;
		$('#display-number-content').html(value);
	}
	if (oldValue === undefined) {
		setValue(value);
		oldValue = value;
	} else {
		clearInterval(counterInterval);
		(function () {
			var frame = 1;
			var frameNumber = 40;
			counterInterval = setInterval(
				function () {
					if (frame >= frameNumber) {
						setValue(value);
						oldValue = value;
						clearInterval(counterInterval);
					} else {
						var a = frame/frameNumber;
						a = (1-Math.cos(a*Math.PI))/2;
						var v = (1-a)*oldValue + a*value;
						setValue(v);
						frame++
					}
				}, 10
			);
		})();
	}
}

function formatRating(value) {
	return value.toFixed(2).replace(/\./, ',');
}

function formatInteger(value) {
	var t = value.toFixed(0);
	for (var i = t.length-3; i > 0; i -= 3) {
		t = t.substr(0, i) + '.' + t.substr(i); 
	}
	return t;
}

function formatDate(value) {
	value = new Date(value);
	var day   = value.getDate();
	var month = value.getMonth() + 1;
	var year  = value.getFullYear();
	return day + '.' + month + '.' + year;
}