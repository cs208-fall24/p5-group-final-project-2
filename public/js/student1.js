import express from 'express'
import sql from 'sqlite3'

const sqlite3 = sql.verbose()

// Create or open the database (persistent storage instead of memory)
const db = new sqlite3.Database(':memory:')

// Create the comments table if it doesn't exist
db.run(`CREATE TABLE IF NOT EXISTS comments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      author TEXT,
      comment TEXT NOT NULL,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
)`, function(err) {
    if (err) {
        console.error('Error creating comments table:', err.message);
    } else {
        console.log('Comments table is ready.');
    }
});

const app = express()
app.use(express.static('public'))
app.set('views', 'views')
app.set('view engine', 'pug')
app.use(express.urlencoded({ extended: false }))

// Fetch and display all comments
app.get('/', function (req, res) {
    console.log('GET called for comments')
    const local = { comments: [] }

    db.all('SELECT id, author, comment, timestamp FROM comments ORDER BY timestamp DESC', function (err, rows) {
        if (err) {
            console.error(err)
            res.status(500).send('Error fetching comments')
        } else {
            local.comments = rows
            res.render('index', local)
        }
    })
})

// Add a new comment
app.post('/', function (req, res) {
    console.log('POST / called'); // Add this log to confirm the POST request is hitting the backend
    const { author, comment } = req.body;

    if (!comment.trim()) {
        console.log('Empty comment not added');
        return res.redirect('/?error=empty');
    }

    console.log('Adding comment');
    const stmt = db.prepare('INSERT INTO comments (author, comment) VALUES (?, ?)');
    stmt.run(author || 'Anonymous', comment.trim(), function(err) {
        if (err) {
            console.error('Error inserting comment:', err.message);
            return res.status(500).send('Error inserting comment');
        }
        res.redirect('/'); // Redirect back to the homepage after adding a comment
    });
    stmt.finalize();
});

// Delete a comment by its ID
app.post('/delete', function (req, res) {
    console.log('Deleting comment');
    const { id } = req.body;
    const stmt = db.prepare('DELETE FROM comments WHERE id = ?');
    stmt.run(id, function(err) {
        if (err) {
            console.error(err)
        }
        res.redirect('/');
    })
    stmt.finalize()
})

// Start the web server
app.listen(3000, function () {
    console.log('Listening on port 3000...')
})