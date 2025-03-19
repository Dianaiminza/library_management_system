module.exports = (sequelize, DataTypes) => {
    const Book = sequelize.define('Book', {
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        isbn: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: true,
        },
        publicationYear: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        rating: {
            type: DataTypes.FLOAT,
            allowNull: true,
        },
        copies: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        authors: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        image: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    }, {});
    Book.associate = models => {
        Book.hasMany(models.Borrow, { foreignKey: 'bookId' });
    };


    return Book;
};
