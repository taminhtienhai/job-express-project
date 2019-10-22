const query = require('../table-queries')

let paramEm = {
    TableName: 'Employer',
    Key: {
        user: 'johnwick@gmail.com'
    },
    UpdateExpression: "set #name=:name, #pro=:pro, #address=:address," +
        "#contact_name=:contact_name, #contact_email=:contact_email, #benefits=:benefits,#logo=:logo",
    ExpressionAttributeNames: {
        '#name': 'company_name',
        '#pro': 'job_profess',
        '#address': 'address',
        '#contact_name': 'contact_name',
        '#contact_email': 'contact_email',
        '#benefits': 'benefits',
        '#logo': 'logo'
    },
    ExpressionAttributeValues: {
        ':name': 'Hai' ,
        ':pro': 'abc',
        ':address': '12 Nguyen Van Bao',
        ':contact_name': 'Hai',
        ':contact_email': 'abc@gmail.com',
        ':benefits': 'Laptop',
        ':logo': 'logo.jpg'
    },
    ReturnValue: "UPDATED_NEW"
}

query.updateItem(paramEm,()=>{})