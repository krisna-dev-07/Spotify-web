console.log("let write some js");
let CurrentSong = new Audio();

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

const playMusic = (songName) => {
    // let audio = new Audio(`/songs/${songName}`);
    CurrentSong.src = `/songs/${songName}`
    CurrentSong.play();
    play.src="pause.svg";
}
async function main() {
    let songs = await getSongs();
    let songUL = document.querySelector(".songList ul");
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li> 
        <img class="invert" src="music.svg" alt="">  

        
                        <div class="info">
                        <div> ${song.replaceAll("%20", " ")}</div>
                        <div>K.K</div>
                    </div>
                    <div class="playnow">
                        <span>Play Now</span>
                        <img class="invert" src="play.svg" alt="">
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
            play.src = "pause.svg";
        }
        else {
            CurrentSong.pause();
            play.src = "play.svg";
        }
    })

}
main()