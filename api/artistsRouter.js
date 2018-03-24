const express = require('express');
const artistsRouter = express.Router();

const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

module.exports = artistsRouter;

artistsRouter.get('/', (req, res, next) => {
  db.all("SELECT * FROM Artist WHERE is_currently_employed = 1", (error, rows) => {
    res.send({artists: rows});
  })
});


artistsRouter.post('/', (req, res, next) => {
  console.log(req.artist); //gives undefined
  console.log(req.body); //gives undefined
  const artist = req.body.artist;
  if( !artist.name || !artist.date_of_birth || !artist.biography){
    res.status(400).send();
  }

  db.run("INSERT INTO Artist (name, date_of_birth, biography, is_currently_employed) VALUES ($id, $name, $date_of_birth, $biography, $is_currently_employed)", {
    $name: artist.name,
    $biography: artist.biography,
    $is_currently_employed: artist.is_currently_employed
  }, function(err) {
    if(err){
    	return res.sendStatus(500);
    }
    db.get("SELECT * FROM Artist WHERE id = $id", {
    $id: this.lastID
  }, (err, row) => {
    	if(!row || err){
        return res.sendStatus(500);
      }
  	  res.status(201).send({strip: row});
  	});
  });
});

artistsRouter.param('artistId', (req, res, next, artistId) => {
  db.get("SELECT * FROM Artist WHERE Artist.id = $artistId", {
    $artistId: artistId
  }, (error, row) => {
    if(error){
      next(error);
    } else if (row){
      req.artist = row;
      next();
    } else {
      res.status(404).send();
    }
  });
});

artistsRouter.get('/:artistId', (req, res, next) => {
  res.status(200).send({artist: req.artist});
  });


artistsRouter.put('/:artistId', (req, res, next) => {
  const artist = req.artist;
  if( !artist.name || !artist.date_of_birth || !artist.biography){
    res.status(400).send();
  }

  console.log('new artist: ');
  console.log(artist);
  db.get("SELECT * FROM Artist WHERE id = $id", {
    $id: req.params.artistId
  }, (err, row) => {
    console.log('current artist: ');
    console.log(row);
  }); // check too see req.artist and existing artist values. Seems to be the same

  db.run("UPDATE Artist SET name = $name, date_of_birth = $date_of_birth, biography = $biography, is_currently_employed = $is_currently_employed WHERE Artist.id = $artistId", {
    $name: artist.name,
    $date_of_birth: artist.date_of_birth,
    $biography: artist.biography,
    $is_currently_employed: artist.is_currently_employed,
    $artistId: req.params.artistId
  }, function(err) {
    if(err){
    	next(error);
    } else {
      db.get("SELECT * FROM Artist WHERE id = $id", {
        $id: req.params.artistId
      }, (err, row) => {
    	  res.status(200).send({artist: row});
      });
    }
  });
});
