'use strict';

//const loadLib = require('/Users/christopheremerson/Projects/javascript/scripts/lib/lazy-load')
const loadLib = require('/javascript/scripts/lib/lazy-load')
const resLib = require('/Users/christopheremerson/Projects/javascript/scripts/lib/display-results')
 
require('chromedriver'); // eslint-disable-line node/no-unpublished-require
const { Builder } = require('selenium-webdriver');
const { Eyes, 
        VisualGridRunner, 
        Target,
        FileLogHandler, 
        ConsoleLogHandler, 
        Configuration, 
        BrowserType, 
        BatchInfo,
        MatchLevel} = require('@applitools/eyes-selenium'); 

const perf = require('execution-time')();

(async () => {
  //Start a global timer
  const startTime = await printTime();
  await perf.start();

    // URLs to test
    var urls = [
      'https://www.carfax.com/',
      'https://www.carfax.com/Auto-Repair',
      'https://www.carfax.com/vehicle-history-reports/',
      'https://www.carfax.com/value/'
    ];


  try {

    var eyesConfig = {
      vx: 1024,
      vy: 700,
      batchName: 'Carfax URLs',
      apiKey: process.env.APPLITOOLS_API_KEY,
      appName: 'Carfax UFG app',
      testName: 'Carfax UFG',
      log: false,
      envName: 'Carfax test environment',
      branchName: 'Demo 996',
      matchLevel: MatchLevel.Strict,
      jsLayoutBreakpoints: true,
      saveFailedTests: false,
    }
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
        .setViewportSize({width: Number(eyesConfig.vx), height: Number(eyesConfig.vy)})
        .setLayoutBreakpoints(eyesConfig.jsLayoutBreakpoints)
        .setWaitBeforeScreenshots(500)
        .setWaitBeforeCapture(1500)

        ;
        
        // Define browsers for UFG by breakpoint
        let breakpoints = [1080, 896, 640, 530]
        breakpoints.forEach(element => {
          configuration
            .addBrowser(element, 800, BrowserType.CHROME)
            .addBrowser(element, 800, BrowserType.FIREFOX)
            .addBrowser(element, 800, BrowserType.SAFARI)
        })

    const eyes = new Eyes(new VisualGridRunner(100));
    eyes.setConfiguration(configuration);

    // if(eyesConfig.log) eyes.setLogHandler(new ConsoleLogHandler(true));
    if(eyesConfig.log) { 
      let logfileName = 'eyes-' + startTime + '.log';
      eyes.setLogHandler(new FileLogHandler(true, logfileName, false));
    }

    var driver = new Builder()
      .withCapabilities({browserName: 'chrome'})
      .build();

    await eyes.open(driver);

    var i;
    for(i=1;i<=urls.length;i++) {

      await driver.get(urls[i-1]);

      await driver.getTitle().then(function (title) {
        console.log('Testing URL ' + i + ': ' + title + ' ' + urls[i-1].toString());
      });

      // use this to clear warnings etc
      //try{await driver.findElement(By.css('body > ')).click();} catch {}

      await loadLib.lazyLoadPage(driver);

      try { 
          await eyes.check(urls[i-1].toString(), Target.window().fully()); 
        } catch (err) { 
            console.log("eyes.check ERROR: " + err.message);
      }
      
    }

    await console.log('Tests complete. Please wait as the grid renders the results...');
    await eyes.close(false);

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
    if(typeof driver !== 'undefined') await (await driver).quit();
    if(typeof eyes !== 'undefined') results = await eyes.getRunner().getAllTestResults(false);
  }
  
})();


function printTime() {
  let today = new Date(),
      h = today.getHours(),
      m = today.getMinutes(),
      s = today.getSeconds(),
      d = today.getDate(),
      mm = today.getMonth() + 1,
      yy = today.getFullYear();
  console.log(h + ":" + m + ":" + s);
  return (d + "-" + mm + "-" + yy + " " + h + ":" + m + ":" + s)
}

            /*
      await eyes.check(urls[i-1], Target
        .window()
        .fully()
        .layout(By.css('div')));
      */

async function evalChange(page, change) {
  switch (change) {
    case 1:
      await page.evaluate(rFile('test/changers/aligncenter.js'))
      break
    case 2:
      await page.evaluate(rFile('test/changers/replaceValue.js'))
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