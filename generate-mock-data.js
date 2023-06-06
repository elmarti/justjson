const { faker } = require('@faker-js/faker');
const fs = require('fs');
const path = require('path');
const rows = 10000;

const tables = [{
    title: 'patient',
    columns: [{
        title: 'id',
        type: 'pk',
    },{
        title: 'created',
        type: 'datetime',
    },{
        title: 'updated',
        type: 'updated',
    },{
        title: 'user_id',
        type: 'pk'
    }, {
        title: 'guardian_phone_number',
        type: 'phone_number'
    }]
},{
    title: 'report',
    columns: [{
        title: 'id',
        type: 'pk',
    },{
        title: 'created',
        type: 'datetime',
    },{
        title: 'updated',
        type: 'updated',
    },{
        title: 'patient_id',
        type: 'int'
    }, {
        title: 'category',
        either: ['Anxiety', 'Depression']
    }, {
        title: 'patient_form_link',
        type: 'url'
    }]
},{
    title: 'patient_councillor',
    columns: [{
        title: 'id',
        type: 'pk',
    },{
        title: 'created',
        type: 'datetime',
    },{
        title: 'updated',
        type: 'updated',
    }, {
        title: 'patient_id',
        type: 'int'
    }, {
        title: 'councillor_id',
        type: 'int'
    }]
},{
    title: 'availability',
    columns: [{
        title: 'id',
        type: 'pk',
    },{
        title: 'created',
        type: 'datetime',
    },{
        title: 'updated',
        type: 'updated',
    }, {
        title: 'availability',
        type: 'datetime'
    }, {
        title: 'councillor_id',
        type: 'int'
    }]
},{
    title: 'appointment',
    columns: [{
        title: 'id',
        type: 'pk',
    },{
        title: 'created',
        type: 'datetime',
    },{
        title: 'updated',
        type: 'updated',
    }, {
        title: 'availability_id',
        type: 'int'
    }, {
        title: 'patient_id',
        type: 'int'
    },{
        title: 'confirmed',
        type: 'boolean'
    }]
},{
    title: 'notes',
    columns: [{
        title: 'id',
        type: 'pk',
    },{
        title: 'created',
        type: 'datetime',
    },{
        title: 'updated',
        type: 'updated',
    }, {
        title: 'content',
        type: 'text'
    }, {
        title: 'patient_id',
        type: 'int'
    }]
},{
    title: 'rating',
    columns: [{
        title: 'id',
        type: 'pk',
    },{
        title: 'created',
        type: 'datetime',
    },{
        title: 'updated',
        type: 'updated',
    }, {
        title: 'appointment_id',
        type: 'int'
    }, {
        title: 'value',
        type: 'rating'
    }, {
        title: 'note',
        type: 'text'
    }]
},{
    title: 'account',
    columns: [{
        title: 'id',
        type: 'pk',
    },{
        title: 'created',
        type: 'datetime',
    },{
        title: 'updated',
        type: 'updated',
    }, {
        title: 'email',
        type: 'email'
    }, {
        title: 'password',
        type: 'random'
    }, {
        title: 'first_name',
        type: 'first_name'
    }, {
        title: 'last_name',
        type: 'last_name'
    }, {
        title: 'gender',
        either: ['M', 'F']
    }, {
        title: 'phone_number',
        type: 'phone_number'
    }, {
        title: 'address',
        type: 'address'
    }, {
        title: 'national_identity',
        type: 'phone_number'
    }, {
        title: 'role',
        value: 'User'
    }, {
        title: 'is_active',
        value: true
    }]
}, {
    title: 'councillor',
    columns: [{
        title: 'id',
        type: 'pk',
    },{
        title: 'created',
        type: 'datetime',
    },{
        title: 'updated',
        type: 'updated',
    }, {
        title: 'specialization',
        either: ['Anxiety', 'Depression']
    }, {
        title: 'description',
        type: 'text'
    }, {
        title: 'user_id',
        type: 'pk'
    }]
},{
    title: 'price_log',
    columns: [{
        title: 'id',
        type: 'pk',
    },{
        title: 'created',
        type: 'datetime',
    },{
        title: 'updated',
        type: 'updated',
    }, {
        title: 'amount_in_pkr',
        type: 'int'
    }, {
        title: 'payment_method',
        value: 'bank_transfer'
    }, {
        title: 'is_active',
        value: true
    }, {
        title: 'councillor_id',
        type:'pk'
    }]
}]

function makeid(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
}
let councillorId = 0;
// A little hack to ensure the `updated` value is always greater than or equal to the `created` date
let lastDate = new Date();
let pkCount = {};

function resolveData(data){
    if(typeof data.value !== 'undefined'){
        return data.value;
    }
    if(typeof data.either !== 'undefined'){
        const random = Math.floor(Math.random() * data.either.length);
        return data.either[random];
    }
    switch(data.type) {
        case 'pk':
            if(typeof pkCount[data.title] === 'undefined'){
                pkCount[data.title] = 0; 
            }
            return pkCount[data.title]++;
        case 'int':
            return Math.floor(Math.random() * (rows - 0 + 1) + 0);
        case 'rating':
            return Math.floor(Math.random() * (5 - 0 + 1) + 0);
        case 'datetime':
            lastDate = faker.date.past();
            return faker.date.past();
        case 'updated':
            return faker.date.between({from:lastDate,to:new Date()});
        case 'phone_number':
            return faker.phone.number();
        case 'url':
            return faker.internet.url();
        case 'boolean':
            return faker.datatype.boolean();
        case 'email':
            return faker.internet.email();
        case 'random':
            return makeid(50);
        case 'text':
            return faker.lorem.paragraph();
        case 'address':
            const coordinates = faker.location.nearbyGPSCoordinate({origin:[24.8607, 67.0011], radius: 1000});
            return {
                address: faker.location.streetAddress(),
                location: {
                    lat: coordinates[0],
                    lng: coordinates[1],
                },
                placeId: 'ChIJrTLr-GyuEmsRBfy61i59si0',
                region: 'PK'
            };
        case 'first_name':
            return faker.person.firstName();
        case 'last_name':
            return faker.person.lastName();
        default:
            throw new Error(`Missing handler ${data.type}`);


        }
}
for(const table of tables){
    console.log('creating table', table.title);
    const dummyData = [];
    pkCount = {};
    for(let i = 0; i< rows; i++){
        const newRow = {};
        for(const column of table.columns){
            newRow[column.title] = resolveData(column);
        }
        dummyData.push(newRow);
    }
    const output = path.join(__dirname, 'output', `${table.title}.json`);
    fs.writeFileSync(output, JSON.stringify(dummyData, null, 2));
    
}