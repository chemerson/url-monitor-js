
const urlList = [
    'https://www.dell.com/support/order-status/en-us/order-support',
    'https://dell-federal.custhelp.com/app/orders/search?ref=ordexphomefedstatus',
    'https://www.dell.com/en-us/work/search/servers',
    'https://www.dell.com/en-us/dt/payment-solutions/index.htm#tab0=0'
]

const breakPoints = [1080, 896, 640, 530]

module.exports = {
    batchName: 'Dell URLs',
    apiKey: process.env.APPLITOOLS_API_KEY,
    appName: 'Dell SC UFG app',
    testName: 'Dell UFG',
    log: false,
    envName: 'Dell test environment',
    branchName: 'Demo 990',
    jsLayoutBreakpoints: true,
    saveFailedTests: false,
    urls: urlList,
    breakPoints: breakPoints,
    localViewportX: 1080,
    localViewportY: 600
}


