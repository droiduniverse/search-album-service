"use strict";
import * as express from "express";
import * as path from "path";
import helmet from "helmet";
import * as logger from "morgan";
import * as cookieParser from "cookie-parser";
import * as bodyParser from "body-parser";
import index from "./routes/index";
import search from "./routes/search"
const cors = require('cors');
import mw from "./lib/middleware/middleware";

const app: express.Express = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(mw);

app.use("/login", index);
app.use("/search", search);

app.use(function (req, res) {
  res.status(404);
  res.type("txt").send("Not found : " + req.url);
});

export default app;
