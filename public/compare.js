// for toggle button

//https://stackoverflow.com/questions/25893125/toggle-button-color-with-addeventlistener

let videoElmts = document.getElementsByClassName("tiktokDiv");
let heartElmts = document.getElementsByClassName("heart");
let reloadButtons = document.getElementsByClassName("reload");
let heartButtons = document.querySelectorAll("div.heart");

let nextButton = document.getElementsByClassName("enabledButton");

let next = nextButton[0];
next.addEventListener("click", function(){nextPage()});


for (let i=0; i<2; i++) {
  let reload = reloadButtons[i]; 
  reload.addEventListener("click",function() { reloadVideo(videoElmts[i]) });
    
  let heart = heartButtons[i];
  heartButtons[i].classList.add("unloved");
  heart.addEventListener("click",function(){lovedVideo(heart)});
}


// For step 4
function lovedVideo(heart){
let lovedVideos = document.getElementsByClassName("loved");
  console.log("loved videos ", lovedVideos);
if (lovedVideos.length == 1){
  lovedVideos[0].firstChild.setAttribute("class","far fa-heart");
  lovedVideos[0].classList.remove("loved");
}
  heart.firstChild.setAttribute("class","fas fa-heart");
  heart.classList.add("loved");
}


function nextPage()
{
  let heartElements = document.querySelectorAll("div.heart");
  // get storage item first
  let better;
  let worse;
  let randomVid1 = sessionStorage.getItem("Video1"); 
  let randomVid2 = sessionStorage.getItem("Video2"); 

  if(heartElements[0].classList.contains("loved")){
    better = randomVid1;
    worse = randomVid2;
  }
  else if(heartElements[1].classList.contains("loved"))
  {
    better = randomVid2;
    worse = randomVid1;   
  }

  // Random Video Data json for sending into Post Request
  const randomVideoData =
  {
    "better": better,
    "worse": worse
  }


 sendPostRequest("/insertPref",randomVideoData)
    .then(function (data) {
      console.log("data is ",data);
      console.log(" msg ",data.msg);
      if (data.msg == "continue")
      {
        window.location = "compare.html";
      }
      else if (data.msg == "pick winner")
      {
        window.location = "winner.html";
      }
      
    })
    .catch(function (error) {
       console.error('Error:', error);
  });

  
}


// hard-code videos for now
// You will need to get pairs of videos from the server to play the game.


sendGetRequest("/getTwoVideos")
  .then(function(data){
    
    // Get the data and set into local storage for nextPage function
    let video1 = data.video1.rowIdNum;
    let video2 = data.video2.rowIdNum
    sessionStorage.setItem("Video1",video1);
    sessionStorage.setItem("Video2",video2);
    
    const urls = [data.video1.url,data.video2.url];
    for (let i=0; i<2; i++) {
      addVideo(urls[i],videoElmts[i]);
      if(i == 0)
      {
        let nickname = document.getElementById("nickname1");
        nickname.textContent = data.video1.nickname;
      } 
      else
      {
        let nickname = document.getElementById("nickname2");
        nickname.textContent = data.video2.nickname;
      }
    }
    // load the videos after the names are pasted in! 
    loadTheVideos();

  }).catch(function(err){
     console.log('Couldnt get videos from server', err);
  });









