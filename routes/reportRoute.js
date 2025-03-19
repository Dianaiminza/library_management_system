// Description: Report controller to handle report related operations.
// All report related operations are defined here.
const { Borrow, User, Book } = require('../models');
var express = require('express');
var router = express.Router();
const { Op } = require('sequelize');
// List overdue books with user details and days overdue


/**
 * @swagger
 * /api/report:
 *   get:
 *     summary: Get a list of overdue books with user details and overdue days.
 *     description: Fetches a list of overdue books with user details (name, email) and the number of days the books are overdue.
 *     tags: [Reports]
 *     responses:
 *       200:
 *         description: A list of overdue books along with user details and overdue days.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 overdueDetails:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       user:
 *                         type: string
 *                         description: Name of the user who borrowed the book.
 *                       email:
 *                         type: string
 *                         description: Email address of the user.
 *                       bookTitle:
 *                         type: string
 *                         description: Title of the borrowed book.
 *                       isbn:
 *                         type: string
 *                         description: ISBN of the borrowed book.
 *                       overdueDays:
 *                         type: integer
 *                         description: The number of days the book is overdue.
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message
 */

router.get('/', async (req, res) => {
    try {
        const overdueBooks = await Borrow.findAll({
            where: {
                returnDate: null,
                dueDate: {
                    [Op.lt]: new Date() // Find records where dueDate is before the current date
                }
            },
            include: [
                {
                    model: User,
                    attributes: ['name', 'email']
                },
                {
                    model: Book,
                    attributes: ['title', 'isbn']
                }
            ]
        });

        const overdueDetails = overdueBooks.map(borrow => ({
            user: borrow.User.name,
            email: borrow.User.email,
            bookTitle: borrow.Book.title,
            isbn: borrow.Book.isbn,
            overdueDays: Math.floor((new Date() - borrow.dueDate) / (1000 * 60 * 60 * 24))
        }));

        res.status(200).json({ overdueDetails });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;