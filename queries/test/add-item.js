const query = require('../table-queries')

/*
let params = {
    TableName: 'Employer',
    Item: {
        company_name: 'IOT COP',
        account: { user: 'taminhtienhai@gmail.com' }
    }
}

query.addItem(params)*/

let params = {
    TableName: 'Account',
    Item: {
        user: 'andrew@gmail.com',
        password: '123456'
    }
}

query.addItem(params,()=>{})
