const container = document.querySelector(".container");
const image = document.querySelector("#music-image");
const title = document.querySelector("#music-details .title");
const singer = document.querySelector("#music-details .singer");
const prev = document.querySelector("#controls #prev");
const play = document.querySelector("#controls #play");
const next = document.querySelector("#controls #next");
// const audio = document.querySelector("#audio");
const duration = document.querySelector("#duration");
const currentTime = document.querySelector("#current-time");
const progressBar = document.querySelector("#progress-bar");
const volume = document.querySelector("#volume");
const volumeBar = document.querySelector("#volume-bar");
const contentButton = document.querySelector(".content-button");
const contentList = document.querySelector(".content-songs-list");

const player = new MusicPlayer(musicList);

window.addEventListener("load", () => {
  let music = player.getMusic();
  displayMusic(music);
  displayMusicList(player.musicList);
  isPlayingNow();
});

const displayMusic = (music) => {
  title.innerText = music.getName();
  singer.innerText = music.singer;
  image.src = "img/" + music.img;
  audio.src = "mp3/" + music.file;
};

play.addEventListener("click", () => {
  playMusic();
});

const playMusic = () => {
  audio.paused
    ? (container.classList.add("playing"),
      audio.play(),
      (play.classList = " fa-solid fa-pause"))
    : (container.classList.remove("playing"),
      (play.classList = " fa-solid fa-play"),
      audio.pause());

  isPlayingNow();
};

prev.addEventListener("click", () => {
  prevMusic();
});

const prevMusic = () => {
  player.prev();
  let music = player.getMusic();
  displayMusic(music);
  play.classList = " fa-solid fa-play";
  container.classList.remove("playing");
  playMusic();
  isPlayingNow();
};

next.addEventListener("click", () => {
  nextMusic();
});

const nextMusic = () => {
  player.next();
  let music = player.getMusic();
  displayMusic(music);
  play.classList = " fa-solid fa-play";
  container.classList.remove("playing");
  playMusic();
  isPlayingNow();
};

const calculateTime = (seconds) => {
  const minute = Math.floor(seconds / 60);
  const second = Math.floor(seconds % 60);
  const updatedMinute = minute < 10 ? `0${minute}` : `${minute}`;
  const updatedSecond = second < 10 ? `0${second}` : `${second}`;
  const result = `${updatedMinute}:${updatedSecond}`;
  return result;
};

audio.addEventListener("loadedmetadata", () => {
  //   console.log(audio.duration);
  duration.textContent = calculateTime(audio.duration);
  progressBar.max = Math.floor(audio.duration);
  audio.volume = 0.5;
});

audio.addEventListener("timeupdate", () => {
  progressBar.value = Math.floor(audio.currentTime);
  currentTime.textContent = calculateTime(progressBar.value);
});

progressBar.addEventListener("input", () => {
  currentTime.textContent = calculateTime(progressBar.value);
  audio.currentTime = progressBar.value;
});

let volumeStatus = "on";
volume.addEventListener("click", () => {
  if (volumeStatus === "on") {
    audio.muted = true;
    volumeStatus = "off";
    volume.classList = "fa-solid fa-volume-xmark";
    volumeBar.value = 0;
  } else {
    audio.muted = false;
    volumeStatus = "on";
    volume.classList = "fa-solid fa-volume-high";
    volumeBar.value = 30;
    audio.volume = 0.3;
  }
});

volumeBar.addEventListener("input", (e) => {
  const value = e.target.value;
  audio.volume = value / 100;

  if (value == 0) {
    audio.muted = true;
    volumeStatus = "off";
    volume.classList = "fa-solid fa-volume-xmark";
    // volumeBar.value = 0;
  } else {
    audio.muted = false;
    volumeStatus = "on";
    volume.classList = "fa-solid fa-volume-high";
  }
});

contentButton.addEventListener("click", () => {
  if (contentList.style.display === "none") {
    setTimeout(function () {
      contentList.style.display = "block";
    }, 200);
    container.style.height = "760px";
  } else {
    setTimeout(function () {
      contentList.style.display = "none";
    }, 30);

    container.style.height = "565px";
  }
});

const displayMusicList = (list) => {
  for (let i = 0; i < list.length; i++) {
    let liTag = `<li li-index='${i}' onclick = "selectedMusic(this)">
    <span>${list[i].getName()}</span>
    <span id="music-${i}">03:20</span>
    <audio class="music-${i}" src="mp3/${list[i].file}"></audio>
    </li>`;

    contentList.insertAdjacentHTML("beforeend", liTag);

    let liAudioDuration = contentList.querySelector(`#music-${i}`);
    let liAudioTag = contentList.querySelector(`.music-${i}`);

    liAudioTag.addEventListener("loadeddata", () => {
      liAudioDuration.innerText = calculateTime(liAudioTag.duration);
    });
  }
};

const selectedMusic = (li) => {
  player.index = li.getAttribute("li-index");
  displayMusic(player.getMusic());
  playMusic();
  isPlayingNow();
};

const isPlayingNow = () => {
  for (let li of contentList.querySelectorAll("li")) {
    if (li.classList.contains("playing02")) {
      li.classList.remove("playing02");
    }

    if (li.getAttribute("li-index") == player.index) {
      li.classList.add("playing02");
    }
  }
};

audio.addEventListener("ended", () => {
  nextMusic();
});
