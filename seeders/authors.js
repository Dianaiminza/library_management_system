module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.bulkInsert('Authors', [
            {
                name: 'Suzanne Collins',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: 'J.K. Rowling',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: 'Stephenie Meyer',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: 'George R.R. Martin',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: 'J.R.R. Tolkien',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ], {});
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete('Authors', null, {});
    }
};
