const aws = require('./dynamodb')

const client = aws.client()
const dynamo = aws.dynamo()

module.exports = {
    createTable: function(param){
        dynamo.createTable(param,(err, data) => {
            if (err) {
                console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2))
            } else {
                console.log('Create succeeded:'+data)
            }
        })
    },
    addItem: function (param,callback) {
        client.put(param,(err, data) => {
            if (err) {
                console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2))
            } else {
                console.log("Added item:", data)
            }
            callback(err, data)
        })
    },
    addOneItem: function(param,callback) {
        dynamo.putItem(param,(err, data) => {
            if (err) {
                console.log("Unable to add One Item",err, err.stack)
            } else {
                console.log("Added One item:", data)
            }
            callback(err, data)
        })
    },
    updateItem: function (param,callback) {
        client.update(param, (err, data) => {
            if (err) {
                console.error("Unable to update item. Error JSON:", JSON.stringify(err, null, 2))
            } else {
                console.log('Create succeeded:'+data)
            }
            callback(err, data)
        })
    },
    deleteItem: function (param) {
        client.delete(param, function(err, data) {
            if (err) {
                console.error("Unable to delete item. Error JSON:", JSON.stringify(err, null, 2))
            } else {
                console.log("DeleteItem succeeded:", JSON.stringify(data, null, 2))
            }
        })
    },
    queryItem: function (param,callback) {
        client.query(param, function(err, data) {
            if (err)
                console.error("Unable to query. Error:", JSON.stringify(err, null, 2))
            else{
                console.log("Query Item success ",data.Items)
            }
            callback(err,data)
        })
    },
    scanItem: function (param,callback) {
        client.scan(param,(err, data) => {
            if(err)
                console.error("Unable to scan. Error:", JSON.stringify(err, null, 2));
            else{
                console.log("Scan Item success ",data.Items)
            }
            callback(err,data)
        })
    },
    getItem: function (param,callback) {
        dynamo.getItem(param, (err, data) => {
            if (err)
                console.log("Unable to get One Item",err, err.stack)
            else {
                console.log("Get Item Success")
            }
            callback(err, data)
        })
    }
}