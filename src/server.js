import express from 'express';
import sql from 'sqlite3';

const sqlite3 = sql.verbose();
const db = new sqlite3.Database(':memory:');

const app = express();
app.use(express.static('public'));
app.set('views', 'views');
app.set('view engine', 'pug');
app.use(express.urlencoded({ extended: false }));

// Initialize the tables for both majors
db.serialize(() => {
  db.run("CREATE TABLE IF NOT EXISTS student1_comments (id INTEGER PRIMARY KEY AUTOINCREMENT, comment TEXT, username TEXT)");
  db.run("CREATE TABLE IF NOT EXISTS student3_comments (id INTEGER PRIMARY KEY AUTOINCREMENT, comment TEXT, username TEXT)");
});

// Helper function to fetch comments for a specific major
function getCommentsForMajor(major, callback) {
  const table = major === 'student1' ? 'student1_comments' : 'student3_comments';
  db.all(`SELECT * FROM ${table}`, (err, comments) => {
    if (err) return callback(err);
    callback(null, comments);
  });
}

function getRandomCommentsForMajor(major, callback) {
  const table = major === 'student1' ? 'student1_comments' : 'student3_comments';
  
  db.all(`SELECT * FROM ${table} ORDER BY RANDOM() LIMIT 5`, (err, comments) => {
    if (err) {
      console.error("Error fetching comments:", err);
      return callback(err);
    }
    console.log("Fetched comments:", comments); // Log the fetched comments to see if they're being retrieved
    callback(null, comments);
  });
}


app.get('/student1', (req, res) => {
  getRandomCommentsForMajor('student1', (err, comments) => {
    if (err) return res.status(500).send("Error fetching comments");

    // Log comments to ensure they're fetched
    console.log("student1 Comments:", comments);

    // Only render the student1 page if there are comments
    res.render('student1', { comments: comments.length > 0 ? comments : null });
  });
});

app.get('/student3', (req, res) => {
  getRandomCommentsForMajor('student3', (err, comments) => {
    if (err) return res.status(500).send("Error fetching comments");

    // Log comments to ensure they're fetched
    console.log("student3 Comments:", comments);

    // Only render the student3 page if there are comments
    res.render('student3', { comments: comments.length > 0 ? comments : null });
  });
});


// ============================
// ROUTES

// 1. Landing Page (Home) - Links to student1 and student3
app.get('/', (req, res) => {
  res.render('index');
});

// 2. student1 Page (Landing for student1)
app.get('/student1', (req, res) => {
  res.render('student1');
});

// 3. student3 Page (Landing for student3)
app.get('/student3', (req, res) => {
  res.render('student3');
});

// 4. student1 Comments Page
app.get('/student1/comments', (req, res) => {
  getCommentsForMajor('student1', (err, comments) => {
    if (err) return res.status(500).send("Error fetching comments");
    res.render('student1/comments', { comments });
  });
});

// 5. student3 Comments Page
app.get('/student3/comments', (req, res) => {
  getCommentsForMajor('student3', (err, comments) => {
    if (err) return res.status(500).send("Error fetching comments");
    res.render('student3/comments', { comments });
  });
});

// ============================
// COMMENT MANAGEMENT ROUTES

// Add comment for student1
app.post('/student1/add-comment', (req, res) => {
  const { comment, username } = req.body;

  if (!comment || !username) {
    return res.status(400).send("Both comment and username are required.");
  }

  db.run("INSERT INTO student1_comments (comment, username) VALUES (?, ?)", [comment, username], function(err) {
    if (err) {
      console.error("Error inserting comment into student1_comments:", err);
      return res.status(500).send("Error adding comment");
    }
    res.redirect('/student1/comments');
  });
});

// Add comment for student3
app.post('/student3/add-comment', (req, res) => {
  const { comment, username } = req.body;

  if (!comment || !username) {
    return res.status(400).send("Both comment and username are required.");
  }

  db.run("INSERT INTO student3_comments (comment, username) VALUES (?, ?)", [comment, username], function(err) {
    if (err) {
      console.error("Error inserting comment into student3_comments:", err);
      return res.status(500).send("Error adding comment");
    }
    res.redirect('/student3/comments');  // Redirect to student3 Comments page
  });
});

// Delete comment for student1
app.post('/student1/delete-comment', (req, res) => {
  const { id } = req.body;
  db.run("DELETE FROM student1_comments WHERE id = ?", [id], function(err) {
    if (err) return res.status(500).send("Error deleting comment");
    res.redirect('/student1/comments');  // Redirect to student1 Comments page
  });
});

// Delete comment student3
app.post('/student3/delete-comment', (req, res) => {
  const { id } = req.body;
  db.run("DELETE FROM student3_comments WHERE id = ?", [id], function(err) {
    if (err) return res.status(500).send("Error deleting comment");
    res.redirect('/student3/comments');  // Redirect to student3 Comments page
  });
});

// Update comment for student1
app.post('/student1/update-comment', (req, res) => {
  const { id, comment } = req.body;
  
  console.log("Received data: ", req.body);  // Log the request body

  if (!id || !comment) {
    return res.status(400).send("Missing comment or ID.");
  }

  db.run("UPDATE student1_comments SET comment = ? WHERE id = ?", [comment, id], function(err) {
    if (err) {
      console.log(err);
      return res.status(500).send("Error updating comment");
    }
    res.redirect('/student1/comments');
  });
});

// Update comment for student3
app.post('/student3/update-comment', (req, res) => {
  const { id, updatedComment } = req.body;
  db.run("UPDATE student3_comments SET comment = ? WHERE id = ?", [updatedComment, id], function(err) {
    if (err) return res.status(500).send("Error updating comment");
    res.redirect('/student3/comments');  // Redirect to student3 Comments page
  });
});


app.listen(3000, function () {
  console.log('Listening on port 3000...');
});

