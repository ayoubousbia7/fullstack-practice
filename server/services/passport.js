import passport from "passport"
import mongoose from 'mongoose'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import keys from "../config/keys.js"

const User = mongoose.model('users')

passport.serializeUser((user, done) => {
    done(null, user.id)
})

passport.deserializeUser((id, done) => {
    
    User.findById(id).then(user => {
        done(null, user)
    })
});

passport.use(
    new GoogleStrategy({
        clientID: keys.googleClientID,
        clientSecret: keys.googleClientSecret,
        callbackURL: '/auth/google/callback'
    }, 
    (accessToken, refreshToken, profile, done) => {
        User.findOne({googleId: profile.id})
        .then((existingUser)=> {
            if (!existingUser) {
                new User ({ googleId: profile.id }).save()
                .then(user => done(null, user))
            } else {
                done(null, existingUser)
            }
        })

        
    })
)

export default passport
