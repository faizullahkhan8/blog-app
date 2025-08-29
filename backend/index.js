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

app.set("trust proxy", 1); // Railway HTTPS proxy

app.use(
    cors({
        origin: [
            "http://localhost:3000",
            "https://blogbook.surge.sh",
            "https://blogbook-sigma.vercel.app",
        ],
        credentials: true,
    })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

app.use(router);

app.options(
    "*",
    cors({
        origin: [
            "http://localhost:3000",
            "https://blogbook.surge.sh",
            "https://blogbook-sigma.vercel.app",
        ],
        credentials: true,
    })
);

app.use(errorHandler);

app.listen(PORT, async () => {
    console.log(`Server is listening on port ${PORT}!`);
    await DBConnection();
});
