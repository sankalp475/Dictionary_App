let item_selector = document.getElementById("item");
let language_code;
if (item_selector.value === "") {
	item_selector.value = "en_US";
	language_code = item_selector.value;
}

item_selector.addEventListener("change", function (e) {
	if (e.target.value === "") {
		alert("empty");
	} else {
		language_code = e.target.value;
	}
});

let input = document.getElementById("input");
let search = document.getElementById("search");
let word;
let url = ``;
let displayval = document.getElementById("container");

displayval.style.display = "none";

// click event
search.addEventListener("click", function () {
	displayval.style.display = "block";
	word = input.value;
	url = `https://api.dictionaryapi.dev/api/v2/entries/${language_code}/${word}`;
	FetchData(url);
	return url;
});

let html = ``;
// adding xml http request
function FetchData(__urlData__) {
	// new requedt
	const xhr = new XMLHttpRequest();

	// xhr open request 
	xhr.open("GET", __urlData__, true);

	// xhr onload function 
	xhr.onload = function () {
		displayval.style.display = "block";
		if (this.status == 200) {
			let audio = [];
			let audioTXT = [];
			let displayword;
			let arrdef = [];
			let arrexample = [];
			let Fetchvalue = JSON.parse(this.response);
			Array.from(Fetchvalue).forEach(function (element) {
				displayword = element.word;
				let arr1 = element.meanings;
				Array.from(arr1).forEach(function (element) {
					let arr2 = element.definitions;
					Array.from(arr2).forEach(function (element) {
						let arr3 = element.definition;
						let arr4 = element.example;
						arrdef.push(arr3);
						arrexample.push(arr4);
					});
				});
				// audio = (element.phonetics[0].audio)
				let arr6 = element.phonetics;
				arr6.forEach(function (element) {
					if (audioTXT.length == 0 && audio.length == 0) {
						audioTXT.push(element.text);
						audio.push(element.audio);
					}
				});
				// audioTXT = (element.phonetics[0].text)
			});

			let word_sound = document.getElementById("word_sound");
			let wordhtml = `
			    <h1 class="is-size-4">WORD</h1>
		        <div class="is-flex play-div">
		        	<button class="button is-rounded " id="play" btn><i class="fa fa-volume-down" id="vol" aria-hidden="true"></i></button> <h1 class="is-size-3">${displayword}</h1> <br>
		        </div>
                <h1 class="is-size-4">${audioTXT}</h1>
                <audio id="audio" src="${audio}" type="audio/mpeg">
			`;
			if(wordhtml != null) {
				word_sound.innerHTML = wordhtml;
			} else {
				word_sound.innerHTML = "error";
			}
			arrdef.forEach(function (element, index) {
				let discription = document.getElementById("discription");
				let discriptionhtml = arrdef[0];
				discription.innerHTML = discriptionhtml;
			});

			let Example = document.getElementById("Example");
			let Examplehtml = arrexample[0];
			Example.innerHTML = Examplehtml;

			const synonyms = Fetchvalue[0].meanings[0].definitions[0].synonyms;

			if (synonyms == null || synonyms == undefined) {
				// 0.meanings
				let synonymsvalue = "";
				let synonyms_div = document.getElementById("synonyms");
				synonyms_div.innerHTML = synonymsvalue;
			} else {
				let synonymsvalue = "";
				for (let i = 0; i < synonyms.length; i++) {
					synonymsvalue += `<button class="button is-link is-rounded mx-2 my-1" id="${i} " onclick="addword(this.id);">${synonyms[i]}</button>`;
				}
				let synonyms_div = document.getElementById("synonyms");
				synonyms_div.innerHTML = synonymsvalue;
			}

			let play_audio = document.getElementById("play");
			let sound = document.getElementById("audio");
			let volume = document.getElementById("vol");

			play_audio.addEventListener("click", function () {
				let myAudio;
				setTimeout(function () {
					if (volume.className.includes("fa-volume-down")) {
						volume.className = "fa fa-volume-up";
						myAudio = sound.play();
					}
				}, 500);

				setInterval(function () {
					if (volume.className.includes("fa-volume-up")) {
						volume.className = "fa fa-volume-down";
						// myAudio = audio.paused();
					}
				}, 2000);
			});
		} else {
			let Fetchvalue = JSON.parse(this.response);
			displayval.innerHTML = `
			    <h3 class="title">
				    ${Fetchvalue.title}
			    </h1>
				<p class="is-size-5">
				    ${Fetchvalue.message}
			    </p>
				<p class="is-size-5">
				    ${Fetchvalue.resolution}
			    </p>
			`;
		    setTimeout(() => {
				displayval.style.display = "none";
				window.location.reload();
			}, 3000);
			
		}

		
	};
	xhr.send();
}


function addword(index) {
	console.log(input.value);
	console.log(document.getElementById(index).innerHTML);
	let keyword = document.getElementById(index).innerHTML;
	input.value = keyword;
}