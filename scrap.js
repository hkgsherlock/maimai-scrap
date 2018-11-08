const path = require('path');

const {
    Builder,
    By,
    Key,
    until
} = require('selenium-webdriver');
const ChromeDriver = require('selenium-webdriver/chrome');

const dotenv = require('dotenv')

dotenv.config()

const scrapHome = require('./scrapHome.js');

const options = new ChromeDriver.Options();
options.addArguments(
    // 'headless',
	"proxy-server='direct://'",
	"proxy-bypass-list=*",
    'disable-infobars',
    'disable-gpu',
    "window-size=360x640",
    `user-data-dir=${path.resolve(__dirname, "chrome_userdata")}`,
);

(async function example() {
    let driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();
    try {
        await driver.get('https://maimai-net.com/maimai-mobile/home/');

        await driver.executeScript([
    		`document.querySelector('form > input[name="segaId"]').value = "` + process.env.SEGAID_USER + `";`,
    		`document.querySelector('form > input[name="passWd"]').value = "` + process.env.SEGAID_PASS + `";`,
    	].join(''));

        const form = await driver.findElement(By.css('form'));
        await form.submit();

        // const body = await driver.findElement(By.css('body'));
        // console.log(await body.getText());
        console.log(await scrapHome(driver));
    } catch(e) {
        console.error("eew, ", e);
    } finally {
        console.warn("quit");
        await driver.quit();
    }
})();