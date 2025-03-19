const request = require('supertest');
const app = require('../index.js');
const { User, Book, Borrow } = require('../models');


let bookId; // For storing the ID of the created book

describe('Book Routes', () => {
    // Before each test, clear the books table
    beforeEach(async () => {
        await Book.destroy({ where: {} }); // Clean the book table
        await Borrow.destroy({ where: {} }); // Clean the borrow table if necessary
    });

    // Test: Create Book
    it('should create a new book', async () => {
        const bookData = {
            title: 'Test Book',
            isbn: '1234567890',
            publicationYear: 2022,
            image: 'test-image-url',
            rating: 4.5,
            copies: 5,
            authors: 'Test Author',
        };

        const response = await request(app)
            .post('/api/books')
            .send(bookData);

        expect(response.status).toBe(201);
        expect(response.body.message).toBe('Book added successfully');
        expect(response.body.book).toHaveProperty('id');
        expect(response.body.book.title).toBe(bookData.title);
        expect(response.body.book.isbn).toBe(bookData.isbn);

        bookId = response.body.book.id; // Save book ID for later tests
    });



    // Test: Update Book
    it('should update an existing book', async () => {

        const updateBook = await Book.create({
            title: 'Update Book',
            isbn: '1111',
            publicationYear: 2023,
            image: 'update-image-url',
            rating: 4.0,
            copies: 3,
            authors: 'Update Author',
        });
        const updatedBookData = {
            title: 'Updated Test Book',
            authors: 'Updated Author',
            isbn: '0987654321',
            publicationYear: 2023,
            image: 'updated-image-url',
            rating: 5.0,
            copies: 10,
        };
        const response = await request(app)
            .put(`/api/books/${updateBook.id}`)
            .send(updatedBookData);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Book updated successfully');
        expect(response.body.book.title).toBe(updatedBookData.title);
        expect(response.body.book.authors).toBe(updatedBookData.authors);
        expect(response.body.book.isbn).toBe(updatedBookData.isbn);
    });

    // Test: Delete Book
    it('should delete an existing book', async () => {
        // Create another book to delete
        const anotherBook = await Book.create({
            title: 'Another Book',
            isbn: '1112223333',
            publicationYear: 2023,
            image: 'another-image-url',
            rating: 4.0,
            copies: 3,
            authors: 'Another Author',
        });

        const response = await request(app).delete(`/api/books/${anotherBook.id}`);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Book deleted successfully');

        // Try to fetch the deleted book
        const deletedBook = await Book.findByPk(anotherBook.id);
        expect(deletedBook).toBeNull(); // The book should be deleted
    });


    // Test: Get Paginated List of Books
    it('should get a paginated list of books', async () => {
        // Create 12 books
        for (let i = 0; i < 12; i++) {
            await Book.create({
                title: `Book ${i}`,
                isbn: `123456789${i}`,
                publicationYear: 2023,
                image: `image-url-${i}`,
                rating: 4.0,
                copies: 5,
                authors: `Author ${i}`,
            });
        }

        // Get the first page with 10 books per page
        const response = await request(app).get('/api/books?page=1&pageSize=10');

        expect(response.status).toBe(200);
        expect(response.body.books.length).toBe(10); // The first page should have 10 books
    });
});
// Setup mock data for tests
let userId;

describe('User Controller', () => {
    // Before each test, we can ensure that there are no users in the DB
    beforeEach(async () => {
        await User.destroy({ where: {} }); // Clean up all users
    });

    // Test: Create User
    it('should create a new user', async () => {
        const response = await request(app)
            .post('/api/users')
            .send({
                name: 'John Doe',
                email: 'john.doe@example.com',
            });

        expect(response.status).toBe(201);
        expect(response.body.message).toBe('User created successfully');
        expect(response.body.user).toHaveProperty('id');
        expect(response.body.user.name).toBe('John Doe');
        expect(response.body.user.email).toBe('john.doe@example.com');

        userId = response.body.user.id; // Save user ID for other tests
    });

    // Test: Get Users with Pagination
    it('should get users with pagination', async () => {
        // First, create some users
        await User.create({ name: 'User 1', email: 'user1@example.com' });
        await User.create({ name: 'User 2', email: 'user2@example.com' });
        await User.create({ name: 'User 3', email: 'user3@example.com' });

        // Get paginated users (page 1, 2 users per page)
        const response = await request(app).get('/api/users?page=1&limit=2');

        expect(response.status).toBe(200);
        expect(response.body.page).toBe(1);
        expect(response.body.limit).toBe(2);
        expect(response.body.users.length).toBe(2);
        expect(response.body.totalUsers).toBe(3); // Total number of users created
        expect(response.body.totalPages).toBe(2); // There are 2 pages if 2 users per page
    });

    // Test: Update User
    it('should update an existing user', async () => {
        // Create a user first
        const newUser = await User.create({
            name: 'Jane Doe',
            email: 'jane.doe@example.com',
        });

        const updatedUserData = {
            name: 'Jane Smith',
            email: 'jane.smith@example.com',
        };

        const response = await request(app)
            .put(`/api/users/${newUser.id}`)
            .send(updatedUserData);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('User updated successfully');
        expect(response.body.user.name).toBe('Jane Smith');
        expect(response.body.user.email).toBe('jane.smith@example.com');
    });

    // Test: Delete User
    it('should delete an existing user', async () => {
        // First, create a user
        const user = await User.create({
            name: 'Delete Me',
            email: 'delete.me@example.com',
        });

        // Delete the user
        const response = await request(app).delete(`/api/users/${user.id}`);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('User deleted successfully');

        // Try to fetch the user again
        const deletedUser = await User.findByPk(user.id);
        expect(deletedUser).toBeNull(); // The user should be deleted
    });


    // Test: Update User Not Found
    it('should return 404 if user to update is not found', async () => {
        const response = await request(app)
            .put('/api/users/999') // Assuming this user ID doesn't exist
            .send({
                name: 'Non-Existent User',
                email: 'nonexistent@example.com',
            });

        expect(response.status).toBe(404);
        expect(response.body.message).toBe('User not found');
    });

    // Test: Delete User Not Found
    it('should return 404 if user to delete is not found', async () => {
        const response = await request(app)
            .delete('/api/users/999') // Assuming this user ID doesn't exist
            .send();

        expect(response.status).toBe(404);
        expect(response.body.message).toBe('User not found');
    });
});

describe('POST /api/borrow', () => {

    test('should return 404 if book not found', async () => {
        const response = await request(app)
            .post('/api/borrow')
            .send({ userId: 1, bookId: 999 });

        expect(response.status).toBe(404);
        expect(response.body.message).toBe('Book not found');
    });


    test('should return 404 if book is not available', async () => {
        // Update book copies to 0
        await Book.update({ copies: 0 }, { where: { id: 1 } });

        const response = await request(app)
            .post('/api/borrow')
            .send({ userId: 1, bookId: 1 });

        expect(response.status).toBe(404);
        expect(response.body.message).toBe('Book not found');
    });

    test('should return 500 on server error', async () => {
        // Simulate server error (e.g., mocking a DB failure)
        jest.spyOn(Book, 'findByPk').mockRejectedValue(new Error('Database Error'));

        const response = await request(app)
            .post('/api/borrow')
            .send({ userId: 1, bookId: 1 });

        expect(response.status).toBe(500);
        expect(response.body.error).toBe('Database Error');
    });
});
describe('POST /api/borrow/return', () => {
    test('should return 404 if borrow record not found', async () => {
        const response = await request(app)
            .post('/api/borrow/return')
            .send({ borrowId: 999 });

        expect(response.status).toBe(404);
        expect(response.body.message).toBe('Borrow record not found');
    });

    test('should return 500 on server error', async () => {
        // Simulate server error (e.g., mocking a DB failure)
        jest.spyOn(Borrow, 'findByPk').mockRejectedValue(new Error('Database Error'));

        const response = await request(app)
            .post('/api/borrow/return')
            .send({ borrowId: 1 });

        expect(response.status).toBe(500);
        expect(response.body.error).toBe('Database Error');
    });
});
