"use strict";
import "reflect-metadata";
import * as express from "express";
import * as dotenv from "dotenv";
const fs = require('fs');
const request = require("request");
const router = express.Router();
dotenv.config();

const stateKey = "spotify_auth_state";


router.get("/callback",  async function  (req, res) {

  let code = req.query.code || null;
    var authOptions = {
      url: "https://accounts.spotify.com/api/token",
      form: {
        code: code,
        redirect_uri: process.env.REDIRECT_URI,
        grant_type: "authorization_code",
      },
      headers: {
        Authorization:
          "Basic " +
          new Buffer(
            process.env.CLIENT_ID + ":" + process.env.CLIENT_SECRET
          ).toString("base64"),
      },
      json: true,
    };

    request.post(authOptions, async function(error, response, body) {
      if (!error && response.statusCode === 200) {
        res.send(body.access_token)
        
      } else {

        res.send("Invalid credentials!")
      }
    });
  }
);

export default router;
