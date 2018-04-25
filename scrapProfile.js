const { withSingle, withObject } = require('./driverCssElToText.js');

module.exports = async function (driver) {
	const ret = {
		...(await withObject(driver, {
			name: ".status_data > :nth-child(1) > a",
			title: ".status_data > :nth-child(2) > span",
			rank: ".status_data > :nth-child(3) > span",
		})),
		rankMax: undefined,
		usageRight: {
			status: undefined,
			statusDescription: undefined,
			until: undefined,
			daysLeft: undefined,
		}
	};

	const [txtUsageRight, txtUsageRightUntil] = (await withSingle(driver, ".status_riyouken"))
	.trim()
	.split('\n')
	.map((e) => e.trim());

	const [, usageRight, usageRightDescription] = /利用権　：((.+))（(.+)）/i.exec(txtUsageRight);
	ret.usageRight.status = (usageRight === '○');
	ret.usageRight.statusDescription = usageRightDescription;

	const [, untilYear, untilMonth, untilDate, untilDays] = /利用期限：(\d+)\/(\d+)\/(\d+)（(\d+) 日）/i.exec(txtUsageRightUntil).map((e) => Number.parseInt(e, 10));

	ret.usageRight.until = new Date(Date.UTC(untilYear, untilMonth, untilDate, 0, 0, 0));
	ret.usageRight.daysLeft = untilDays;

	if (!ret.rank) return ret;

	const [, rank, rankMax] = /(\d+\.\d+)（MAX (\d+\.\d+)）/i.exec(ret.rank);
	ret.rank = rank;
	ret.rankMax = rankMax;

	return ret;
};