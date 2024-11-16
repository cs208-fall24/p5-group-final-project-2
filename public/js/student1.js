const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');

// Set up your database model for Comments
const Comment = mongoose.model('Comment', new mongoose.Schema({
    text: String,
    date: Date
}));

// Middleware to set view engine to Pug
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Connect to your database (make sure to replace with your actual connection string)
mongoose.connect('mongodb://localhost:27017/university', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Connected to the database"))
    .catch((err) => console.log("Database connection error:", err));

// Route to render the index page
app.get('/', async (req, res) => {
    // Fetch random 5 comments (or fewer if less than 5 are available)
    const comments = await Comment.aggregate([ { $sample: { size: 5 } } ]); // $sample selects random documents

    res.render('index', { comments });
});

// Start the server
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
