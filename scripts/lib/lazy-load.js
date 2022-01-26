
const sleep = require('sleep');

async function getPageHeight(driver) {
    var clientHeight = await driver.executeScript("return document.documentElement.clientHeight");
    var bodyClientHeight = await driver.executeScript("return document.body.clientHeight");
    var scrollHeight = await driver.executeScript("return document.documentElement.scrollHeight");
    var bodyScrollHeight = await driver.executeScript("return document.body.scrollHeight");
    var maxDocElementHeight = Math.max(clientHeight, scrollHeight);
    var maxBodyHeight = Math.max(bodyClientHeight, bodyScrollHeight);
    return Math.max(maxDocElementHeight, maxBodyHeight);
  };
  
  async function lazyLoadPage(driver) {
    var height =  await driver.executeScript("return window.innerHeight");
    var pageHeight = await getPageHeight(driver);
    for (var j = 0; j < pageHeight; j += (height - 15)) {
        await driver.executeScript("window.scrollTo(0," + j + ")");
        height =  await driver.executeScript("return window.innerHeight");
        pageHeight = await getPageHeight(driver);
        sleep.msleep(1500);
    }
    await driver.executeScript("window.scrollTo(0, 0);");
  };

  module.exports = {
    getPageHeight,
    lazyLoadPage
  }