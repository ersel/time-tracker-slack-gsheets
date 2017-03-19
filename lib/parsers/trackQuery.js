'use strict';

const trackQueryParser = {
	getQueryVariable(variable, query) {
		var vars = query.split('&');
		for (var i = 0; i < vars.length; i++) {
			var pair = vars[i].split('=');
			if (decodeURIComponent(pair[0]) === variable) {
				return decodeURIComponent(pair[1]);
			}
		}
		throw new Error(`Could not find ${variable} in the query string`);
	},

	validateTrackingInfo(command) {
		let parsedCommandLength = this.getQueryVariable('text', command).split('"').length;
		return (parsedCommandLength === 3);
	},

	extractTrackingInfo(command) {
		let parsedCommand = this.getQueryVariable('text', command).split('"').map(e => e.replace(/\+/g, ' ').trim());
		return {
			companyNumber: parsedCommand[0],
			activity: parsedCommand[1],
			duration: parsedCommand[2]
		};
	},

	extractSupplementaryInfo(command) {
		return {
			userName: this.getQueryVariable('user_name', command),
			userId: this.getQueryVariable('user_id', command),
			responseUrl: this.getQueryVariable('response_url', command)
		};
	}

};

module.exports = trackQueryParser;
