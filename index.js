'use strict'
// index.js
// This is our main server file

// A static server using Node and Express
const express = require("express");

// local modules
const db = require("./sqlWrap");
const win = require("./pickWinner");
const dbo = require("./databaseOps");


// gets data out of HTTP request body 
// and attaches it to the request object
const bodyParser = require('body-parser');
const { post_video } = require("./databaseOps");


/* might be a useful function when picking random videos */
function getRandomInt(max) {
  let n = Math.floor(Math.random() * max);
  return n;
}


/* start of code run on start-up */
// create object to interface with express
const app = express();

// Code in this section sets up an express pipeline

// print info about incoming HTTP request 
// for debugging
app.use(function(req, res, next) {
  console.log(req.method,req.url);
  next();
})
// make all the files in 'public' available 
app.use(express.static("public"));

// if no file specified, return the main page
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/public/compare.html");
});

// Get JSON out of HTTP request body, JSON.parse, and put object into req.body
app.use(bodyParser.json());


app.get("/getWinner", async function(req, res) {
  console.log("getting winner");
  try {
  // change parameter to "true" to get it to computer real winner based on PrefTable 
  // with parameter="false", it uses fake preferences data and gets a random result.
  // winner should contain the rowId of the winning video.
  let winner = await win.computeWinner(8,false);
    console.log("winner is ",winner);
       getVids(winner)
        .then(function(result){

          let winner = result
          let vidObj = {
          "video1":winner,
        }     
          res.json(vidObj);
        }).catch(function(err){
           console.log("Couldn't get second video: ", err);
        }); 

  // you'll need to send back a more meaningful response here.
  
  } catch(err) {
    res.status(500).send(err);
  }
});



app.get("/getTwoVideos", async function(req,res){
// First get the two videos first from the database.
const VideoTableSQL = "SELECT rowIDNum from VideoTable ";


await db.run(VideoTableSQL,[db.url]);
let result = await db.all(VideoTableSQL,[]);

var myloop =[];
for(let i = 0;i<result.length; i++)
{ 
  myloop.push(result[i].rowIdNum);
}
let items = myloop;
let max = myloop[myloop.length-1];
// Get first random number
let randomresult = getRandomInt(max);
while(items.includes(randomresult) == false)
{
  randomresult = getRandomInt(max);
}
// Get second random number

let secondrandomresult = getRandomInt(max);
while(secondrandomresult == randomresult || items.includes(randomresult) == false)
{

  secondrandomresult = getRandomInt(max);
}


  // Getting the first vid and secondvideo by using nested async functions.
  getVids(randomresult)
    .then(function(result){
      let video1 =result;
      getVids(secondrandomresult)
        .then(function(result){
        let video2 = result;

        let vidObj = {
          "video1":video1,
          "video2":video2
        }     

          res.json(vidObj); // sending back to the client
          
        }).catch(function(err){
           console.log("Couldn't get second video: ", err);
        }); 
    })
  .catch(function(err){
     console.log("Couldn't get first video: ", err);
  });
});


// Step 5
app.post('/insertPref', async (req, res) => {

let rowIDbetter = req.body.better;
let rowIDworse = req.body.worse;

  
 await dbo.post_video(rowIDbetter,rowIDworse);
  const preferencesTable = await dumpTable();

    console.log(preferencesTable);
  // Preference Table 
  if(preferencesTable.length >= 15)
  {
      res.json({msg: "pick winner"});
  }
  else
  {
    res.json({msg: "continue"});
  }
  
});



// Page not found
app.use(function(req, res){
  res.status(404); 
  res.type('txt'); 
  res.send('404 - File '+req.url+' not found'); 
});

// end of pipeline specification

// Now listen for HTTP requests
// it's an event listener on the server!
const listener = app.listen(3001, function () {
  console.log("The static server is listening on port " + listener.address().port);
});


//more databases here
async function dumpTable() {
  const sql = "select * from PrefTable"
  let result = await db.all(sql)
  return result;
}



async function getVids(randomresult)
{
  const getTwoVids = "SELECT * from VideoTable where rowIdNum = ?";
let result = await db.get(getTwoVids,[randomresult]);
  return result;
}


