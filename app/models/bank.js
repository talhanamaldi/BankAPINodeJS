module.exports = (sequelize, DataTypes) => {
  const Bank = sequelize.define('Bank', {
    bank_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    tableName: 'Bank',
    timestamps: false,
  });

  Bank.associate = (models) => {
    Bank.hasMany(models.Account, { foreignKey: 'bank_id' });
  };

  return Bank;
};