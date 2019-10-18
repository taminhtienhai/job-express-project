const query = require('../table-queries')

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

query.createTable(params)