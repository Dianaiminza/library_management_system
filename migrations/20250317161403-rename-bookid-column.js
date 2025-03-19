module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addConstraint('Borrows', {
      fields: ['bookId'],
      type: 'foreign key',
      name: 'fk_borrow_book',
      references: {
        table: 'Books',
        field: 'id'
      },
      onDelete: 'CASCADE'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint('Borrows', 'fk_borrow_book');
  }
};
