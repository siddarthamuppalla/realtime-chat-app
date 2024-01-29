const passport = require('passport');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const LocalStrategy = require('passport-local').Strategy;

// initialize new strategy
const verifyCallback = async (username, password, done) => {

    try {

        // fetch user
        const fetchedUser = await User.findOne({ username });

        // validations
        if (!fetchedUser)
            done(null, false, { message: "Error fetching user." });

        if (fetchedUser) {
          const isValid = await bcrypt.compareSync(password, fetchedUser.password);
            if(!isValid)
                done(null, null, { message: "Password incorrect." });
            if (isValid)
                done(null, fetchedUser, { message: "User Authenticated." });
        };

    } catch (error) {
        done(error, false, {message: "Internal Server Error"});
    };
}

strategy = new LocalStrategy(verifyCallback);

passport.use(strategy);

// serialize user
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// deserialize user
passport.deserializeUser( async (id, done) => {
    await User.findById(id, (err, user) => {
        done(err, user)
    })
})