'use strict';
const trackQueryParser = require('./parsers/trackQuery.js');
const companyNumberParser = require('./parsers/companyNumber.js');
const durationParser = require('./parsers/duration.js');
const activityParser = require('./parsers/activity.js');
const gsheets = require('./gsheets.js');
const responses = require('./responses.js');

const timeTrack = {
	track(event, callbackUrl) {
		return gsheets.authorize().then((auth) => {

			if(!trackQueryParser.validateTrackingInfo(event)) {
				let response = responses.invalidArgumentLength();
				return responses.respondWith(response, callbackUrl);
			}

			let activity = trackQueryParser.extractTrackingInfo(event);
			let activitySupportingInfo = trackQueryParser.extractSupplementaryInfo(event);

			if(!companyNumberParser.validateCompanyNumber(activity.companyNumber)) {
				let response = responses.invalidCompanyNumber(activity.companyNumber);
				return responses.respondWith(response, callbackUrl);
			}

			return gsheets.getBusinessActivities(auth).then((activities) => {
				let validatedActivity = activityParser.validateInput(activity.activity, activities);

				if(!validatedActivity.valid) {
					let response = responses.invalidActivity(activity.activity, validatedActivity.recommendations);
					return responses.respondWith(response, callbackUrl);
				}

				let duration = durationParser.identifyDuration(activity.duration);
				if(!duration.valid) {
					let response = responses.invalidDuration(activity.duration);
					return responses.respondWith(response, callbackUrl);
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
					let response = responses.recordSuccess(validatedActivity.activity, activity.duration, activity.companyNumber, activitySupportingInfo.userName);
					return responses.respondWith(response, callbackUrl, 'in_channel');
				});
			});
		});
	},

	activityList(callbackUrl){
		return gsheets.authorize().then((auth) => {
			return gsheets.getBusinessActivities(auth).then((activities) => {
				let response = responses.listOfActivities(activities);
				return responses.respondWith(response, callbackUrl);
			});
		});
	},

	spreadsheetURL(callbackUrl){
		let response = responses.returnSpreadsheetURL(process.env.SPREADSHEET_ID);
		return responses.respondWith(response, callbackUrl);
	},

	getHelp(callbackUrl){
		let response = responses.commandHelp();
		return responses.respondWith(response, callbackUrl);
	}
};

module.exports = timeTrack;
