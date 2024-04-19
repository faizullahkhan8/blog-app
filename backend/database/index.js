const mongoose = require("mongoose");
const { DB_CONNECTION } = require("../config/index");
const DBConnection = () => {
    try {
        const conn = mongoose
            .connect(DB_CONNECTION)
            .then(() => console.log(`connected to database`));
    } catch (error) {
        console.log("error", error);
    }
};

module.exports = DBConnection;
