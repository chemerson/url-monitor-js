'use strict';

const loadLib = require('./lib/lazy-load')
const resLib = require('./lib/display-results')

const config = require('../url-monitor-config')
var fs = require('fs');

const chrome = require('selenium-webdriver/chrome');
require('chromedriver');
const { Builder } = require('selenium-webdriver');
const { Eyes,
  VisualGridRunner,
  Target,
  ConsoleLogHandler,
  FileLogHandler,
  Configuration,
  BrowserType,
  BatchInfo,
  MatchLevel } = require('@applitools/eyes-selenium');

const perf = require('execution-time')();

(async () => {
  //Start a global timer
  const startTime = await printTime();
  await perf.start();


  try {

    var eyesConfig = {
      vx: config.localViewportX,
      vy: config.localViewportY,
      batchName: config.batchName,
      batchId: 'urlmonitor' + startTime,
      apiKey: config.apiKey ? config.apiKey : process.env.APPLITOOLS_API_KEY,
      appName: config.appName,
      testName: config.testName,
      log: config.log,
      envName: config.envName,
      branchName: config.branchName,
      matchLevel: MatchLevel.Strict,
      jsLayoutBreakpoints: config.jsLayoutBreakpoints ? config.jsLayoutBreakpoints : false,
      saveFailedTests: config.saveFailedTests ? config.saveFailedTests : false,
    }
    const batchInfo = new BatchInfo(eyesConfig.batchName);
    batchInfo.setId(eyesConfig.batchId);
    batchInfo.setSequenceName(config.testName + ' Batch Progress')

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
      .setViewportSize({ width: Number(eyesConfig.vx), height: Number(eyesConfig.vy) })
      .setLayoutBreakpoints(eyesConfig.jsLayoutBreakpoints)
      .setWaitBeforeScreenshots(1000)
      .setWaitBeforeCapture(2000)

      ;

    const bps = config.breakPoints
    bps.forEach(bp => {
      configuration
        .addBrowser(bp, 800, BrowserType.CHROME)
        .addBrowser(bp, 800, BrowserType.FIREFOX)
        .addBrowser(bp, 800, BrowserType.SAFARI)
    })

    const eyes = new Eyes(new VisualGridRunner(100));
    eyes.setConfiguration(configuration);

     if(eyesConfig.log) eyes.setLogHandler(new ConsoleLogHandler(true));
    /* if (eyesConfig.log) {
      let logfileName = 'eyes-' + startTime + '.log';
      eyes.setLogHandler(new FileLogHandler(true, logfileName, false));
    } */

    const screen = {
      width: 1080,
      height: 600
    };
    // Run headed with xvfb added to CI workflow
    var driver = new Builder()
      //.forBrowser('chrome')
      .setChromeOptions(new chrome.Options().headless().windowSize(screen))
      .withCapabilities({ browserName: 'chrome' , headless: true})
      .build();

    const urls = config.urls
    var i;
    for (i = 1; i <= urls.length; i++) {

      await driver.get(urls[i - 1]);

      await driver.getTitle().then(function (title) {
        console.log('Testing URL ' + i + ': ' + title + ' ' + urls[i - 1].toString());
      });

      // use this to clear warnings etc
      //try{await driver.findElement(By.css('body > ')).click();} catch {}

      await loadLib.lazyLoadPage(driver);

      await evalChange(driver, 0)

      try {
        await eyes.open(driver, config.appName, urls[i - 1].toString())
        await eyes.check(urls[i - 1].toString(), Target.window().fully())
        await eyes.close(false)
      } catch (err) {
        console.log("eyes.check ERROR: " + err.message);
      }

    }

    await console.log('Tests complete. Please wait as the grid renders the results...');

    await driver.quit();
    const testResultsSummary = await eyes.getRunner().getAllTestResults(false);
    const resultsStr = await testResultsSummary
      .getAllResults()
      .map(testResultContainer => {
        const testResults = testResultContainer.getTestResults()
        return testResults ? resLib.formatResults(testResults) : testResultContainer.getException()
      })
      .join('\n')
    await console.log('\nRender results:\n', resultsStr)


    await printTime();
    const results = await perf.stop();
    await console.log(results.preciseWords);

  } catch (err) {
    console.log("ERROR: " + err.message);
    if (typeof driver !== 'undefined') await (await driver).quit();
    if (typeof eyes !== 'undefined') results = await eyes.getRunner().getAllTestResults(false);
  }

})();


function printTime() {
  let today = new Date()
  const arr = [
    today.getHours().toString(),
    today.getMinutes().toString(),
    today.getSeconds().toString(),
    (today.getMonth() + 1).toString(),
    today.getDate().toString(),
    today.getFullYear().toString()
  ]
  const t = arr.map(str => str.padStart(2, '0'));
  const clock = t[0] + ":" + t[1] + ":" + t[2]

  console.log(clock);
  return (t[3] + "-" + t[4] + "-" + t[5] + " " + clock)
}

async function evalChange(driver, change) {
  const path = 'scripts/changers/'
  switch (change) {
    case 1:
      await driver.executeScript(rFile(path + 'align-center.js'))
      break
    case 2:
      await driver.executeScript(rFile(path + 'change-bg-color.js'))
      break
    case 3:
      await driver.executeScript(rFile(path + 'change-margin.js'))
      break
    case 4:
      await driver.executeScript(rFile(path + 'remove-element.js'))
      break
    case 5:
      await driver.executeScript(rFile(path + 'replace-value.js'))
      break
    case 6:
      await driver.executeScript(rFile(path + 'skew-page.js'))
      break
    default:
  }
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function rFile(fname) {
  try {
    const data = fs.readFileSync(fname, 'utf8')
    return data
  } catch (err) {
    console.error(err)
  }
}

