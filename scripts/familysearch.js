"use strict";

const loadLib = require("./lib/lazy-load");
const resLib = require("./lib/display-results");

const config = require("../url-monitor-config");
var fs = require("fs");

const chrome = require("selenium-webdriver/chrome");
require("chromedriver");
const { Builder, By } = require("selenium-webdriver");
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
    batchInfo.setSequenceName(config.testName + " Batch Progress");

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
      .setDisableBrowserFetching(config.disableBrowserFetching)
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

    const screen = {
      width: 1080,
      height: 600,
    };

    /*
    // Run headed with xvfb added to CI workflow
    var driver = new Builder()
      //.forBrowser('chrome')
      .setChromeOptions(new chrome.Options().windowSize(screen))
      .withCapabilities({ browserName: "chrome", headless: true })
      .build();
*/

    let executionCloudUrl = await Eyes.getExecutionCloudUrl();
    const driver = await new Builder()
      .withCapabilities({
        browserName: "chrome",
      })
      .usingServer(executionCloudUrl)
      .build();

    // Apply timeout for 10 seconds
    await driver.manage().setTimeouts({ implicit: 10000 });

    const urls = config.urls;
    var i;
    for (i = 1; i <= urls.length; i++) {
      // use this to clear warnings etc
      //try{await driver.findElement(By.css('body > ')).click();} catch {}

      try {
        await eyes.open(driver, config.appName, "Family Search");

        await driver.get("https://www.familysearch.org/en/");

        await eyes.check("Home", Target.window().fully());

        await driver
          .findElement(
            By.css(
              "span:nth-of-type(1) > div > div:nth-of-type(1) > .baseButtonCss_b1xt1j7b.ellipsisCss_e139x152.headerNavButtonCss_ht4d7cy.textButtonCss_t14vahhw"
            )
          )
          .click();
        /*
        await driver
          .findElement(
            By.css(
              "span:nth-of-type(1) > div > div:nth-of-type(2) > div > .openCloseAnimWrapperCss_o7qj68n > div[role='dialog'] > .e4_e9a8crf.elevationBaseCss_e1vn31hu ul[role='menu'] > li:nth-of-type(3) > a[role='menuitem'] > .containerCss_c1w181ss .gutterBoxCss_g1bzqt8e.rowCss_r1o18qf8"
            )
          )
          .click();
*/

        await eyes.check("Login", Target.window().fully());

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
  const path = "scripts/changers/";
  switch (change) {
    case 1:
      await driver.executeScript(rFile(path + "align-center.js"));
      break;
    case 2:
      await driver.executeScript(rFile(path + "change-bg-color.js"));
      break;
    case 3:
      await driver.executeScript(rFile(path + "change-margin.js"));
      break;
    case 4:
      await driver.executeScript(rFile(path + "remove-element.js"));
      break;
    case 5:
      await driver.executeScript(rFile(path + "replace-value.js"));
      break;
    case 6:
      await driver.executeScript(rFile(path + "skew-page.js"));
      break;
    default:
  }
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function rFile(fname) {
  try {
    const data = fs.readFileSync(fname, "utf8");
    return data;
  } catch (err) {
    console.error(err);
  }
}
