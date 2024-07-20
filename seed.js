const db = require('./app/models');

const seedData = async () => {
  try {
    // Sync database
    await db.sequelize.sync({ force: true });

    if(!db.User || !db.Bank || !db.Account){
        throw new Error("Models are not defined");
    }

    // Create Users
    // Create Users
    const users = await db.User.bulkCreate([
      { name: 'Ahmet' },
      { name: 'Mehmet' },
      { name: 'Talha' },
      { name: 'Zeynep' },
      { name: 'Elif' },
      { name: 'Can' },
      { name: 'Emre' },
      { name: 'Fatma' },
      { name: 'Ali' },
      { name: 'Ayşe' },
    ]);
// Create Banks
const banks = await db.Bank.bulkCreate([
  { name: 'Bank A' },
  { name: 'Bank B' },
  { name: 'Bank C' },
  { name: 'Bank D' },
  { name: 'Bank E' },
]);

// Create Accounts with diverse high balances and one low balance
const accounts = await db.Account.bulkCreate([
  { user_id: users[0].user_id, bank_id: banks[0].bank_id, balance: 5000.00 },
  { user_id: users[0].user_id, bank_id: banks[1].bank_id, balance: 7500.00 },
  { user_id: users[1].user_id, bank_id: banks[0].bank_id, balance: 12000.00 },
  { user_id: users[2].user_id, bank_id: banks[1].bank_id, balance: 800.00 }, // Low balance
  { user_id: users[3].user_id, bank_id: banks[2].bank_id, balance: 25000.00 },
  { user_id: users[4].user_id, bank_id: banks[2].bank_id, balance: 5000.00 },
  { user_id: users[5].user_id, bank_id: banks[3].bank_id, balance: 15000.00 },
  { user_id: users[6].user_id, bank_id: banks[3].bank_id, balance: 3000.00 },
  { user_id: users[7].user_id, bank_id: banks[4].bank_id, balance: 4000.00 },
  { user_id: users[8].user_id, bank_id: banks[4].bank_id, balance: 9500.00 },
  { user_id: users[2].user_id, bank_id: banks[0].bank_id, balance: 22000.00 },
  { user_id: users[3].user_id, bank_id: banks[1].bank_id, balance: 18000.00 },
  // User 9 with low balance
  { user_id: users[9].user_id, bank_id: banks[0].bank_id, balance: 100.00 },
]);

    console.log('Seed data has been successfully created');
  } catch (error) {
    console.error('Error seeding data: ', error);
  }
};

seedData();