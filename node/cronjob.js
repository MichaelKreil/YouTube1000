var exec = require('child_process').exec;
var fs = require('fs');

var workers = [
//	{hour: 4, cmd:'node "1 lists.js"'  },
	{hour:10, cmd:'node "1 lists.js"'  },
	{hour:11, cmd:'node "2 analyse.js"'},
//	{hour:16, cmd:'node "1 lists.js"'  },
	{hour:22, cmd:'node "1 lists.js"'  },
	{hour:23, cmd:'node "2 analyse.js"'}
];

var lastHour = -1;

logDebug('Beginn');

function check () {
	var hour = (new Date()).getHours();
	if (hour != lastHour) {
		logDebug('Neue Stunde: ' + hour);
		lastHour = hour;

		for (var i = 0; i < workers.length; i++) {
			if (workers[i].hour == hour) {
				logDebug('Starte: ' + workers[i].cmd);
				exec(workers[i].cmd,
					function (error, stdout, stderr) {
						logInfo(stdout);
						if (stderr && (stderr != '')) logInfo(stderr);
						if (error  && (error  != '')) logError(error);
					}
				);
			}
		}
	}
}

check();
setInterval(check, 30*60*1000);

function logDebug(msg) {
	console.log('\033[32m' + msg + '\033[0m');
	fs.appendFileSync('./log/debug.log', array2log(msg), 'utf8');
}

function logInfo(msg) {
	console.log('\033[33m' + msg + '\033[0m');
	fs.appendFileSync('./log/info.log', array2log(msg), 'utf8');
}

function logError(msg) {
	console.log('\033[31m' + msg + '\033[0m');
	fs.appendFileSync('./log/error.log', array2log(msg), 'utf8');
}

function array2log(lines) {
	lines = lines.split('\n');
	var time = (new Date()).toString();
	var result = '';
	for (var i = 0; i < lines.length; i++) {
		result += time + '\t' + lines[i] + '\n';
	}
	return result;
}