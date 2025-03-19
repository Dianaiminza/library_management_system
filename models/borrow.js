module.exports = (sequelize, DataTypes) => {
    const Borrow = sequelize.define('Borrow', {
        borrowDate: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
        dueDate: { type: DataTypes.DATE, allowNull: false },
        returnDate: { type: DataTypes.DATE },
        userId: { type: DataTypes.INTEGER, allowNull: false },
        bookId: { type: DataTypes.INTEGER, allowNull: false }// Explicitly define bookId column
    });

    Borrow.associate = models => {
        Borrow.belongsTo(models.Book, { foreignKey: 'bookId' });
        Borrow.belongsTo(models.User, { foreignKey: 'userId' });
    };

    return Borrow;
};
