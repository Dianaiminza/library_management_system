

# Library Management System

A simple and efficient Library Management System developed using Node.js and Express.js. This system is designed to manage books, users, and transactions in a library. It allows administrators to add, update, delete, and search for books, as well as manage user registrations and borrowing records.

## Features

- **User Management**: Register, update, and delete users.
- **Book Management**: Add, update, delete, and search for books by title, author, or genre.
- **Transaction Management**: Borrow and return books, track due dates, and overdue books.
- **RESTful API**: Exposed API endpoints for interaction with the system.

## Tech Stack

- **Backend**: Node.js, Express.js
- **API**: RESTful API for client-server communication

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Dianaiminza/library_management_system.git
   ```

2. Navigate to the project directory:
   ```bash
   cd library-management-system
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Set up your `.env` file with necessary configurations (e.g., MongoDB URI, JWT secret).

5. Run the application:
   ```bash
   npm start
   ```

The server should now be running on `http://localhost:3000`.

## API Endpoints

- `GET /api/books` – Fetch all books
- `POST /api/books` – Add a new book
- `GET /api/books/:id` – Get details of a specific book
- `PUT /api/books/:id` – Update book details
- `DELETE /api/books/:id` – Delete a book



## Contributing

Feel free to fork the repository, create a pull request, and contribute to the project!

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

