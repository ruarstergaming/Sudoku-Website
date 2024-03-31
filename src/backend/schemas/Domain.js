const mongoose = require("mongoose");

/*
 * A schema defining the attributes of a domain, stored in our database.
 * Domains are different members of the supergroup - here we store the secret
 * client id and secret which are used in the OAuth protocl we have developed
*/
const domainSchema = new mongoose.Schema({
    groupNum:      Number,
    client_id:     String,
    client_secret: String,
    redirect_url:  String
})

module.exports = mongoose.model("Domain", domainSchema);
