'use strict';
const trackQueryParser = require('./parsers/trackQuery.js');
const companyNumberParser = require('./parsers/companyNumber.js');
const durationParser = require('./parsers/duration.js');
const activityParser = require('./parsers/activity.js');
const gsheets = require('./gsheets.js');

const timeTrack = (event) => {
	return gsheets.authorize().then((auth) => {

		if(!trackQueryParser.validateTrackingInfo(event)) {
			return 'Time Track command requires 3 arguments.';
		}

		let activity = trackQueryParser.extractTrackingInfo(event);
		let activitySupportingInfo = trackQueryParser.extractSupplementaryInfo(event);

		if(!companyNumberParser.validateCompanyNumber(activity.companyNumber)) {
			return 'Company number provided is invalid.';
		}

		return gsheets.getBusinessActivities(auth).then((activities) => {
			let parsedActivityList = activityParser.parseActivityListFromSpreadSheet(activities);
			let validatedActivity = activityParser.validateInput(activity.activity, parsedActivityList);

			if(!validatedActivity.valid) {
				return 'Unknown business activity';
			}

			let duration = durationParser.identifyDuration(activity.duration);
			if(!duration.valid) {
				return 'Duration provided is invalid';
			}

			let record = [];
			record.push(activitySupportingInfo.userName);
			record.push(activitySupportingInfo.userId);
			record.push(activity.companyNumber);
			record.push(validatedActivity.activity);
			record.push(activity.duration);
			let extractedDuration = durationParser.extractDuration({type: duration.type, value: activity.duration});
			let durationInSeconds = durationParser.calculateDurationInSeconds(extractedDuration);
			record.push(durationInSeconds);
			record.push(new Date().toISOString());

			return gsheets.recordTime(auth, [record]).then(()=>{
				return 'Recorded time';
			});
		});
	});
};

module.exports = timeTrack;
