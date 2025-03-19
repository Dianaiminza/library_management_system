module.exports = (sequelize, DataTypes) => {
    const Author = sequelize.define('Author', {
        name: { type: DataTypes.STRING, allowNull: false },
    });

    Author.associate = models => {
        Author.belongsToMany(models.Book, { through: 'BookAuthors' });
    };

    return Author;
};
