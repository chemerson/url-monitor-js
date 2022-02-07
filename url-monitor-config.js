
const urlList = [
    'https://www.carfax.com/',
    'https://www.carfax.com/Auto-Repair',
    'https://www.carfax.com/vehicle-history-reports/',
    'https://www.carfax.com/value/'
]

const breakPoints = [1080, 896, 640, 530]

module.exports = {
    batchName: 'Carfax URLs',
    apiKey: process.env.APPLITOOLS_API_KEY,
    appName: 'Carfax UFG app',
    testName: 'Carfax UFG',
    log: false,
    envName: 'Carfax test environment',
    branchName: 'Demo 994',
    jsLayoutBreakpoints: true,
    saveFailedTests: false,
    urls: urlList,
    breakPoints: breakPoints,
    localViewportX: 1080,
    localViewportY: 600
}


