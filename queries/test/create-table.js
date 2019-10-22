const query = require('../table-queries')
const aws = require('../dynamodb')

const client = aws.client()
const dynamo = aws.dynamo()

/*
let params = {
    TableName: 'Employer',
    AttributeDefinitions: [
        { AttributeName: 'user',AttributeType: 'S' },
        { AttributeName: 'company_name',AttributeType: 'S' }
    ],
    KeySchema: [
        { AttributeName: 'user',KeyType: 'HASH' }
    ],
    GlobalSecondaryIndexes:[
        {
        IndexName: 'Company',
        Projection: {
            ProjectionType: "ALL"
        },
        KeySchema: [
            { AttributeName: 'company_name', KeyType: 'HASH' }
        ],
        ProvisionedThroughput: {
            ReadCapacityUnits: 10,
            WriteCapacityUnits: 10
        }
    }
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 10,
        WriteCapacityUnits: 10
    }
}

query.createTable(params)*/

/*let params = {
    TableName: 'SessionsTable',
    AttributeDefinitions: [
        {AttributeName: 'id', AttributeType: 'N'}
    ],
    KeySchema: [
        {AttributeName: 'id', KeyType: 'HASH'}
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 10,
        WriteCapacityUnits: 10
    }
}

let pa  = {
    TableName: 'SessionsTable', /!* required *!/
    TimeToLiveSpecification: { /!* required *!/
        AttributeName: 'ttl', /!* required *!/
        Enabled: true /!* required *!/
    }
}

query.createTable(params)
dynamo.updateTimeToLive(pa,(err, data) => {
    if (err)
        console.log(err)
})*/
let params = {
    TableName: 'JobInfo',
    AttributeDefinitions: [
        {AttributeName: 'user', AttributeType: 'S'}
    ],
    KeySchema: [
        {AttributeName: 'user', KeyType: 'HASH'}
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 10,
        WriteCapacityUnits: 10
    }
}
query.createTable(params)