//if (process.env.NODE_ENV !== 'production') {
//    
//}


const express = require('express')
const res = require('express/lib/response')
const app = express()
const bcrypt = require('bcrypt')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')

const initializePassport = require('./passport-config')

initializePassport(
    passport, 
    email => users.find(user => user.email === email),
    id => users.find(user => user.id === id)
)

//change this later!!!! (use mongo db)
const users = []

require('dotenv').config()
app.set('view-engine', 'ejs')
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUnitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))


//putting checkAuthenticated here allows us to run this function before displaying the page
app.get('/', checkAuthenticated, (req, res) => {
    res.render('index.ejs', { name: req.user.name })
})

app.get('/login', checkNotAuthenticated, (req, res) => {
    res.render('login.ejs')
})

app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    sucessRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}))

app.get('/register', checkNotAuthenticated, (req, res) => {
    res.send('register.ejs')
})

app.post('/register', checkNotAuthenticated, async (req,res) => {
    try {
        const hashedPassword = bcrypt.hash(req.body.password, 10)
        users.push({
            id: Date.now().toString(),
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        })
        res.redirect('/login')
    }
    catch {
        res.redirect('/register')
    }
    
})

app.delete('/logot', (req, res) => {
    req.logOut()
    res.redirect('/login')
})


function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }

    res.redirect('/login')
}

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/')
    }

    next()
}


const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
    console.log('listening at port ${PORT}')
})
