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

db.customers.createIndex({ 'name.first': 'text', 'name.last': 'text', nickname: 'text', email: 'text' });

// db.customers.find({ $text: { $search: 'marta_silent' } })