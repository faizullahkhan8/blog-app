const express = require("express");
const DBConnection = require("./database/index");
const user = require("./model/user");
const cors = require("cors");
const { PORT } = require("./config/index");
const router = require("./routes/index");
const errorHandler = require("./middleware/errorHandler");
const cookieParser = require("cookie-parser");

const app = express();
app.use(cookieParser());
app.use(express.json({ limit: "50mb" }));
app.use(
    cors({
        origin: ["http://localhost:3000", "https://blogbook.surge.sh"],
        methods: ["GET", "POST", "DELETE", "PUT"],
        credentials: true,
    })
);

app.use(router);

app.use(errorHandler);

app.listen(PORT, async () => {
    console.log(`Server is listening on port ${PORT}!`);
    await DBConnection();
});
