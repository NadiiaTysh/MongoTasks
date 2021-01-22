use ntyshko;

db.customers.drop();
db.orders.drop();

db.createCollection('customers');
db.createCollection('orders');

const customers = [];

for (let i = 0; i < 3000; i++) {
    const customer = {
        name: {
            first: 'some first name',
            last: 'some last name'
        },
        balance: 15000,
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
            title: 'some title',
            product: 'some product'
        };
        orders.push(order);
    };
});

db.orders.insert(orders);

print('Number of documents in the collection \'orders\' is', db.orders.stats().count);
print('Data size of the collection \'customers\' is', db.customers.dataSize(), 'bytes');
print('Data size of the collection \'orders\' is', db.orders.dataSize(), 'bytes');
print('Data size of two collections is', db.stats().dataSize, 'bytes');
