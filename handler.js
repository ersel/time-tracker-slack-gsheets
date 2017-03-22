'use strict';
const trackQueryParser = require('./lib/parsers/trackQuery.js');
const timeTracker = require('./lib/timeTrack.js');

module.exports.track = (event, context, callback) => {
	let parsedCommand = trackQueryParser.parseTrackingInfo(event.body);
	let callbackUrl = trackQueryParser.extractSupplementaryInfo(event.body).responseUrl;

	const response = {
		statusCode: 200,
		body: ''
	};
	// return 200 back to Slack, we'll respond via
	// callback URL in a bit...
	callback(null, response);

	if(parsedCommand[0] === 'help') {
		// get help
		timeTracker.getHelp(callbackUrl);
	} else if (parsedCommand[0] === 'list') {
		// get list of business activites
		timeTracker.activityList(callbackUrl);
	} else if (parsedCommand[0] === 'url') {
		// get the URL of the spreadsheet
		timeTracker.spreadsheetURL(callbackUrl);
	} else {
		// track time
		timeTracker.track(event.body, callbackUrl);
	}
};
