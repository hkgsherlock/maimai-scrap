const {
    By,
} = require('selenium-webdriver');
const asyncMap = require('asyncmap');

const self = module.exports = {
	withSingle: async function (driver, css) {
		const el = await driver.findElement(By.css(css));
		return el.getText();
	},
	withObject: async function (driver, obj) {
		const entries = await asyncMap(
			Object.entries(obj),
			async ([k, v]) => ({ [k]: await self.withSingle(driver, v) })
		);

		return Object.assign(
			...entries,
		);
	},
};