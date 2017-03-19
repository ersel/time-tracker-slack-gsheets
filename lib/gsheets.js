'use strict';

var google = require('googleapis');
var googleAuth = require('google-auth-library');
var Promise = require('bluebird');

const sheetsApi = Promise.promisifyAll(google.sheets('v4').spreadsheets);
sheetsApi.values = Promise.promisifyAll(sheetsApi.values);

var SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

const data = {
	activities: {id:'INSERT SPREADSHEET ID HERE', range:'activities!A:B'},
	log: {id:'INSERT SPREADSHEET ID HERE', range:'time!A:G'}
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


	getBusinessActivities(auth){
		return sheetsApi.values.getAsync({
			auth,
			spreadsheetId: data.activities.id,
			range: data.activities.range
		}).then((data) => {
			return data.values.slice(1);
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
