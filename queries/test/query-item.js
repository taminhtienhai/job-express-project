const query = require('../table-queries')

/*let params = {
    TableName: 'Account',
    FilterExpression: '#pass=:pass',
    ExpressionAttributeValues: {
        ':pass': 'HAI01629496858'
    },
    ExpressionAttributeNames: {
        '#pass': 'password'
    }
}

query.scanItem(params,()=>{})*/
/*let params = {
    TableName: 'Employer',
    IndexName: 'Account',
    KeyConditionExpression: '#user=:user',
    ExpressionAttributeValues: {
        ':user': 'hai@gmail.com'
    },
    ExpressionAttributeNames: {
        '#user': 'account.user'
    }
}

query.queryItem(params, () =>{})*/
let params= {
    TableName: 'Account',
    Key: {
        'user': {S: 'taminhtienhai@gmail.com'}
    }
}

query.getItem(params,()=>{})
