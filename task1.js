load('./random.js');
use ntyshko;

db.customers.drop();
db.orders.drop();

db.createCollection('customers');

const customers = [];

for (let i = 0; i < 3000; i++) {
    const customer = {
        name: {
            first: faker.getFName(),
            last: faker.getLName(),
        },
        nickname: faker.getNickname(),
        email: faker.getEmail(),
        password: generatePassword(8),
        created: new Date().toISOString(),
    };
    customers.push(customer);
};

db.customers.insert(customers);

db.customers.createIndex({ email: 1 })
db.customers.createIndex({ 'name.first': 1, 'name.last': 1 });
db.customers.createIndex({ email: 1, created: -1 });

db.customers.getIndexes();
