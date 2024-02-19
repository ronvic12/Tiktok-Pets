// when this page is opened, get the most recently added video and show it.
// function is defined in video.js
let divElmt = document.getElementById("tiktokDiv");

let reloadButton = document.getElementById("reload");
// set up button to reload video in "tiktokDiv"
reloadButton.addEventListener("click",function () {
  reloadVideo(tiktokDiv);
});



// always shows the same hard-coded video.  You'll need to get the server to 
// compute the winner, by sending a 
// GET request to /getWinner,
// and send the result back in the HTTP response.

showWinningVideo()

function showWinningVideo() {
  
  // let winningUrl = "https://www.tiktok.com/@catcatbiubiubiu/video/6990180291545468166";


  // Getting the request from the server
  sendGetRequest("/getWinner")
  .then(function(mydata){
  
    let winningUrl = mydata.video1.url;
    let nickname = mydata.video1.nickname;

    addVideo(winningUrl,divElmt);

    // Step 11
    let winnernickname = document.getElementById("winnernickname");
    winnernickname.textContent = nickname;

     loadTheVideos();
    
  }).catch(function(err){
     console.log('Couldnt get winner video from server', err);
  });
  
}

