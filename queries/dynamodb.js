const AWS = require('aws-sdk')

AWS.config.update({
    region: 'us-east-1',
    endpoint: 'http://localhost:8000'
})

module.exports = {
    dynamo: () => {
        return new AWS.DynamoDB()
    },
    client: () => {
        return new AWS.DynamoDB.DocumentClient()
    }
}