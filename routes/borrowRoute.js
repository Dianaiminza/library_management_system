const { Book, Borrow, User } = require('../models');
var express = require('express');
var router = express.Router();

/**
 * @swagger
 * /api/borrow:
 *   post:
 *     summary: Borrow a book
 *     description: Borrow a book from the library
 *     tags:
 *       - Borrow
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *               bookId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Book borrowed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 borrow:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     userId:
 *                       type: integer
 *                     bookId:
 *                       type: integer
 *                     borrowDate:
 *                       type: string
 *                       format: date-time
 *                     dueDate:
 *                       type: string
 *                       format: date-time
 *                     returnDate:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Book is not available
 *       404:
 *         description: Book not found
 *       500:
 *         description: Server error
 */
router.post('/', async (req, res) => {
    try {
        const { userId, bookId } = req.body;
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 14); // Default due date (14 days from today)

        // Check if the book exists
        const book = await Book.findByPk(bookId);
        if (!book) return res.status(404).json({ message: 'Book not found' });

        // Check if the user exists
        const user = await User.findByPk(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Check if the book is available
        if (book.copies <= 0) {
            return res.status(400).json({ message: 'Book is not available' });
        }

        // Create a borrow record
        const borrow = await Borrow.create({
            userId,
            bookId,
            borrowDate: new Date(),
            dueDate,
            returnDate: null // Not returned yet
        });

        // Decrease the available copies of the book
        await book.update({ copies: book.copies - 1 });

        res.status(200).json({ message: 'Book borrowed successfully', borrow });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


/**
 * @swagger
 * /api/borrow/return:
 *   post:
 *     summary: Return a borrowed book
 *     description: Return a borrowed book to the library
 *     tags:
 *       - Borrow
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               borrowId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Book returned successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 borrow:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     userId:
 *                       type: integer
 *                     bookId:
 *                       type: integer
 *                     borrowDate:
 *                       type: string
 *                       format: date-time
 *                     dueDate:
 *                       type: string
 *                       format: date-time
 *                     returnDate:
 *                       type: string
 *                       format: date-time
 *       404:
 *         description: Borrow record not found
 *       500:
 *         description: Server error
 */
router.post('/return', async (req, res) => {
    try {
        const { borrowId } = req.body;
        const borrow = await Borrow.findByPk(borrowId);

        if (!borrow) return res.status(404).json({ message: 'Borrow record not found' });

        const book = await Book.findByPk(borrow.bookId);

        // Check if the book is overdue
        const isOverdue = new Date() > borrow.dueDate;
        const lateDays = isOverdue ? Math.floor((new Date() - borrow.dueDate) / (1000 * 60 * 60 * 24)) : 0;

        // Update borrow record with return date
        await borrow.update({
            returnDate: new Date(),
            lateDays
        });

        // Increase the available copies of the book
        await book.update({ copies: book.copies + 1 });

        res.status(200).json({ message: 'Book returned successfully', borrow });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
