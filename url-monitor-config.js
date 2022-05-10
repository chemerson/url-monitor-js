
const urlList = [
   // 'https://www.wikipedia.com/',
   // 'https://www.wikinews.org/',
    'https://www.pnc.com/en/personal-banking.html'
]

const breakPoints = [1080, 896, 640, 530]

const orgName = 'PNC'

module.exports = {
    batchName: orgName + ' URLs',
    apiKey: process.env.APPLITOOLS_API_KEY,
    appName: orgName + ' UFG app',
    testName: orgName + ' UFG',
    log: false,
    envName: orgName + ' test environment',
    branchName: 'PNC 99',
    jsLayoutBreakpoints: true,
    saveFailedTests: false,
    urls: urlList,
    breakPoints: breakPoints,
    localViewportX: 1080,
    localViewportY: 600,
    disableBrowserFetching: false
}


