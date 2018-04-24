const path = require('path');

const {
    Builder,
    By,
    Key,
    until
} = require('selenium-webdriver');
const ChromeDriver = require('selenium-webdriver/chrome');

const options = new ChromeDriver.Options();
options.addArguments(
    'headless',
	"proxy-server='direct://'",
	"proxy-bypass-list=*",
    'disable-infobars',
    'disable-gpu',
    "window-size=1200x600",
    `user-data-dir=${path.resolve(__dirname, "chrome_userdata")}`,
);

(async function example() {
    console.log("browser building...");
    let driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();
    try {
        console.log("browser built, re-directing");
        // await driver.get('https://maimai-net.com/maimai-mobile/home/');
        await driver.get('https://maimai-net.com/maimai-mobile/home/');
        console.log('yay');

        const body = await driver.findElement(By.css('body'));
        console.log(await body.getText());
    } finally {
        console.log("quit");
        await driver.quit();
    }
})();