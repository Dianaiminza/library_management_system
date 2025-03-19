
module.exports = {
    up: async (queryInterface, Sequelize) => {
        // The sample data to be seeded
        await queryInterface.bulkInsert('Books', [
            {
                "copies": 272,
                "isbn": 439023,
                "authors": "",
                "publicationYear": 2008,
                "title": "The Hunger Games (The Hunger Games, #1)",
                "rating": 4.34,
                "image": "https://images.gr-assets.com/books/1447303603m/2767052.jpg"
            },
            {
                "copies": 491,
                "isbn": 439554,
                "authors": "J.K. Rowling, Mary GrandPré",
                "publicationYear": 1997,
                "title": "Harry Potter and the Sorcerer's Stone (Harry Potter, #1)",
                "rating": 4.44,
                "image": "https://images.gr-assets.com/books/1474154022m/3.jpg"
            },
            {
                "copies": 226,
                "isbn": 316015,
                "authors": "Stephenie Meyer",
                "publicationYear": 2005,
                "title": "Twilight (Twilight, #1)",
                "rating": 3.57,
                "image": "https://images.gr-assets.com/books/1361039443m/41865.jpg"
            },
            {
                "copies": 487,
                "isbn": 61120,
                "authors": "Harper Lee",
                "publicationYear": 1960,
                "title": "To Kill a Mockingbird",
                "rating": 4.25,
                "image": "https://images.gr-assets.com/books/1361975680m/2657.jpg"
            },
            {
                "copies": 1356,
                "isbn": 743273,
                "authors": "F. Scott Fitzgerald",
                "publicationYear": 1925,
                "title": "The Great Gatsby",
                "rating": 3.89,
                "image": "https://images.gr-assets.com/books/1490528560m/4671.jpg"
            },

        ], {});
    },

    down: async (queryInterface, Sequelize) => {
        // Reverse the seeding (delete seeded data)
        await queryInterface.bulkDelete('Books', null, {});
    }
};
