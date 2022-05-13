
const urlList = [
    'https://www.usaa.com/',
    'https://www.usaa.com/inet/wc/bank-loan-auto-main?wa_ref=pub_global_banking_loans_auto',
    'https://www.usaa.com/inet/wc/bank-real-estate-mortgage-loans?wa_ref=pub_global_banking_home_mortgages_mortgages_main',
    'https://www.usaa.com/my/logon?logoffjump=true&wa_ref=pub_global_log_on'
]

const breakPoints = [1080, 896, 640, 530]

const orgName = 'USAA'

module.exports = {
    batchName: orgName + ' URLs',
    apiKey: process.env.APPLITOOLS_API_KEY,
    appName: orgName + ' UFG app',
    testName: orgName + ' UFG',
    log: false,
    envName: orgName + ' test environment',
    branchName: 'USAA 99',
    jsLayoutBreakpoints: true,
    saveFailedTests: false,
    urls: urlList,
    breakPoints: breakPoints,
    localViewportX: 1080,
    localViewportY: 600,
    disableBrowserFetching: false
}


