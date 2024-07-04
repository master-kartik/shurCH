document.addEventListener("DOMContentLoaded", () => {
  let searchBtnEl = document.getElementById("search-btn");
  let dataContainerEl = document.getElementById("results");
  let videoInputEl = document.getElementById("input-ele")
  let searchInputEl = document.getElementById("search-input");
  let formEl = document.getElementById("form");
  const DEV_URL = "http://localhost:5000";
  // const PROD_URL = "https://search-inside-yt-video-production.up.railway.app";
  console.log("first")

  chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
    let url = tabs[0].url;
    videoInputEl.value = url;
    console.log("second")
  });

  function formatTime(timeInSeconds) {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = (timeInSeconds % 3600) % 60;

    return `${hours ? hours + "h : " : ""}${minutes ? minutes + "min : " : ""}${
      seconds + "sec"
    }`;
  }

  function extractVideoId(url) {
    console.log("start")
    const pattern =
      /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(pattern);
    if (match) {
      console.log(match[1])
      return match[1];
    }
    console.log("no march")
    return null;

  }

  formEl.addEventListener("submit", (e) => {
    e.preventDefault();
     fetchDataFromBackend()
  });

  function search(dataFromBackend) {
    let filteredArr = [];
    dataContainerEl.style.display = "block"
    dataContainerEl.innerHTML = "";
    if (searchInputEl.value.split(" ").length > 1) {
      for (let index = 0; index < dataFromBackend.length - 1; index++) {
        const textCombo = `${dataFromBackend[index].text} ${
          dataFromBackend[index + 1].text
        }`;
        console.log(textCombo)
        if (
          textCombo.toLowerCase().includes(searchInputEl.value.toLowerCase())
        ) {
          filteredArr.push([
            dataFromBackend[index],
            dataFromBackend[index + 1],
          ]);
          console.log(textCombo);
        } else {
          searchBtnEl.textContent = "Not Found";
          searchBtnEl.textContent = "Search";
          searchBtnEl.disabled = false;
         
        }
      }
    } else {
      dataFromBackend.forEach((transcript) => {
        if (
          transcript.text
            .toLowerCase()
            .includes(searchInputEl.value.toLowerCase())
        ) {
          console.log(transcript.text)
          filteredArr.push([transcript]);
        } else {
          searchBtnEl.textContent = "Search";
          searchBtnEl.disabled = false;
          
        }
      });
    }
    filteredArr.map((result) => {
      const videoId = extractVideoId(videoInputEl.value);

      const pStartTime = document.createElement("a");
      pStartTime.setAttribute("id", "start-time-a");
      console.log(result ,"<------result")
      start = (result[0].offset)/1000
      console.log(result[0])
      console.log(result ,"<------result[0]")
      console.log(start ,"<------start")
      const seconds = Math.floor(start % 60);
      
      
      pStartTime.href = `${
        "https://youtube.com/watch?v=" +
        videoId +
        "&t=" +
        Math.floor(start*1000) +
        "s"
      }`;
      pStartTime.target = "_blank";
      pStartTime.innerHTML = formatTime(Math.floor(start*1000));

      const pText = document.createElement("p");
      pText.setAttribute("id", "p-text");
      pText.innerHTML =
        result.length > 1
          ? `${result[0].text + " " + result[1].text}`
          : result[0].text;

      const div = document.createElement("div");
      div.setAttribute("id", "groupDiv");
      div.appendChild(pStartTime);
      div.appendChild(pText);

      dataContainerEl.appendChild(div);

      searchBtnEl.innerHTML = "Search";
      searchBtnEl.disabled = false;
      
     
    });
      if(dataContainerEl.innerText === ""){
        dataContainerEl.innerHTML = "Word or a phrase not found, try searching something else";
      }
  }

  function fetchDataFromBackend() {
    searchBtnEl.innerHTML = "Searching...";
    searchBtnEl.disabled = true;
    console.log("sending fetch")
    fetch(`${DEV_URL}/transcript?video_url=${encodeURIComponent(videoInputEl.value)}`)
      .then((data) => data.json())
      .then((resp) => {
        console.log("respnse", resp)
        search(resp);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        searchBtnEl.innerHTML = "Search";
        searchBtnEl.disabled = false;
      });
  }
});
