// Imports the Google Cloud client library
const translate = require('google-translate-open-api').default;
const fs = require('fs');

getLines().then(messages => translate(messages, {to:'en', format:'string'}))
	.then(results => {
		const lines = results.data[0].map(x => x[0][0][0]);

		const file = fs.createWriteStream('bigOutput.txt');
		file.on('error', function(err) { /* error handling */ });
		lines.forEach(function(v) { file.write(v + '\n\r'); });
		file.end();
	})
	.catch(err => console.log(err));

function getLines() {
	return new Promise(function(resolve, reject) {
		const lines = [];
		const messages = [];
		fs.readFile('ta_script_jpn.txt', function(err, data) {
			if (err) reject(err);
			data.toString().split("\n").forEach(function(line, index, arr) {
				lines.push(line.replace(/\r/g, ''));
			});

			let lineHead = '';
			let message = '';
			for(const line of lines) {
				if(line.startsWith('LINE:')){
					if(lineHead.length>0 && message.length>0) messages.push(`${lineHead}${message}`);		
					console.log(`${lineHead}${message}`);
					lineHead = `${line.split(' ')[1]}-E:`;
					message = '';
				} else {
					message = message.concat(line);
				}
			}
			resolve(messages);
		});
	})
};


