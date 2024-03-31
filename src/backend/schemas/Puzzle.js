const mongoose = require("mongoose");


/*
 * A schema defining the attributes of a puzzle, stored in our database.
 * This is fully compliant with the supergroup standard, meaning that puzzles downloaded
 * from another site may be uploaded and interpreted by our,s and vice versa.
*/
const puzzleSchema = new mongoose.Schema({
    id:         {type : String , unique : true, required : true, dropDups: true},
    name:       String,
    variant:    String,
    data:       Object,
    author:     String,
    difficulty: Number,
    sumRatings: Number,
    numRatings: Number,
    createDate: Date
})

module.exports = mongoose.model("Puzzle", puzzleSchema);

