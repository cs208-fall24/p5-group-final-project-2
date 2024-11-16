import express from 'express'
import sql from 'sqlite3'

const sqlite3 = sql.verbose()

// Create an in memory table to use
const db = new sqlite3.Database(':memory:')

// This is just for testing you would not want to create the table every
// time you start up the app feel free to improve this code :)
db.run(`CREATE TABLE IF NOT EXISTS todo (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      task TEXT NOT NULL)`, function(err) {
    if (err) {
      console.error('Error creating todo table:', err.message);
    } else {
      console.log('Todo table is ready.');
    }
});

const app = express()
app.use(express.static('public'))
app.set('views', 'views')
app.set('view engine', 'pug')
app.use(express.urlencoded({ extended: false }))

// Gets list items from db to display under My TODO List
app.get('/', function (req, res) {
    console.log('GET called')
    const local = { tasks: [] }
    
    db.all('SELECT id, task FROM todo', function (err, rows) {
        if (err) {
            console.error(err)
            res.status(500).send('Error fetching tasks')
        } else {
            local.tasks = rows
            res.render('index', local)
        }
    })
})

// Adds tasks to db and My TODO List
app.post('/', function (req, res) {
    const todo = req.body.todo.trim();
    if (!todo) {
        console.log('Empty task not added');
        return res.redirect('/?error=empty');
    }

    console.log('Adding todo item');
    const stmt = db.prepare('INSERT INTO todo (task) VALUES (?)');
    stmt.run(todo, function(err) {
        if (err) {
            console.error('Error inserting task:', err.message);
        }
        res.redirect('/');
    });
    stmt.finalize();
})

// Removes tasks from db and My TODO List
app.post('/delete', function (req, res) {
    console.log('deleting todo item')
    const stmt = db.prepare('DELETE FROM todo WHERE id = ?')
    stmt.run(req.body.id, function(err) {
        if (err) {
            console.error(err)
        }
        res.redirect('/')
    })
    stmt.finalize()
})

// Start the web server
app.listen(3000, function () {
    console.log('Listening on port 3000...')
})