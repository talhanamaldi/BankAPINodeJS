module.exports = (sequelize, DataTypes) => {
  const Transaction = sequelize.define('Transaction', {
    transaction_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    sender_account_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Account',
        key: 'account_id',
      },
    },
    receiver_account_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Account',
        key: 'account_id',
      },
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    transaction_time: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  }, {
    tableName: 'Transaction',
    timestamps: false,
  });

  Transaction.associate = (models) => {
    Transaction.belongsTo(models.Account, { as: 'SenderAccount', foreignKey: 'sender_account_id' });
    Transaction.belongsTo(models.Account, { as: 'ReceiverAccount', foreignKey: 'receiver_account_id' });
  };

  return Transaction;
};