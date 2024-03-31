const mongoose = require("mongoose");

const progressSchema = new mongoose.Schema({
    puzzleId: {type: mongoose.Schema.ObjectId, ref: 'Puzzle', required: true},
    progress: [[Number]]
});


/*
 * A schema defining the attributes of a user, stored in our database.
 * This is compliant with the supergroup standard so user data can be shared between the systems.
*/
const userSchema = new mongoose.Schema({
    id:              { type : String , unique : true, required : true },
    origin:          Object,
    access_token:    String,
    passwordHash:    String,
    email:           String,
    username:        String,
    role:            String,
    registerDate:    Date,
    puzzlesSolved:   [String],
    puzzlesRated:    [String],
    puzzleProgress:  [progressSchema]
});

module.exports = mongoose.model("User", userSchema);
