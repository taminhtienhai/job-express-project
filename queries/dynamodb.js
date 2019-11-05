const AWS = require('aws-sdk')

AWS.config.update({
    accessKeyId: 'ASIA4P5MXXQWWP43O324',
    secretAccessKey: 'Zf91XsorGoLQb/McN8L/zYbOQ+26zgij/KpDdCGQ',
    sessionToken: 'FwoGZXIvYXdzEE0aDPTV1IzmzU2v6H/D8iLGAZ4gt3i7skgByA2uhhxTNb6iw0W24laQ' +
        'uIzZlbXMgo065/ubjQWKXXxQT7t5IyppsH/yIEdzCoOoXdK0iuBaOeYFj1pSAXRRI5cKbvv1GfF9HzAn/' +
        'Mtfixn3g/qDgAQoMvu+qZfPhwKYsW1K6pLU35i5SzhsgTX4gCTQjhTSXi8CPbctqXk02lRcbrJ4S4qERV31' +
        'ToAJEpyjzTjZzi8PAR/Ek7Us7KNrVA0/MNJdl1hfTz6E9AoyHxok7L8RVWv9Xfofov74UCig0IPuBTIt25c' +
        'jX8WZcN8dYQagdRR5EwHCpgXlO2LOf5gG2xQo0vgLtgH6ZK0OTwZ8jbc/',
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