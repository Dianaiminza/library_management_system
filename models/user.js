module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        name: { type: DataTypes.STRING, allowNull: false },
        email: { type: DataTypes.STRING, allowNull: false, unique: true },
    });

    User.associate = models => {
        User.hasMany(models.Borrow, { foreignKey: 'userId' });
    };

    return User;
};
