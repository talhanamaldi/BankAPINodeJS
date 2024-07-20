module.exports = (sequelize, DataTypes) => {
  const Account = sequelize.define('Account', {
    account_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'User',
        key: 'user_id',
      },
    },
    bank_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Bank',
        key: 'bank_id',
      },
    },
    balance: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    tableName: 'Account',
    timestamps: false,
  });

  Account.associate = (models) => {
    Account.belongsTo(models.User, { foreignKey: 'user_id' });
    Account.belongsTo(models.Bank, { foreignKey: 'bank_id' });
    Account.hasMany(models.Transaction, { as: 'SenderTransactions', foreignKey: 'sender_account_id' });
    Account.hasMany(models.Transaction, { as: 'ReceiverTransactions', foreignKey: 'receiver_account_id' });
  };

  return Account;
};