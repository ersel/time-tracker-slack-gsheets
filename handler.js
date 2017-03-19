'use strict';
const trackQueryParser = require('./lib/parsers/trackQuery.js');
const timeTracker = require('./lib/timeTrack.js');

module.exports.hello = (event, context, callback) => {
	let parsedCommand = trackQueryParser.parseTrackingInfo(event.body);

	const response = {
		statusCode: 200,
		body: ''
	};

	if(parsedCommand[0] === 'help') {
		// get help command
		response.body = 'help';
		callback(null, response);
	} else if (parsedCommand[0] === 'list') {
		// get list of business activites
		response.body = 'list';
		callback(null, response);
	} else if (parsedCommand[0] === 'url') {
		// get the url to the spreadsheet
		response.body = 'url';
		callback(null, response);
	} else {
		// track time
		timeTracker(event.body).then((result) => {
			response.body = result;
			callback(null, response);
		});
	}
};
