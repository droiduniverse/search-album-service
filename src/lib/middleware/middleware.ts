import * as express from "express";
import * as dotenv from "dotenv";
const jwt = require("jsonwebtoken");
dotenv.config();

const router = express.Router();

router.use((req, res, next) => {

  res.header("Access-Control-Allow-Origin", "*"); // Replace * with the domain(s) you want to allow requests from
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();

});

export default router;
