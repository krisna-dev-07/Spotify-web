console.log("let write some js");
let CurrentSong = new Audio();
let songs;

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}
async function getSongs() {

    let a = await fetch("http://127.0.0.1:5500/songs/")
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")

    let songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {

            songs.push(element.href.split(`/songs/`)[1])
        }

    }
    return songs

}
// Get all the songs in the playlist

const playMusic = (songName, pause = false) => {
    // let audio = new Audio(`/songs/${songName}`);
    CurrentSong.src = `/songs/${songName}`
    if (!pause) {

        CurrentSong.play();
        play.src = "images/pause.svg";
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(songName)
    document.querySelector(".songtime").textContent = "00:00 / 00:00"

}
async function main() {

    songs = await getSongs();
    playMusic(songs[0], true);
    let songUL = document.querySelector(".songList ul");
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li> 
        <img class="invert" src="images/music.svg" alt="">  

        
                        <div class="info">
                        <div> ${song.replaceAll("%20", " ")}</div>
                        <div>K.K</div>
                    </div>
                    <div class="playnow">
                        <span>Play Now</span>
                        <img class="invert" src="images/play.svg" alt="">
                    </div> </li>`;
    }
    // ADD A EVENT LISTENER TO FOR Each MUSIC
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", () => {
            let songName = e.querySelector(".info div").innerText.trim();
            playMusic(songName);

        })
    })

    //Add event listener for song buton

    play.addEventListener("click", () => {
        if (CurrentSong.paused) {
            CurrentSong.play();
            play.src = "images/pause.svg";
        }
        else {
            CurrentSong.pause();
            play.src = "images/play.svg";
        }
    })
    //Listen for timeupdate event
    CurrentSong.addEventListener("timeupdate", () => {
        // console.log(CurrentSong.currentTime, CurrentSong.duration);
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(CurrentSong.currentTime)}/${secondsToMinutesSeconds(CurrentSong.duration)}`
        document.querySelector(".round").style.left = (CurrentSong.currentTime / CurrentSong.duration) * 100 + "%"

    })

    // Add eventlistener to seekbar

    document.querySelector(".seekbar").addEventListener("click", (e) => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        // console.log(percent);
        // console.log(CurrentSong.duration);
        document.querySelector(".round").style.left = percent + "%"
        CurrentSong.currentTime = ((CurrentSong.duration) * percent) / 100;
    })

    //Add event listener to hamburger
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0"
    })

    //Add event listener to cross
    document.querySelector(".cross").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%"
    })
    //Add event listenser to prev
    prev.addEventListener("click", () => {
        // console.log("clicked to prev");
        let index = songs.indexOf(CurrentSong.src.split("/").slice(-1)[0])
        if (index - 1 >= 0) {

            playMusic(songs[index - 1])
        }
    })
    //Add next event listener
    next.addEventListener("click", () => {
        let index = songs.indexOf(CurrentSong.src.split("/").slice(-1)[0])
        if (index + 1 < songs.length) {

            playMusic(songs[index + 1])
        }
    })
    document.querySelector(".volume").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        console.log("Setting volume to", e.target.value, "/ 100")
        CurrentSong.volume = parseInt(e.target.value) / 100
        if (CurrentSong.volume > 0) {
            document.querySelector(".volume>img").src = document.querySelector(".volume>img").src.replace("mute.svg", "volume.svg")
        }
    })
}
main()