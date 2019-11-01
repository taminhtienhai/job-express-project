const AWS = require('aws-sdk')

AWS.config.update({
    accessKeyId: 'ASIA4P5MXXQW3LLO6CAH',
    secretAccessKey: '8ap2Bg4TsuzZLxO3LIH8sHFX/dcJE43bNvu97LI0',
    accessToken: 'FQoGZXIvYXdzEOv//////////wEaDGiDZWi94KGRNUqFniKGAhn5WOMBiy1PEppu5boc2PLqeutoV++7jf8VB/f3TP7Fig0CB+8q6iz7PVaH96Ez5hdPFEB5v3fYiG/I5MpSJKHVbsi2cU0wW+/8+iKxhL2H0v/Qdn3fwWrCexa6qkx7Nq991cVbJxrDE2wT3A1YjUxGO6zM9bqP5Gpgh9OB56PTGRtH8pxYLKJv89Dn88c/fRr9zN0bcpUeXFzJONPbWJPIWT+96Q7/Z5XpoZaT/G8gFkxnxEV4QGd19tSFDQ/CzDLByIKms8T7NsxewIn16Q2YXpV7qYNUMsV1+xCNvj6lgs1FVd6z5/exbrO4oypNMQccB12u4Dc6qwSufFiZnZZaNz0MjEoogpDu7QU=',
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