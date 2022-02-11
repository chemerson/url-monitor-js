
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
        pageHeight = (pageHeight > 15000) ? 15000 : pageHeight
        await timeout(2000)
    }
    await driver.executeScript("window.scrollTo(0, 0);");
    await timeout(1000)
  };

  function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  module.exports = {
    getPageHeight,
    lazyLoadPage
  }
