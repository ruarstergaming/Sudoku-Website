const { warnDbChanges } = require("../db_func");
const {DB_URI} = require("../constants");
const User = require("../schemas/User");
const {newUser} = require('../db_operations');
const mongoose = require('mongoose');

async function populate_users() {

    await User.deleteMany({});

    await newUser("admin", "admin@admin.com", "Admin123!", "admin");

    await newUser("test-brown", "test@test.com", "Test123!");

    console.log("Done!");
    process.exit();
}

if (warnDbChanges("User")) {
    mongoose.connect(DB_URI);
    const connection = mongoose.connection;
    connection.once('open', () => {
        console.log("MongoDB connection established");
    });
    console.log("Commencing user population");
    populate_users();
}