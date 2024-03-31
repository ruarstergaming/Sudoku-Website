const mongoose = require("mongoose");


/*
 * A schema defining the attributes of a daily puzzle, stored in our database.
 * Even when a daily puzzle expires it is retained.
*/
const dailyPuzzleSchema = new mongoose.Schema({
    id:         {type : String , unique : true, required : true, dropDups: true},
    name:       String,
    variant:    String,
    data:       Object,
    expiry:     Date
})

module.exports = mongoose.model("DailyPuzzle", dailyPuzzleSchema);

