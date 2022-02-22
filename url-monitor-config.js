
const urlList = [
    'https://www.mitre.org/',
    'https://www.mitre.org/centers/we-operate-ffrdcs',
    'https://www.mitre.org/research/overview/whats-new'
]

const breakPoints = [1200, 1050, 769, 680]

const orgName = 'MITRE'

module.exports = {
    batchName: orgName + ' URLs',
    apiKey: process.env.APPLITOOLS_API_KEY,
    appName: orgName + ' UFG app',
    testName: orgName + ' UFG',
    log: false,
    envName: orgName + ' test environment',
    branchName: 'Demo ' + orgName + ' 999',
    jsLayoutBreakpoints: true,
    saveFailedTests: false,
    urls: urlList,
    breakPoints: breakPoints,
    localViewportX: 1080,
    localViewportY: 600,
    disableBrowserFetching: false
}


