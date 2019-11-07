const AWS = require('aws-sdk')

AWS.config.update({
    accessKeyId: 'ASIA4P5MXXQW4S3XTXOY',
    secretAccessKey: 'sqpnekZ3pm08avUIzEOYlVC4qADBoKnQKLfDP7GW',
    sessionToken: 'FwoGZXIvYXdzEHkaDE9Q2ocjO3L/rqqx5CLGAQ1ZeTS6w9XmS9' +
        'jxE9rVmI17IJ7FzrZDemrlW35heU5KMHOg4zJIP6zltwU2BYWkwRR/7X9o3Y' +
        'ZbOgb7Cf85TEFjqUA0FNEOH8WwT01IedaYuUGwSlNfTRuBLKuI7PCsu3Imge1' +
        'HbJj6I8QrlBtaHEfvBlTeO3LvDBWvS2AgDmVvoia5R/R/8e/C+97ZO5R2Si5' +
        'SvRZLYg4iTknYih0zgs3fNB//zzYrd9wy23znu7TMCE/S1mEKrhP5IU8U96O' +
        'CwMm1w5Te0ijar43uBTIte0IMr4ywYyFAanK0HstoFS+tTwMXFITESfUcgR8' +
        'STDSuMw25j94bruc+eP/L',
    region: 'us-east-1'
})

module.exports = {
    dynamo: () => {
        return new AWS.DynamoDB()
    },
    client: () => {
        return new AWS.DynamoDB.DocumentClient()
    }
}