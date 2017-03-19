'use strict';

const mmssRegex = /^(\d{2}):(\d{2})/;
const hhmmssRegex = /^(\d{2}):(\d{2}):(\d{2})/;
const shorthandDurationRegex = /^(\d+)[h|m|s]$/;

const parser = {

	validateMinutesSeconds(timePart) {
		timePart = parseInt(timePart, 10);
		if(timePart >= 0 && timePart <= 59) {
			return true;
		} else {
			return false;
		}
	},

	validateHours(hours) {
		hours = parseInt(hours, 10);
		if(hours >= 0 && hours <= 24) {
			return true;
		} else {
			return false;
		}
	},

	calculateDurationInSeconds(duration) {
		let SecondsInAnHour = 3600;
		let SecondsInAMinute = 60;
		return (duration.hours * SecondsInAnHour) + (duration.minutes * SecondsInAMinute) + duration.seconds;
	},

	extractDuration(duration) {
		let returnObj = {
			hours: 0,
			minutes: 0,
			seconds: 0
		};

		if(duration.type === 'mm:ss'){
			let durationParts = duration.value.match(mmssRegex).map(e => parseInt(e, 10));
			returnObj.minutes = durationParts[1];
			returnObj.seconds = durationParts[2];
		} else if (duration.type === 'hh:mm:ss') {
			let durationParts = duration.value.match(hhmmssRegex).map(e => parseInt(e, 10));
			returnObj.hours = durationParts[1];
			returnObj.minutes = durationParts[2];
			returnObj.seconds = durationParts[3];
		} else if (duration.type === 'h') {
			let durationParts = duration.value.match(shorthandDurationRegex).map(e => parseInt(e, 10));
			returnObj.hours = durationParts[1];
		} else if (duration.type === 'm') {
			let durationParts = duration.value.match(shorthandDurationRegex).map(e => parseInt(e, 10));
			returnObj.minutes = durationParts[1];
		} else if (duration.type === 's') {
			let durationParts = duration.value.match(shorthandDurationRegex).map(e => parseInt(e, 10));
			returnObj.seconds = durationParts[1];
		} else {
			throw new Error('Invalid duration type was provided.');
		}

		return returnObj;
	},

	identifyDuration(duration) {
		// hh:mm:ss or mm:ss
		// 1h or 10m or 20s
		duration = duration.trim().toLowerCase();
		if (duration.indexOf(':') !== -1) {
			// depending on number of : chars find out which regex to use
			let timeBlock = duration.split(':').length - 1;
			if (timeBlock === 1) {
				let durationParts = duration.match(mmssRegex);
				if (durationParts
					&& this.validateMinutesSeconds(durationParts[1])
					&& this.validateMinutesSeconds(durationParts[2])) {
					return {valid: true, type: 'mm:ss'};
				} else {
					return {valid: false, type: 'mm:ss'};
				}
			} else if (timeBlock === 2) {
				let durationParts = duration.match(hhmmssRegex);
				if (durationParts
					&& this.validateHours(durationParts[1])
					&& this.validateMinutesSeconds(durationParts[2])
					&& this.validateMinutesSeconds(durationParts[3])) {
					return {valid: true, type: 'hh:mm:ss'};
				} else {
					return {valid: false, type: 'hh:mm:ss'};
				}
			} else {
				return {valid: false, type: '??:??'};
			}
		} else if (duration.indexOf('h') !== -1) {
			if (shorthandDurationRegex.test(duration)) {
				return {valid: true, type: 'h'};
			} else {
				return {valid: false, type: 'h'};
			}
		} else if (duration.indexOf('m') !== -1) {
			if (shorthandDurationRegex.test(duration)) {
				return {valid: true, type: 'm'};
			} else {
				return {valid: false, type: 'm'};
			}
		} else if (duration.indexOf('s') !== -1) {
			if (shorthandDurationRegex.test(duration)) {
				return {valid: true, type: 's'};
			} else {
				return {valid: false, type: 's'};
			}
		} else {
			return {valid: false, type: '?'};
		}
	}
};

module.exports = parser;
