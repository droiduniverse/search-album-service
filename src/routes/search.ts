"use strict";
import "reflect-metadata";
import * as express from "express";
const SpotifyWebApi = require("spotify-web-api-node");
const router = express.Router();
import * as dotenv from "dotenv";
import { isArray } from "util";
import { AppDataSource } from "../db/pg-datasource";
import { Request } from "../entities/Request";

dotenv.config();

router.post("/searchAlbum", async (req, res) => {
  const requestRepository = AppDataSource.getRepository(Request);
  const ip = req.ip;
  const artistName = req.body.artistName || null;
  let spotifyApi :any
  let searchResult :any

  try {

    spotifyApi = new SpotifyWebApi({
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
    });

    searchResult = await spotifyApi.clientCredentialsGrant();
    spotifyApi.setAccessToken(searchResult.body.access_token);    
  } catch (err) {
    res.status(500).send({error : err})
  }

  if (artistName && searchResult.statusCode === 200) {
    const result = await spotifyApi.searchArtists(artistName).then((data) => {
      const artist = data.body.artists.items[0];
      return spotifyApi.getArtistAlbums(artist.id, {
        limit: 50,
        album_type: "album",
        sort: "popularity",
        market: "AR",
      });
    });
    if (result.body.items.length > 0 && isArray(result.body.items)) {
      let _albums = [];
      result.body.items.forEach((element) => {
        _albums.push(element.name);
      });

      let request: Request = {
        request_id: null,
        ip_source: ip,
        artist_name: artistName,
        created_at: new Date().toLocaleString(),
      };

      try {
        const queryResult = await requestRepository.save(request);
      } catch (error) {
        throw new Error(error);
      }

      res.status(200).send([{ artist: artistName, albums: _albums }]);
    } else {
      res.send({message : "No results!"});
    }
  } else {
    if (searchResult.statusCode >= 500 && searchResult.statusCode < 600) {
      res.status(500).send("Spotify web service failure when searching  !");
    }
    if (searchResult.statusCode >= 400 && searchResult.statusCode < 500) {
      res.status(400).send("Incorrect credentials!");
    }
    if (!artistName) {
      res.status(400).send("Please provide an artist name in request body!");
    }
  }
});

export default router;
