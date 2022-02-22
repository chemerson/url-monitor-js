
const urlList = [
    'https://www.equifax.com/',
    'https://www.equifax.com/personal/products/credit/monitoring-product-comparison/',
    'https://my.equifax.com/membercenter/#/login'
]

const breakPoints = [1080, 1024, 768, 576]

const orgName = 'Equifax'

module.exports = {
    batchName: orgName + ' URLs',
    apiKey: process.env.APPLITOOLS_API_KEY,
    appName: orgName + ' UFG app',
    testName: orgName + ' UFG',
    log: false,
    envName: orgName + ' test environment',
    branchName: 'Demo 888',
    jsLayoutBreakpoints: true,
    saveFailedTests: false,
    urls: urlList,
    breakPoints: breakPoints,
    localViewportX: 1080,
    localViewportY: 600,
    disableBrowserFetching: false
}


