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
    { $unwind: '$orders' },
    {
        $group: {
            _id: {
                fname: '$fname',
                lname: '$lname',
                product: '$orders.product',
            },
            count:  { $sum: '$orders.count' }
        },
    },
    {
        $group: {
            _id: {
                fname: '$_id.fname',
                lname: '$_id.lname',
            },
            orders: {
                $push: {
                    _id: '$_id.product',
                    total: { $sum: '$count' }
                },
            },
        },
    },
    { $project: {
        fname: '$_id.fname',
        lname: '$_id.lname',
        orders: '$orders'
    } },
    { $project: {
        _id: false
    } }
]).pretty();