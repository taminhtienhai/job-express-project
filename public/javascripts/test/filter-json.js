var json = [
    {
        name: 'Hai',
        age: 18
    },
    {
        name: 'Bao',
        age: 19
    },
    {
        name: 'Hong',
        age: 20
    }
]

let data = json.filter(dataObject =>{
    return dataObject.age <= 19
}).map(value => {
    value.size = 3
    return value
})

console.log(data)