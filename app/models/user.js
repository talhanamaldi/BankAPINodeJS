module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    tableName: 'User',
    timestamps: false,
  });

  User.associate = (models) => {
    User.hasMany(models.Account, { foreignKey: 'user_id' });
  };

  return User;
};