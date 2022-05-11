
const urlList = [
    'https://www.huggies.com/en-us/',
    'https://www.depend.com/en-us',
    'https://www.cottonelle.com/en-us/'
]

const breakPoints = [1300, 1023, 640, 400]

const orgName = 'Kimberly-Clark'

module.exports = {
    batchName: orgName + ' URLs',
    apiKey: process.env.APPLITOOLS_API_KEY,
    appName: orgName + ' UFG app',
    testName: orgName + ' UFG',
    log: false,
    envName: orgName + ' test environment',
    branchName: 'Huggies',
    jsLayoutBreakpoints: true,
    saveFailedTests: false,
    urls: urlList,
    breakPoints: breakPoints,
    localViewportX: 1080,
    localViewportY: 600,
    disableBrowserFetching: false
}


