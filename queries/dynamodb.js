const AWS = require('aws-sdk')

AWS.config.update({
    accessKeyId: 'ASIA4P5MXXQW2MJK5EDR',
    secretAccessKey: '9LWD7SMWd+LRGF/EvEemZ+zhvD/AWh5xKU6nklXK',
    sessionToken: 'FwoGZXIvYXdzEHsaDLSl2DIupOMkqkJbtSLGAfVTjFbBVIu' +
        'Rj5HZDZ9Sv97zBAoN7fR1rp2SDeX8m00Mxl9TREzLJQah/wycXaGPAzTKD' +
        'XStQ9j4u9b8slGwr+oPBZ12tI/bfenNUgdPgLvG3yxXBJT6kaBkVu+2pn5' +
        'DY3EP0u5buvLMZW2OY85HybwUwNAqpQqLLFpWaQOSP0azPkRuCqlbPZwU' +
        'uMWASt2MNocr75sKTCbY1cyH51ZJjHekXfMpsjTGD70PYNDfPrHe9CC8N6' +
        '88T4yjs2FwlLyI2lZ2BSIbLCjm443uBTItfbwcHiqgj345jAeVx0KnIy2' +
        'gWC0RpnmYVpU9GiWmvdKF+KJY1boMHgigF5Vv',
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