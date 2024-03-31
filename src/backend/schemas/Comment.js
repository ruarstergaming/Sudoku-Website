const mongoose = require("mongoose");


/*
 * A schema defining the attributes of a comment, stored in our database.
*/
const commentSchema = new mongoose.Schema({
    id:         {type : String , unique : true, required : true, dropDups: true},
    puzzle_id : {type : String},
    author: {type : String},
    body_text: {type : String},
    post_date: {type: Date}
})

module.exports = mongoose.model("Comment", commentSchema);

