'use strict';

var google = require('googleapis');
var googleAuth = require('google-auth-library');
var Promise = require('bluebird');

const sheetsApi = Promise.promisifyAll(google.sheets('v4').spreadsheets);
sheetsApi.values = Promise.promisifyAll(sheetsApi.values);

var SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

const spreadsheetId = process.env.SPREADSHEET_ID;
const data = {
	activities: {id:spreadsheetId, range:'activities!A:B'},
	log: {id:spreadsheetId, range:'time!A:G'}
};

const gsheets = {
	authorize() {
		var auth = Promise.promisifyAll(new googleAuth());
		return auth.getApplicationDefaultAsync()
			.then(authClient => {
				if (authClient.createScopedRequired && authClient.createScopedRequired()) {
					authClient = authClient.createScoped(SCOPES);
				}
				return authClient;
			});
	},

	parseActivityListFromSpreadSheet(activityListSpreadSheet) {
		var activityList = {};
		for(let i = 0; i < activityListSpreadSheet.length; i++) {
			let key = '';
			for(let j = 0; j < activityListSpreadSheet[i].length; j++) {
				// first element will be the key
				if (j === 0) {
					key = activityListSpreadSheet[i][0];
				} else {
					let aliases = activityListSpreadSheet[i][j].split(',').map(e => e.trim());
					activityList[key] = aliases;
				}
			}
		}
		return activityList;
	},

	getBusinessActivities(auth){
		return sheetsApi.values.getAsync({
			auth,
			spreadsheetId: data.activities.id,
			range: data.activities.range
		}).then((data) => {
			return this.parseActivityListFromSpreadSheet(data.values.slice(1));
		});
	},

	recordTime(auth, values){
		let resource = {
			range: data.log.range,
			majorDimension: 'ROWS',
			values: values
		};
		return sheetsApi.values.appendAsync({
			auth,
			spreadsheetId: data.log.id,
			range: data.log.range,
			valueInputOption: 'USER_ENTERED',
			resource
		});
	}
};

module.exports = gsheets;
