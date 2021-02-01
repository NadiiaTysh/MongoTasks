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

db.customers.createIndex({ nickname: 1, email: 1 }, { unique: true })

// db.customers.insertOne({
//         name: {
//             first: 'Dorcas',
//             last: 'Howe',
//         },
//         nickname: 'ocie_cold',
//         email: 'ocie.o\'hara@aol.com',
//         password: generatePassword(8),
//         created: new Date().toISOString(),
// });

db.customers.insert(customers);
