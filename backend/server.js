// LOAD ENV VARIABLES
if(process.env.NODE_ENV !== "production"){
    require('dotenv').config();
};

// import dependencies
const express = require('express');
const session = require('express-session')
const authRouter = require('./routes/auth');
const connectToDb = require('./config/connectToDb');
const passport = require('passport');

// instantiate express
const app = express();

// connect to db
connectToDb()

// middlewares
app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: process.env.NODE_ENV === "production" },
  })
);

app.use(passport.initialize())
app.use(passport.session())

// routes
app.use("/api/v1/auth", authRouter);

// listen
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log("Server running on http://localhost:3000/")
})
