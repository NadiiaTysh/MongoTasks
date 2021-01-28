load('./random.js');
use ntyshko;

db.customers.drop();
db.orders.drop();

db.createCollection('customers');
db.createCollection('orders');

const customers = [];

for (let i = 0; i < 3000; i++) {
    const customer = {
        name: {
            first: faker.fName(),
            last: faker.lName()
        },
        balance: randomNumber(10000, 15000),
        created: new Date().toISOString(),
    };
    customers.push(customer);
};

const { insertedIds } = db.customers.insertMany(customers);

const orders = [];

insertedIds.forEach(id => {
    const quantity = Math.floor(Math.random() * 10) + 1;
   
    for (let i = 0; i < quantity; i++) {
        const order = {
            customerId: id.valueOf(),
            count: Math.floor(Math.random() * (100 - 1)) + 1,
            price: Math.floor(Math.random() * (100 - 20)) + 20,
            discount: Math.floor(Math.random() * (30 - 5)) + 5,
            title: Date.now() + i,
            product: faker.product()
        };
        orders.push(order);
    };
});

db.orders.insert(orders);

// Reading Data
db.customers.aggregate([
    { $project: {
        fname: '$name.first',
        lname: '$name.last',
        _id: {
            $toString: '$_id'
        }
    } },
    { $lookup: {
        from: 'orders',
        localField: '_id',
        foreignField:'customerId',
        as: 'orders'
    } },
    { $project: {
        'orders._id': '$_id',
        fname: true,
        lname: true,
        'orders.count': true,
        'orders.price': true,
        'orders.discount': true,
        'orders.product': true
    } },
    { $project: {
        _id: false
    } },
]).pretty();