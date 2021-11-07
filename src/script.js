
const songs = [
	{
		title: 'Buddy Light',
		duration: '02:02',
		slug: 'buddy'
	},
	{
		title: 'Creative Minds',
		duration: '02:27',
		slug: 'creativeminds'
	},
	{
		title: 'Cute Cat',
		duration: '03:14',
		slug: 'cute'
	},
	{
		title: 'Going Higher',
		duration: '04:04',
		slug: 'goinghigher'
	},
	{
		title: 'Happy Rock',
		duration: '01:45',
		slug: 'happyrock'
	},
	{
		title: 'Little Idea',
		duration: '02:49',
		slug: 'littleidea'
	},
	{
		title: 'My Memories',
		duration: '03:50',
		slug: 'memories'
	},
	{
		title: 'Piano Moment',
		duration: '01:50',
		slug: 'pianomoment',
	},
	{
		title: 'Retro Soul',
		duration: '03:36',
		slug: 'retrosoul'
	},
	{
		title: 'The Jazz Piano',
		duration: '02:40',
		slug: 'thejazzpiano'
	}
];

//Set song URL, IMG Dynamically
songs.forEach( song => {
	song.url = `audio/${song.slug}.mp3`;
	song.img = `image/${song.slug}.jpg`;
});

const playlistContainer = document.querySelector('.music-collection-wrapper');


const createPlaylist = () => {
	playlistContainer.innerHTML = '';
	
	songs.forEach( (song, i) => {
		const html = `
			<div class="music-collection d-flex justify-content-between" tabindex="0" data-song="${song.slug}" data-songnum="${i}">
				<div class="d-flex">
					<div class="music-img--sm">
						<img src="${song.img}" class="music-img img-fluid">
					</div>
					<div class="music-detail align-self-center d-flex flex-column">
						<h6 class="music-title">${song.title}</h6>
						<small class="music-duration">${song.duration}</small>
					</div>	
				</div>
				<div class="music-status align-self-center">
					<div class="status--pause">
						<div class="pause--triangle"></div>
					</div>
					<div class="status--playing hide">
						<div class="d-flex">
							<div class="bar"></div>
							<div class="bar"></div>
							<div class="bar"></div>
						</div>
					</div>
				</div>					
			</div>
		`;
		playlistContainer.insertAdjacentHTML('beforeend', html);
	});
} 
createPlaylist();


const playlistSongs = document.querySelectorAll('.music-collection');
const musicPlayer = document.getElementById('music-player');
const musicSource = document.getElementById('music-source');
const musicThumbnailImg = document.querySelector('.music-thumbnail-img');
const musicThumbnailTitle = document.querySelector('.music-thumbnail-title');
const btnPlayPause = document.querySelector('.btn--playPause');
const progressBar = document.querySelector('.music-progress--bar');
const volumeBar = document.querySelector('.volume-bar');
const durationStart = document.querySelector('.music-duration--start');
const durationEnd = document.querySelector('.music-duration--end');
const btnFwdRev = document.querySelectorAll('.btn--fwdRev');
const btnNextPrev = document.querySelectorAll('.btn--nextPrev');
const btnVolume = document.querySelectorAll('.btn--volume'); 

let currentMusicSlug, currentMusicIndex;



//CONFIGURE PLAY/PAUSE ANIMATION FROM PLAYLIST SECTION
const configurePlayPauseBtn = function(playerPaused) {
	const [btn] = btnPlayPause.children;
	btn.classList.remove(...btn.classList); //clear the classlist
	
	playerPaused ? btn.classList.add('fa', 'fa-play') : btn.classList.add('fa', 'fa-pause');
}
configurePlayPauseBtn(true); //playerPaused = true (default)




/* ----------------------------------------------------------------------- */



//PLAY THE SONG
const playSong = function(e) {
	e.preventDefault();

	//Remove focus
	this.blur();

	//Get song
	const songSlug = this.getAttribute('data-song');
	const songNum = Number(this.getAttribute('data-songnum'));

	//Find song from songs object
	const music = songs.find( song => song.slug === songSlug);

	//Set song
	musicPlayer.setAttribute('data-playing', music.slug);
	musicSource.setAttribute('src', music.url);
	musicThumbnailImg.setAttribute('src', music.img);
	musicThumbnailTitle.textContent = music.title;

	//Load and play the music
	musicPlayer.load();
	musicPlayer.play();
	musicPlayer.volume = 0.5;
	volumeBar.style.height = `${musicPlayer.volume * 100}%`;


	//Scroll to the music currently playing in the playlist
	currentMusicSlug = musicPlayer.getAttribute('data-playing');
	currentMusicIndex = songs.findIndex( song => song.slug === currentMusicSlug);

	let containerPos = playlistContainer.offsetTop;
	let musicPos = playlistSongs[currentMusicIndex].offsetTop;
	let relativePos = musicPos - containerPos;

	// playlistContainer.scroll(0, relativePos);
	playlistContainer.scrollTo({
		left: 0, 
		top: relativePos,
		behavior: 'smooth'
	})


	//Hide play icon, Show pause icon in all music
	document.querySelectorAll('.status--playing').forEach(function(elem) {
		elem.classList.add('hide');
	})
	document.querySelectorAll('.status--pause').forEach(function(elem) {
		elem.classList.contains('hide') && elem.classList.remove('hide');
	})

	//Hide pause icon, Show playing icon in selected music from playlist section
	const [pauseDiv, playDiv] = this.children[1].children;
	playDiv.classList.contains('hide') && playDiv.classList.remove('hide');
	pauseDiv.classList.add('hide');

	//Configure Play/Pause button in Music Player section
	configurePlayPauseBtn(musicPlayer.paused);
};

//Select song from Playlist
playlistSongs.forEach(playlistSong => {
	playlistSong.addEventListener('click', playSong);
});




/* ------------------------------------------------------------------------ */



//CLICK PLAY/PAUSE BUTTON FROM MUSIC PLAYER
btnPlayPause.addEventListener('click', function(e) {
	e.preventDefault();
	this.blur();

	(musicPlayer.currentSrc === '') ? 
		playlistSongs[0].click() : musicPlayer.paused ? 
		musicPlayer.play() : musicPlayer.pause();

	configurePlayPauseBtn(musicPlayer.paused);
});



//KEYBOARD EVENT HANDLER
document.body.addEventListener('keydown', function(e) {
	const [prevBtn, nextBtn] = btnNextPrev;
	const [revBtn, fwdBtn] = btnFwdRev;
	const [volUpBtn, volDownBtn] = btnVolume;

	if (e.keyCode === 32) {
		//Spacebar is clicked
		btnPlayPause.click();

	} else if (e.shiftKey && e.key.toLowerCase() === 'n') {
		//Shift + N   ( Next Song )
		nextBtn.click();

	} else if (e.shiftKey && e.key.toLowerCase() === 'p') {
		//Shift + P   ( Previous Song )
		prevBtn.click();

	} else if (e.keyCode == 37) {
		//ArrowLeft   ( Skip -5 sec ) 
		revBtn.click();

	} else if (e.keyCode == 39) {
		//ArrowRight  ( Skip 5 sec ) 
		fwdBtn.click();

	} else if (e.keyCode == 38) {
		//ArrowUp     ( Increase Volume )
		volUpBtn.click();

	} else if (e.keyCode == 40) {
		//ArrowDown   ( Decrease Volume )
		volDownBtn.click();

	}
})



/* --------------------------------------------------------------------- */




//CLICK ON NEXT/PREVIOUS BUTTON TO CHANGE SONG
const changeSong = function(iter) {
	currentMusicSlug = musicPlayer.getAttribute('data-playing');
	currentMusicIndex = songs.findIndex( song => song.slug === currentMusicSlug);

	let nextMusicIndex = currentMusicIndex + iter;

	if (nextMusicIndex < 0) nextMusicIndex = songs.length - 1;
	if (nextMusicIndex >= songs.length) nextMusicIndex = 0;

	//Play the song
	playlistSongs[nextMusicIndex].click();

};
btnNextPrev.forEach( btn => {
	btn.addEventListener('click', function(e) {
		e.preventDefault();
		this.blur();

		const iter = Number(this.getAttribute('data-next'));
		musicPlayer.currentSrc !== '' ? changeSong(iter) : changeSong(1);
	});
});
	



/* ---------------------------------------------------------------------- */




//CLICK ON FORWARD/REVERSE BUTTON TO SKIP +-5 SEC AUDIO
const skipAudio = function(interval) {
	musicPlayer.currentTime += interval;
}
btnFwdRev.forEach( btn => {
	btn.addEventListener('click', function(e) {
		e.preventDefault();
		this.blur();

		const skipInterval = Number(this.getAttribute('data-skip'));
		//Work only when music is played
		if (musicPlayer.currentSrc !== '') skipAudio(skipInterval);
	});
});





/* ------------------------------------------------------------------------ */




//CLICK ON VOLUME UP/DOWN BUTTON
const controlVolume = function(vol) {
	// musicPlayer.volume has a range [0, 1]

	if (musicPlayer.volume > 0 && musicPlayer.volume < 1) {
		musicPlayer.volume = (musicPlayer.volume + vol).toFixed(2);	
	}
	else {
		if (musicPlayer.volume == 1) {
			if (vol < 0) musicPlayer.volume += vol;
		}
		else if(musicPlayer.volume == 0) {
			if (vol > 0) musicPlayer.volume += vol;
		}
	}

	volumeBar.style.height = `${musicPlayer.volume * 100}%`;
}
btnVolume.forEach( btn => {
	btn.addEventListener('click', function(e) {
		e.preventDefault();
		this.blur();

		const volumeInc = Number(this.getAttribute('data-volumeInc'));
		//Work only when music is played
		if (musicPlayer.currentSrc !== '') controlVolume(volumeInc);
	})
})





/* ------------------------------------------------------------------------ */




//UPDATE PROGRESS SECTION WHILE AUDIO IS PLAYING
const formatTime = function(time) {
	let min = parseInt(time / 60);
	let sec = parseInt(time - (min * 60));

	//Convert to String
	min += '';
	sec += '';

	return `${min.padStart(2, '0')}:${sec.padStart(2, '0')}`;
};
const updateProgressSection = function() {
	durationStart.textContent = musicPlayer.currentTime ? formatTime(musicPlayer.currentTime) : '00:00';;
	durationEnd.textContent = musicPlayer.duration ? formatTime(musicPlayer.duration) : '00:00';

	if (musicPlayer.currentTime) {
		// progressBar.width = 
		progressBar.style.width = `${(musicPlayer.currentTime / musicPlayer.duration) * 100}%`;
	}

	//When Music is played/paused by someexternal means OR music has completed playing
	configurePlayPauseBtn(musicPlayer.paused);

}

