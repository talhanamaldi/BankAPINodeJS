module.exports = (sequelize, DataTypes) => {
    const Transaction = sequelize.define('Transaction', {
      transaction_id: {
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
      user2_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'User',
          key: 'user_id',
        },
      },
      amount: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    }, {
      tableName: 'Transaction',
      timestamps: false,
    });
  
    Transaction.associate = (models) => {
      Transaction.belongsTo(models.User, { as: 'Sender', foreignKey: 'user_id' });
      Transaction.belongsTo(models.User, { as: 'Receiver', foreignKey: 'user2_id' });
    };
  
    return Transaction;
  };
  