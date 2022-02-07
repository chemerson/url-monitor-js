let elems = await driver.findElements(By.css('[name=cfx-auto-complete]'))
if(elems.length>0) {
  let elem = await driver.findElement(By.css('[name=cfx-auto-complete]'))
  await elem.click()
  for(var j=0;j<20;j++) await elem.sendKeys(Key.BACK_SPACE)
  await elem.sendKeys('Pittsburgh, PA')
  await timeout(1000)
  await driver.findElement(By.css('[aria-label=\'Search\']')).click()
  await timeout(1000)
}