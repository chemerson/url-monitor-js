"use strict";

const loadLib = require("./lib/lazy-load");
const resLib = require("./lib/display-results");

const config = require("../url-monitor-config");

const chrome = require("selenium-webdriver/chrome");
require("chromedriver");
const { Builder, By, Key } = require("selenium-webdriver");
const {
  Eyes,
  VisualGridRunner,
  Target,
  ConsoleLogHandler,
  FileLogHandler,
  Configuration,
  BrowserType,
  BatchInfo,
  MatchLevel,
} = require("@applitools/eyes-selenium");

const perf = require("execution-time")();

(async () => {
  //Start a global timer
  const startTime = await printTime();
  await perf.start();

  try {
    var eyesConfig = {
      vx: config.localViewportX,
      vy: config.localViewportY,
      batchName: config.batchName,
      batchId: "urlmonitor" + startTime,
      apiKey: config.apiKey ? config.apiKey : process.env.APPLITOOLS_API_KEY,
      appName: config.appName,
      testName: config.testName,
      log: config.log,
      envName: config.envName,
      branchName: config.branchName,
      matchLevel: MatchLevel.Strict,
      jsLayoutBreakpoints: config.jsLayoutBreakpoints
        ? config.jsLayoutBreakpoints
        : false,
      saveFailedTests: config.saveFailedTests ? config.saveFailedTests : false,
    };
    const batchInfo = new BatchInfo(eyesConfig.batchName);
    batchInfo.setId(eyesConfig.batchId);

    const configuration = new Configuration();
    configuration

      .setApiKey(eyesConfig.apiKey)
      .setBatch(batchInfo)
      .setConcurrentSessions(5)
      .setAppName(eyesConfig.appName)
      .setTestName(eyesConfig.testName)
      .setMatchLevel(eyesConfig.matchLevel)
      .setSaveFailedTests(eyesConfig.saveFailedTests)
      .setBranchName(eyesConfig.branchName)
      .setBaselineBranchName(eyesConfig.branchName)
      .setHideScrollbars(true)
      .setSendDom(true)
      .setViewportSize({
        width: Number(eyesConfig.vx),
        height: Number(eyesConfig.vy),
      })
      .setLayoutBreakpoints(eyesConfig.jsLayoutBreakpoints)
      .setWaitBeforeScreenshots(1000)
      .setWaitBeforeCapture(2000);

    const bps = config.breakPoints;
    bps.forEach((bp) => {
      configuration
        .addBrowser(bp, 800, BrowserType.CHROME)
        .addBrowser(bp, 800, BrowserType.FIREFOX)
        .addBrowser(bp, 800, BrowserType.SAFARI);
    });

    const eyes = new Eyes(new VisualGridRunner(100));
    eyes.setConfiguration(configuration);

    if (eyesConfig.log) eyes.setLogHandler(new ConsoleLogHandler(true));
    /* if (eyesConfig.log) {
      let logfileName = 'eyes-' + startTime + '.log';
      eyes.setLogHandler(new FileLogHandler(true, logfileName, false));
    } */

    const screen = {
      width: 1080,
      height: 600,
    };
    // Run headed with xvfb added to CI workflow
    var driver = new Builder()
      .forBrowser('chrome')
      .setChromeOptions(new chrome.Options().headless().windowSize(screen))
      .withCapabilities({ browserName: "chrome", headless: true })
      .build();

    const urls = config.urls;
    for (let i = 1; i <= urls.length; i++) {
      await driver.get(urls[i - 1]);

      await driver.getTitle().then(function (title) {
        console.log(
          "Testing URL " + i + ": " + title + " " + urls[i - 1].toString()
        );
      });

      await loadLib.lazyLoadPage(driver);

      /*       
        Have to abandon for now awaits can't be used and that screws up the flow an I can't do any pauses
        if (config.seleniumCommands) {
        const commandArr = config.seleniumCommands
        try {
          //config.seleniumCommands.forEach(sc => eval(rFile(sc)))  // awaits not allowed
          let filedata
          for (let sc = 0; sc < config.seleniumCommands.length; sc++){
            filedata = await rFile(config.seleniumCommands[sc])
            await eval(filedata)
          }

        } catch (e) {
            console.log('Selenium helper exception: ' + e.msg)
        }
      } */

      // CarFax specific
      let elems = await driver.findElements(By.css("[name=cfx-auto-complete]"));
      if (elems.length > 0) {
        let elem = await driver.findElement(By.css("[name=cfx-auto-complete]"));
        await elem.click();
        for (var j = 0; j < 20; j++) await elem.sendKeys(Key.BACK_SPACE);
        await elem.sendKeys("Pittsburgh, PA");
        await timeout(1000);
        await driver.findElement(By.css("[aria-label='Search']")).click();
        await timeout(1000);
      }

      try {
        await eyes.open(driver, config.appName, urls[i - 1].toString());
        await eyes.check(urls[i - 1].toString(), Target.window().fully());
        await eyes.close(false);
      } catch (err) {
        console.log("eyes.check ERROR: " + err.message);
      }
    }

    await console.log(
      "Tests complete. Please wait as the grid renders the results..."
    );

    await driver.quit();
    const testResultsSummary = await eyes.getRunner().getAllTestResults(false);
    const resultsStr = await testResultsSummary
      .getAllResults()
      .map((testResultContainer) => {
        const testResults = testResultContainer.getTestResults();
        return testResults
          ? resLib.formatResults(testResults)
          : testResultContainer.getException();
      })
      .join("\n");
    await console.log("\nRender results:\n", resultsStr);

    await printTime();
    const results = await perf.stop();
    await console.log(results.preciseWords);
  } catch (err) {
    console.log("ERROR: " + err.message);
    if (typeof driver !== "undefined") await (await driver).quit();
    if (typeof eyes !== "undefined")
      results = await eyes.getRunner().getAllTestResults(false);
  }
})();

function printTime() {
  let today = new Date();
  const arr = [
    today.getHours().toString(),
    today.getMinutes().toString(),
    today.getSeconds().toString(),
    (today.getMonth() + 1).toString(),
    today.getDate().toString(),
    today.getFullYear().toString(),
  ];
  const t = arr.map((str) => str.padStart(2, "0"));
  const clock = t[0] + ":" + t[1] + ":" + t[2];

  console.log(clock);
  return t[3] + "-" + t[4] + "-" + t[5] + " " + clock;
}

async function evalChange(driver, change) {
  switch (change) {
    case 1:
      await driver.executeScript(rFile("test/changers/aligncenter.js"));
      break;
    case 2:
      await driver.executeScript(rFile("test/changers/replaceValue.js"));
      break;
    default:
  }
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function rFile(fname) {
  var fs = require("fs");
  try {
    var fdata;
    fdata = fs.readFileSync(fname, "utf8");
    return fdata;
  } catch (err) {
    console.error(err);
  }
}

function timeout(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
