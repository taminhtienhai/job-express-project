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
        user: 'martin12@gmail.com',
        name: 'Martins'
    }
}

query.addItem(params,()=>{})
