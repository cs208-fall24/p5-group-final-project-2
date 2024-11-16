// Required dependencies
const express = require('express');
const router = express.Router();
let comments = []; // In-memory database for comments

// Route for Student 3's page
router.get('/', (req, res) => {
    const randomComments = comments.length > 5 
        ? comments.sort(() => 0.5 - Math.random()).slice(0, 5) 
        : comments;
    res.render('student3', {
        title: 'Boise State University - Computer Systems Engineering',
        name: 'Pearl Bless Afegenui',
        major: 'Computer Systems Engineering',
        location: 'Located on the cutting-edge shores of the Pacific Galaxy.',
        about: [
            { title: 'Curriculum', content: 'Offers core courses in computer architecture, software engineering, and embedded systems.' },
            { title: 'Research Opportunities', content: 'Focus on AI, IoT, and high-performance computing.' },
            { title: 'Faculty', content: 'Top-notch professors with industry experience in Google, Microsoft, and NASA.' }
        ],
        thingsToDo: [
            'Develop AI-driven applications.',
            'Engineer real-time embedded systems.',
            'Contribute to open-source software.'
        ],
        comments: randomComments
    });
});

// Route to add a new comment
router.post('/comments', (req, res) => {
    const { author, text } = req.body;
    if (author && text) {
        comments.push({ id: Date.now(), author, text });
        res.json({ success: true, message: 'Comment added successfully!' });
    } else {
        res.status(400).json({ success: false, message: 'Author and text are required!' });
    }
});

// Route to delete a comment
router.delete('/comments/:id', (req, res) => {
    const { id } = req.params;
    const commentIndex = comments.findIndex(comment => comment.id === parseInt(id, 10));
    if (commentIndex !== -1) {
        comments.splice(commentIndex, 1);
        res.json({ success: true, message: 'Comment deleted successfully!' });
    } else {
        res.status(404).json({ success: false, message: 'Comment not found!' });
    }
});

// Route to update a comment
router.put('/comments/:id', (req, res) => {
    const { id } = req.params;
    const { text } = req.body;
    const comment = comments.find(comment => comment.id === parseInt(id, 10));
    if (comment) {
        comment.text = text;
        res.json({ success: true, message: 'Comment updated successfully!' });
    } else {
        res.status(404).json({ success: false, message: 'Comment not found!' });
    }
});

module.exports = router;

