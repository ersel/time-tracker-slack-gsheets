'use strict';
const request = require('request-promise');

// Be nice...
const listOfCompliments = [
	'You are doing great!',
	'Is that your picture next to *over-achiever* in the dictionary?',
	'On a scale of 1 to 10, you are an 11.',
	'You are making a difference.',
	'You should be thanked more often. So thank you!',
	'You are a great example to others.',
	'You are great at getting stuff done!',
	'Your productivity seems limitless.',
	'Actions speak louder than words, and yours tell an incredible story.',
	'You are really something special.',
	'You are a gift to those around you.',
	'You should be promoted to Head of Getting Stuff Done.',
	'You are a bucket of awesome.',
	'Your work has a superior quality.',
	'You made it happen! Congrats!',
	'Keep up the good work!',
	'Amazing effort! You must be proud of yourself!',
	'Phenomenal!',
	'That was quick!'
];

// This module compiles `helpful` messages
// to be delivered to end users on Slack
const responses = {

	invalidArgumentLength(){
		let response = [];
		response.push('Time Track command *requires 3 arguments.*');
		response.push('e.g: `/track 09205274 "activity" 12m`');
		response.push('p.s. "activity" needs to be in quotes...');
		return response.join('\n');
	},

	invalidCompanyNumber(invalidCompanyNumber) {
		let response = [];
		response.push(`*${invalidCompanyNumber}* is not a valid UK company number`);
		response.push('UK Limited company numbers can be in one of the following formats:');
		response.push('```12345678 - 8 digits for companies registered in England & Wales');
		response.push('SC123456 - SC followed by 6 digits for companies registered in Scotland');
		response.push('NI123456 - NI followed by 6 digits for companies registered in Northern Ireland```');
		return response.join('\n');
	},

	invalidActivity(invalidActivity, recommendations) {
		let recommendationsList = recommendations.join(', ');
		let response = [];
		response.push(`*${invalidActivity}* is not a known business activity.`);
		response.push(`*Did you mean: * ${recommendationsList}`);
		response.push('Type `/track list` to see a full list of known business activities');
		response.push('You could add a new activity by going to the Google Spreedsheet, type `/track url`');
		return response.join('\n');
	},

	invalidDuration(invalidDuration) {
		let response = [];
		response.push(`*${invalidDuration}* is not a valid duration.`);
		response.push('Duration can be supplied in one of the following formats:');
		response.push('```40s => 40 seconds');
		response.push('12m => 12 minutes');
		response.push('2h => 2 hours');
		response.push('12:20 => 12 minutes 20 seconds');
		response.push('02:12:20 => 2 hours 12 minutes 20 seconds');
		response.push('Note: 1:20 and 1:20:20 are not valid formats, you need to include the leading 0.```');
		return response.join('\n');
	},

	getCompliment() {
		let magic = Math.random();
		// compilement often, not always
		if(magic <= 0.4){
			return listOfCompliments[Math.floor(magic * listOfCompliments.length)];
		} else {
			return '';
		}
	},

	recordSuccess(activity, duration, companyNumber, user){
		let response = [];
		let compliment = this.getCompliment();
		response.push(`@${user} has just recorded an activity.`);
		response.push(`${companyNumber}: ${activity} - ${duration}`);
		response.push(`Great work @${user}! ${compliment} :tada:`);
		return response.join('\n');
	},

	listOfActivities(activities){
		let response = [];
		response.push('Here is a list of all recognized business activities.');
		response.push('```');
		for (var property in activities) {
			if (activities.hasOwnProperty(property)) {
				response.push(`${property} - ${activities[property].join(', ')}`);
			}
		}
		response.push('```');
		response.push('Cant see what you are looking for? You can add new activities by going to the spreadsheet, type `/track url`');
		return response.join('\n');
	},

	returnSpreadsheetURL(sheetId){
		return `https://docs.google.com/spreadsheets/d/${sheetId}/edit#gid=0`;
	},

	respondWith(message, callbackUrl, type) {
		let responseType = type || 'ephemeral';
		let options = {
			uri: callbackUrl,
			method: 'POST',
			json: {
				'response_type': responseType,
				'text': message,
				'attachments': []
			}
		};

		return request.post(options).then(() => {
			return options;
		});
	}
};

module.exports = responses;
