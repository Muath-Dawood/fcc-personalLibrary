/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';
const Book = require('./models/book');

module.exports = function (app) {

  app.route('/api/books')
    .get(async function (req, res) {
      try {
        const books = await Book.find();
        const bookList = books.map(book => ({
          _id: book._id,
          title: book.title,
          commentcount: book.comments.length
        }));
        res.json(bookList);
      } catch (err) {
        res.status(500).send('Database error');
      }
    })
    
    .post(async function (req, res) {
      const title = req.body.title;
      if (!title) {
        return res.status(400).send('title is required');
      }
      try {
        const newBook = new Book({ title });
        await newBook.save();
        res.json(newBook);
      } catch (err) {
        res.status(500).send('Database error');
      }
    })
    
    .delete(async function (req, res) {
      try {
        await Book.deleteMany({});
        res.send('complete delete successful');
      } catch (err) {
        res.status(500).send('Database error');
      }
    });

  app.route('/api/books/:id')
    .get(async function (req, res) {
      const bookid = req.params.id;
      try {
        const book = await Book.findById(bookid);
        if (!book) {
          return res.status(404).send('book not found');
        }
        res.json(book);
      } catch (err) {
        res.status(500).send('Database error');
      }
    })
    
    .post(async function (req, res) {
      const bookid = req.params.id;
      const comment = req.body.comment;
      if (!comment) {
        return res.status(400).send('comment is required');
      }
      try {
        const book = await Book.findById(bookid);
        if (!book) {
          return res.status(404).send('book not found');
        }
        book.comments.push(comment);
        await book.save();
        res.json(book);
      } catch (err) {
        res.status(500).send('Database error');
      }
    })
    
    .delete(async function (req, res) {
      const bookid = req.params.id;
      try {
        const book = await Book.findByIdAndDelete(bookid);
        if (!book) {
          return res.status(404).send('book not found');
        }
        res.send('delete successful');
      } catch (err) {
        res.status(500).send('Database error');
      }
    });
};