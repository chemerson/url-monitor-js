
const urlList = [
   'https://www.dell.com',
   'https://www.dell.com/en-us/shop/desktop-computers/sc/desktops',
   'https://www.dell.com/en-us/shop/deals/business-desktop-deals
]

const breakPoints = [1080, 896, 640, 530]

const orgName = 'Dell'

module.exports = {
    batchName: orgName + ' URLs',
    apiKey: process.env.APPLITOOLS_API_KEY,
    appName: orgName + ' UFG app',
    testName: orgName + ' UFG',
    log: false,
    envName: orgName + ' test environment',
    branchName: 'Demo 993',
    jsLayoutBreakpoints: true,
    saveFailedTests: false,
    urls: urlList,
    breakPoints: breakPoints,
    localViewportX: 1080,
    localViewportY: 600,
    disableBrowserFetching: false
}


