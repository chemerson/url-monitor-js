
const urlList = [
    'https://www.huggies.com/en-us/'
]

const breakPoints = [1080, 896, 640, 530]

const orgName = 'Huggies (Kimberly-Clark)'

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


