const express = require('express')
const app = express()
const db = require('sqlite')
const moment = require('moment')
const bcrypt = require('bcrypt')


app.set('views', './views')
app.set('view engine', 'pug')

db.open('todolist.db')
.then(() =>{
  db.run('CREATE TABLE IF NOT EXISTS todos(message, completion, created_at, updated_at, userId)')
  db.run('CREATE TABLE IF NOT EXISTS users(firstname, lastname, username, password, email, createdAt, updatedAt)')
  .then(() => {
    console.log("Parfait!")
  })
}).catch(() => {
  console.log("Nope!")
})

const PORT = process.env.PORT || 8080
app.use(express.json())
app.use(express.urlencoded({
  extended: true
}))

app.listen(PORT, () => {
  console.log('Serveur sur port : ', PORT)
})


app.all('*', (req, res, next) => {
  console.log('It just works!')
  next()
})

//.all("SQL query")pour tout, .get()pour un, .run()pour changer
//Renvoient des promesses

//Todos part:
app.get('/todos', (req, res, next) => {
  db.all("SELECT * FROM todos;")
  .then((todos) => {
    res.format ({
      'text/html': function (){
        res.render('todos/index', {
          todos: todos
        })
      },
      'application/json': function (){
        res.send(todos)
      }
    })
  })
  .catch((err) => {
    console.log("Oopsie woopsie!")
    res.json({message: 'No todos found!'})
  })
})


app.get('/todos/:ROWID', (req, res, next) => {
  db.all("SELECT * FROM todos WHERE ROWID = '" + req.params.ROWID + "';")
  .then((todo) => {
    res.format ({
      'text/html': function (){
        res.render('todos/show', {
          todo: todo
        })
      },
      'application/json': function (){
        res.send(todo)
      }
    })
  })
  .catch((err) => {
    console.log("Oopsie woopsie!")
    res.json({message: 'Todo not found!'})
  })
})


app.post('/todos', (req, res, next) => {
  console.log(req.body)
  db.run("INSERT INTO todos (message, completion, userId, created_at, updated_at) VALUES ('" + req.body.message + "', '" + req.body.completion + "', '" + req.body.userId + "', '" + moment().format('MMMM Do YYYY, h:mm:ss a') + "', '" + moment().format('MMMM Do YYYY, h:mm:ss a') + "');")
  .then((request) => {
    res.format ({
      'text/html': function (){
        res.redirect('todos/index')
      },
      'application/json': function (){
        res.send({message: "Post successful!"})
      }
    })
  })
  .catch((err) => {
    console.log("Oopsie woopsie!")
    res.json({message: 'Post failed!'})
  })
})


app.delete('/todos/:ROWID', (req, res, next) => {
  db.get("DELETE FROM todos WHERE ROWID = '" + req.params.ROWID + "';")
  .then(() => {
    res.format ({
      'text/html': function (){
        res.redirect('index')
      },
      'application/json': function (){
        res.json({message: 'Deletion successful!'})
      }
    })
  })
  .catch((err) => {
    console.log("Oopsie woopsie!")
    res.json({message: 'Deletion failed!'})
  })
})


app.put('/todos/:ROWID', (req, res, next) => {
  db.run("UPDATE todos SET completion = '" + req.body.completion + "' WHERE ROWID = '" + req.params.ROWID + "';")
  db.run("UPDATE todos SET updated_at = '" + moment().format('MMMM Do YYYY, h:mm:ss a') + "' WHERE ROWID = '" + req.params.ROWID + "';")
  .then(() => {
    res.format ({
      'text/html': function (){
        res.redirect('todos/index')
      },
      'application/json': function (){
        res.json({message:'Updated!'})
      }
    })
  })
  .catch((err) => {
    console.log("Oopsie woopsie!")
    res.json({message: 'Update failed!'})
  })
})


//Users part:
app.get('/users', (req, res, next) => {
  db.all("SELECT * FROM users;")
  .then((users) => {
    res.format ({
      'text/html': function (){
        res.render('users/index', {
          users: users
        })
      },
      'application/json': function (){
        res.send(users)
      }
    })
  })
  .catch((err) => {
    console.log("Oopsie woopsie!")
    res.json({message: 'No users found!'})
  })
})


app.get('/users/:ROWID', (req, res, next) => {
  db.all("SELECT * FROM users WHERE ROWID = '" + req.params.ROWID + "';")
  .then((user) => {
    res.format ({
      'text/html': function (){
        res.render('users/show', {
          user: user
        })
      },
      'application/json': function (){
        res.send(user)
      }
    })
  })
  .catch((err) => {
    console.log("Oopsie woopsie!")
    res.json({message: 'User not found!'})
  })
})


app.post('/users', (req, res, next) => {
  console.log(req.body)
  db.run("INSERT INTO users(firstname, lastname, username, password, email, createdAt, updatedAt) VALUES ('" + req.body.firstname + "' , '" + req.body.lastname + "' , '" + req.body.username + "' , '" + bcrypt.hashSync(req.body.password, 10) + "' , '" + req.body.email + "' , '" + moment().format('MMMM Do YYYY, h:mm:ss a') + "', '" + moment().format('MMMM Do YYYY, h:mm:ss a') + "');")
  .then((request) => {
    res.format ({
      'text/html': function (){
        res.redirect('users/index')
      },
      'application/json': function (){
        res.send({message: "New user created!"})
      }
    })
  })
  .catch((err) => {
    console.log("Oopsie woopsie!")
    res.json({message: 'User creation failed!'})
  })
})


app.delete('/users/:ROWID', (req, res, next) => {
  db.get("DELETE FROM users WHERE ROWID = '" + req.params.ROWID + "';")
  .then(() => {
    res.format ({
      'text/html': function (){
        res.redirect('users/index')
      },
      'application/json': function (){
        res.json({message: 'Deletion successful!'})
      }
    })
  })
  .catch((err) => {
    console.log("Oopsie woopsie!")
    res.json({message: 'Deletion failed!'})
  })
})

app.put('/users/:ROWID', (req, res, next) => {
  db.run("UPDATE users SET username = '" + req.body.username + "' WHERE ROWID = '" + req.params.ROWID + "';")
  db.run("UPDATE users SET firstname = '" + req.body.firstname + "' WHERE ROWID = '" + req.params.ROWID + "';")
  db.run("UPDATE users SET lastname = '" + req.body.lastname + "' WHERE ROWID = '" + req.params.ROWID + "';")
  db.run("UPDATE users SET updated_at = '" + moment().format('MMMM Do YYYY, h:mm:ss a') + "' WHERE ROWID = '" + req.params.ROWID + "';")
  .then(() => {
    res.format ({
      'text/html': function (){
        res.redirect('users/index')
      },
      'application/json': function (){
        res.json({message:'Updated!'})
      }
    })
  })
  .catch((err) => {
    console.log("Oopsie woopsie!")
    res.json({message: 'Update failed!'})
  })
})


//Error:
app.use((err, req, res, next) => {
  res.format ({
    'text/html': function (){
      res.render('error', {})
    },
    'application/json': function (){
      res.json({status: 404})
    }
  })
  res.status(404)
  res.end('WTF Man?')
})
