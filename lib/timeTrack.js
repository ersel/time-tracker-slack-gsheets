'use strict';
const trackQueryParser = require('./parsers/trackQuery.js');
const companyNumberParser = require('./parsers/companyNumber.js');
const durationParser = require('./parsers/duration.js');
const activityParser = require('./parsers/activity.js');
const gsheets = require('./gsheets.js');
const responses = require('./responses.js');

const timeTrack = (event) => {
	return gsheets.authorize().then((auth) => {

		if(!trackQueryParser.validateTrackingInfo(event)) {
			return responses.invalidArgumentLength();
		}

		let activity = trackQueryParser.extractTrackingInfo(event);
		let activitySupportingInfo = trackQueryParser.extractSupplementaryInfo(event);

		if(!companyNumberParser.validateCompanyNumber(activity.companyNumber)) {
			return responses.invalidCompanyNumber(activity.companyNumber);
		}

		return gsheets.getBusinessActivities(auth).then((activities) => {
			let parsedActivityList = activityParser.parseActivityListFromSpreadSheet(activities);
			let validatedActivity = activityParser.validateInput(activity.activity, parsedActivityList);

			if(!validatedActivity.valid) {
				return responses.invalidActivity(activity.activity, validatedActivity.recommendations);
			}

			let duration = durationParser.identifyDuration(activity.duration);
			if(!duration.valid) {
				return responses.invalidDuration(activity.duration);
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
				return responses.recordSuccess(validatedActivity.activity, activity.duration, activity.companyNumber, activitySupportingInfo.userName);
			});
		});
	});
};

module.exports = timeTrack;
