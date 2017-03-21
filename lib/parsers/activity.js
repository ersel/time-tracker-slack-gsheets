'use strict';
const levenshtein = require('leven');

const activityParser = {
	validateInput(activity, parsedActivityList) {
		// search in the keys first, then the elements underneath
		let activityListArr = [];
		for (let prop in parsedActivityList) {
			activityListArr.push(prop);
			if (activity === prop) {
				return { valid: true, activity: prop };
			}
			for (let i = 0; i < parsedActivityList[prop].length; i++) {
				activityListArr.push(parsedActivityList[prop][i]);
				if(parsedActivityList[prop][i] === activity){
					return { valid: true, activity: prop };
				}
			}
		}

		let recommendationsArr = this.getRecommendations(activity, activityListArr);

		return {
			valid: false,
			recommendations: recommendationsArr.map(e => e.recommendation)
		};
	},

	getRecommendations(activity, activityList) {
		let recommendationsArr = [];
		for(let i = 0; i < activityList.length; i++) {
			let levenshteinDistance = levenshtein(activity, activityList[i]);
			let lengthOfLongerString = activity.length > activityList[i].length ? activity.length : activityList[i].length;
			recommendationsArr.push({
				recommendation: activityList[i],
				distance: levenshteinDistance,
				relativity: levenshteinDistance / lengthOfLongerString
			});
		}
		let sortRecommendationsArr = recommendationsArr.sort((a, b) => a.relativity - b.relativity).map(e => e.relativity);
		let firstQuartileValue = this.calculateFirstQuartile(sortRecommendationsArr);
		let finalRecommendations = recommendationsArr.filter(e => e.relativity <= firstQuartileValue);
		return finalRecommendations;
	},

	calculateMedian(arr) {
		if(arr.length % 2 === 0) {
			let midPosition = (arr.length) / 2;
			return (arr[midPosition - 1] + arr[midPosition]) / 2;
		} else {
			let midPosition = (arr.length + 1) / 2;
			return arr[--midPosition];
		}
	},

	calculateFirstQuartile(recommendationsArr) {
		// assumes array provided is SORTED!
		// https://en.wikipedia.org/wiki/Quartile#Method_1
		let lowerHalf;
		if (recommendationsArr.length % 2 === 0){
			lowerHalf = recommendationsArr.slice(0, recommendationsArr.length / 2);
		} else {
			let midPoint = ((recommendationsArr.length + 1 ) / 2) - 1;
			lowerHalf = recommendationsArr.slice(0, midPoint);
		}
		return this.calculateMedian(lowerHalf);
	}
};

module.exports = activityParser;
