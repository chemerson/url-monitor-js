
const urlList = [
   // 'https://www.wikipedia.com/',
   // 'https://www.wikinews.org/',
    'https://www.pnc.com/en/personal-banking.html',
    'https://secure.pnc.com/web-auth/enrollment/verify-identity',
    'https://www.pnc.com/en/corporate-and-institutional.html',
    'https://www.pnc.com/en/customer-service.html?lnksrc=topnav'
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
    branchName: 'PNC 98',
    jsLayoutBreakpoints: true,
    saveFailedTests: false,
    urls: urlList,
    breakPoints: breakPoints,
    localViewportX: 1080,
    localViewportY: 600,
    disableBrowserFetching: false
}


