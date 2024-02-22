const passport = require("passport");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const LocalStrategy = require("passport-local").Strategy;

const customFields = {
    usernameField: "email",
    passwordField: "password",
};

// initialize new strategy
const verifyCallback = async (email, password, done) => {
    try {
        // fetch user
        const fetchedUser = await User.findOne({ email });

        // validations
        if (!fetchedUser)
            return done(null, false, { message: "User does not exist." });

        if (fetchedUser) {
            const isValid = await bcrypt.compare(
                password,
                fetchedUser.password
            );

            if (!isValid) return done(null, null);

            if (isValid) return done(null, fetchedUser);
        }
    } catch (error) {
        return done(error, false, { message: "Internal Server Error" });
    }
};

strategy = new LocalStrategy(customFields, verifyCallback);

passport.use(strategy);

// serialize user
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// deserialize user
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});
