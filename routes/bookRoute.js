// routes/bookRoute.js
const { Borrow, Book } = require('../models');
const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');


/**
 * @swagger
 * /api/books:
 *   post:
 *     summary: Add a new book
 *     description: Add a new book to the library with title, ISBN, publication year, etc.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               isbn:
 *                 type: string
 *               publicationYear:
 *                 type: integer
 *               image:
 *                 type: string
 *               rating:
 *                 type: number
 *                 format: float
 *               copies:
 *                 type: integer
 *               authors:
 *                 type: string
 *     responses:
 *       201:
 *         description: Book added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 book:
 *                   type: object
 *                   properties:
 *                     title:
 *                       type: string
 *                     isbn:
 *                       type: string
 *                     publicationYear:
 *                       type: integer
 *                     image:
 *                       type: string
 *                     rating:
 *                       type: number
 *                       format: float
 *                     copies:
 *                       type: integer
 *       400:
 *         description: All fields are required
 *       500:
 *         description: Internal Server Error
 */
router.post('/', async (req, res) => {
    console.log("Received request data: ", req.body);
    try {
        const { title, isbn, publicationYear, image, rating, copies, authors } = req.body;

        if (!title || !isbn || !publicationYear || !image || !rating || !copies || !authors) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const newBook = await Book.create({
            title,
            isbn,
            publicationYear,
            rating,
            copies,
            image,
            authors
        });

        res.status(201).json({ message: 'Book added successfully', book: newBook });
    } catch (err) {
        console.error("Error creating book: ", err);
        if (err.errors) {
            // Log detailed validation errors
            console.error("Validation errors: ", err.errors);
        }
        res.status(500).json({ message: 'Internal Server Error', error: err.message });
    }
});

/**
 * @swagger
 * /api/books/search:
 *   get:
 *     summary: Search books by title, author, or ISBN
 *     description: Filters books based on title, author, or ISBN. At least one query parameter must be provided.
 *     parameters:
 *       - in: query
 *         name: title
 *         required: false
 *         description: Book title (part of title can be used)
 *         schema:
 *           type: string
 *       - in: query
 *         name: author
 *         required: false
 *         description: Author's name (part of the name can be used)
 *         schema:
 *           type: string
 *       - in: query
 *         name: isbn
 *         required: false
 *         description: Book ISBN (part of the ISBN can be used)
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of books matching the search criteria
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 books:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       title:
 *                         type: string
 *                       isbn:
 *                         type: string
 *                       publicationYear:
 *                         type: integer
 *                       image:
 *                         type: string
 *                       rating:
 *                         type: number
 *                         format: float
 *                       copies:
 *                         type: integer
 *       404:
 *         description: No books found matching the criteria
 *       500:
 *         description: Internal Server Error
 */

router.get('/search', async (req, res) => {
    try {
        // Extract query parameters for title, author, and ISBN
        const { title, author, isbn } = req.query;

        // Build the query object
        let query = {};

        if (title) {
            query.title = { [Op.iLike]: `%${title}%` }; // case-insensitive search
        }

        if (isbn) {
            query.isbn = { [Op.iLike]: `%${isbn}%` }; // case-insensitive search
        }

        if (author) {
            query = { [Op.iLike]: `%${author}%` }; // Author's name filtered
        }

        // Fetch the books with the filters
        const books = await Book.findAll({
            where: query,
            include: author ? [{ model: Author, required: true }] : [], // Include Author if filtering by author
        });

        if (books.length === 0) {
            return res.status(404).json({ message: 'No books found matching the criteria' });
        }

        res.status(200).json({ books });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});


/**
 * @swagger
 * /api/books/{id}:
 *   put:
 *     summary: Update book details
 *     description: Update the details of an existing book
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Book ID
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               authors:
 *                 type: string
 *               isbn:
 *                 type: string
 *               publicationYear:
 *                 type: integer
 *               image:
 *                 type: string
 *               rating:
 *                 type: number
 *                 format: float
 *               copies:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Book updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 book:
 *                   type: object
 *                   properties:
 *                     title:
 *                       type: string
 *                     isbn:
 *                       type: string
 *                     publicationYear:
 *                       type: integer
 *                     image:
 *                       type: string
 *                     rating:
 *                       type: number
 *                       format: float
 *                     copies:
 *                       type: integer
 *       404:
 *         description: Book not found
 *       500:
 *         description: Internal Server Error
 */

router.put('/:id', async (req, res) => {
    try {

        const bookId = parseInt(req.params.id, 10);

        if (isNaN(bookId)) {
            return res.status(400).json({ message: 'Invalid ID format' });
        }

        const { title, authors, isbn, publicationYear, image, rating, copies } = req.body;

        const book = await Book.findByPk(bookId);
        if (!book) return res.status(404).json({ message: 'Book not found' });

        // Update the book with the provided data
        await book.update({ title, authors, isbn, publicationYear, image, rating, copies });

        res.status(200).json({ message: "Book updated successfully", book });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


/**
 * @swagger
 * /api/books/{id}:
 *   delete:
 *     summary: Delete a book
 *     description: Delete a book from the library if it's not currently borrowed
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Book ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Book deleted successfully
 *       400:
 *         description: Cannot delete book. It is currently borrowed.
 *       404:
 *         description: Book not found
 *       500:
 *         description: Internal Server Error
 */
router.delete('/:id', async (req, res) => {
    try {
        const bookId = parseInt(req.params.id, 10);

        if (isNaN(bookId)) {
            return res.status(400).json({ message: 'Invalid ID format' });
        }

        const book = await Book.findByPk(bookId);
        if (!book) return res.status(404).json({ message: 'Book not found' });

        // Check if the book is currently borrowed
        const borrowRecord = await Borrow.findOne({ where: { bookId, returnDate: null } });

        if (borrowRecord) {
            return res.status(400).json({ message: 'Cannot delete book. It is currently borrowed.' });
        }

        await book.destroy();

        res.status(200).json({ message: "Book deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/books:
 *   get:
 *     summary: List all books
 *     description: Retrieve a list of books with pagination
 *     parameters:
 *       - in: query
 *         name: page
 *         required: false
 *         description: The page number (default is 1)
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: pageSize
 *         required: false
 *         description: Number of books per page (default is 10)
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: A list of books
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 books:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       title:
 *                         type: string
 *                       isbn:
 *                         type: string
 *                       publicationYear:
 *                         type: integer
 *                       image:
 *                         type: string
 *                       rating:
 *                         type: number
 *                         format: float
 *                       copies:
 *                         type: integer
 *       500:
 *         description: Internal Server Error
 */
router.get('/', async (req, res) => {
    try {
        const { page = 1, pageSize = 10 } = req.query;
        const books = await Book.findAll();
        const paginatedBooks = books.slice((page - 1) * pageSize, page * pageSize);
        res.status(200).json({ books: paginatedBooks });
    } catch (err) {
        console.error("Error fetching books: ", err);
        res.status(500).json({ message: 'Internal Server Error', error: err.message });
    }
});

module.exports = router;
