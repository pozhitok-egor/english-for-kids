import correct from '../assets/audio/correct.mp3';
import error from '../assets/audio/error.mp3';
import failure from '../assets/audio/failure.mp3';
import success from '../assets/audio/success.mp3';
import successImg from '../assets/img/success.png';
import failureImg from '../assets/img/failure.png';

const audioAPI = 'http://api.voicerss.org/?key=305eccbb0f61488da5847d6923c40975&hl=en-us&v=Mary&c=MP3&f=16khz_16bit_stereo&src=';

class Cards {
  constructor() {
    this.appBlock = document.querySelector(".app>.container");
    this.elements = [];
    this.gameElements = [];
    this.mistakes = 0;
    this.repeats = 0;
    this.gameState = null;
    this.current = null;
  }

  newElement() {
    if (this.gameElements.length !== 0) {
      const button = document.querySelector(".game-bar__button");
      this.current = this.gameElements.shift();
      const audio = new Audio(`${audioAPI}${this.current.word}`);
      audio.volume = 1;
      audio.play();
      audio.onended = () => { button.disabled = false };
    } else if (this.mistakes === 0) {
      const audio = new Audio(success);
      audio.volume = 1;
      audio.play();
      this.finishWindow("win");
    } else if (this.mistakes > 0) {
      const audio = new Audio(failure);
      audio.volume = 1;
      audio.play();
      this.finishWindow("lose");
    }
  }

  finishWindow(cases) {
    const finishWindow = document.querySelector(".finish-window");
    const imageBlock = document.querySelector(".finish-window__image");
    const textBlock = document.querySelector(".finish-window__text");
    const img = document.createElement("img");
    while (imageBlock.firstChild) imageBlock.removeChild(imageBlock.firstChild);
    switch (cases) {
      case "win":
        img.src = successImg;
        img.setAttribute("alt", "You won")
        imageBlock.append(img);
        textBlock.textContent = "Congratulations!";
        break;
      case "lose":
        img.src = failureImg;
        img.setAttribute("alt", "You lose")
        imageBlock.append(img);
        textBlock.textContent = this.mistakes > 1 ? `Sorry, you made ${this.mistakes} mistakes!` : `Sorry, you made ${this.mistakes} mistake!`;
        break;
      default:
        break;
    }

    finishWindow.classList.add("active");
    window.setTimeout(() => {
      window.location.href = `${window.location.origin}${window.location.pathname}#`;
      finishWindow.classList.remove("active");
    }, 4000);
    this.clearAll();
  }

  togglePlayMode(state) {
    const button = document.querySelector(".game-bar__button");
    switch (state) {
      case true:
        this.elements.forEach(elem => elem.element.classList.add("play"));
        document.querySelector(".game-bar").classList.add("active");
        button.disabled = false;
        button.innerHTML = 'Play Game';
        button.classList.add("play");
        this.gameState = "play";
        break;
      case false:
        this.elements.forEach(elem => elem.element.classList.remove("play"));
        document.querySelector(".game-bar").classList.remove("active");
        this.gameState = "train";
        break;
      default:
        this.elements.forEach(elem => elem.element.classList.toggle("play"));
        document.querySelector(".game-bar").classList.toggle("active");
        this.gameState = this.gameState === "train" ? "play" : "train";
        break;
    }
  }

  startGame() {
    const stars = document.createElement("div");
    const button = document.querySelector(".game-bar__button");

    stars.classList.add("game-bar__stars");

    this.gameElements = [...this.elements.sort(() => Math.random() - 0.5)];
    button.onclick = () => {
      if (this.gameState === "play") {
        document.querySelector(".game-bar").append(stars);
        button.classList.remove("play");
        button.innerHTML = `Repeat<i class="material-icons">cached</i>`;
        button.disabled = true;
        this.gameState = "playing";
        this.current = this.gameElements.shift();
        const audio = new Audio(`${audioAPI}${this.current.word}`);
        audio.volume = 1;
        audio.play();
        audio.onended = () => {button.disabled = false};
      } else if (this.gameState === "playing") {
        button.disabled = true;
        const audio = new Audio(`${audioAPI}${this.current.word}`);
        audio.volume = 1;
        audio.play();
        audio.onended = () => {button.disabled = false};
        this.repeats += 1;
      }
    };
  }

  clearAll() { //
    this.togglePlayMode(false);
    const gameBar = document.querySelector(".game-bar");
    const stars = document.querySelector(".game-bar__stars");
    if (stars)
    while (stars.firstChild) stars.removeChild(stars.firstChild);
    if (stars) gameBar.removeChild(stars);
    const button = document.querySelector(".game-bar__button");
    document.querySelectorAll(".card-container.inactive").forEach(elem => elem.classList.remove("inactive"));
    button.disabled = false;
    button.innerHTML = `Play Game`;
    button.classList.add("play");
    this.current = null;
    this.gameState = "train";
    this.mistakes = 0;
    this.repeats = 0;
    this.current = null;
  }

  error(element) {
    if (!element.classList.contains("inactive")) {
      const item = JSON.parse(localStorage.getItem(this.current.word));
      item.incorrect += 1;
      localStorage.setItem(this.current.word, JSON.stringify(item));
      const star = document.createElement("i");
      star.classList.add("material-icons");
      star.textContent = "star_border";
      document.querySelector(".game-bar__stars").append(star);
      const audio = new Audio(error);
      audio.volume = 1;
      audio.play();
      this.mistakes += 1;
    }
  }

  correct(element) {
    if (!element.classList.contains("inactive")) {
      const item = JSON.parse(localStorage.getItem(this.current.word));
      item.correct += 1;
      localStorage.setItem(this.current.word, JSON.stringify(item));
      const star = document.createElement("i");
      star.classList.add("material-icons");
      star.classList.add("correct");
      star.textContent = "star";
      document.querySelector(".game-bar__stars").append(star);
      element.classList.add("inactive");
      const audio = new Audio(correct);
      audio.volume = 1;
      audio.play();
      audio.onended = this.newElement();
    }
  }

  render(arr) {
    this.elements = [];
    this.gameState = "train";
    while (this.appBlock.firstChild) {
      this.appBlock.removeChild(this.appBlock.firstChild);
    }
    arr.forEach((element) => {
      const div = document.createElement("div");
      div.classList.add("card-container");

      const front = document.createElement("div");
      front.classList.add("front");
      const imgBlockFront = document.createElement("div");
      imgBlockFront.classList.add("card__image");
      const imgFront = document.createElement("img");
      imgFront.src = `./${element.image}`;
      imgFront.setAttribute("alt", element.word);
      imgBlockFront.append(imgFront);
      const titleFront = document.createElement("div");
      titleFront.textContent = element.word;
      titleFront.classList.add("card__title")
      front.append(...[imgBlockFront, titleFront]);

      const back = document.createElement("div");
      back.classList.add("back");
      const imgBlockBack = document.createElement("div");
      imgBlockBack.classList.add("card__image");
      const imgBack = document.createElement("img");
      imgBack.src = `./${element.image}`;
      imgBack.setAttribute("alt", element.translation);
      imgBlockBack.append(imgBack)
      const titleBack = document.createElement("div");
      titleBack.textContent = element.translation;
      titleBack.classList.add("card__title")
      back.append(...[imgBlockBack, titleBack]);

      const button = document.createElement('button');
      button.id = "flip";
      button.innerHTML = '<i class="material-icons">cached</i>';

      div.append(...[back, front, button])
      this.appBlock.append(div);
      this.elements.push({
        element: div,
        word: element.word
      });

      div.addEventListener("click", (e) => {
        if (this.gameState === "train") {
          if (e.target.parentNode === button)
            div.classList.add("flip");
          else {
            const item = JSON.parse(localStorage.getItem(element.word));
            item.trained += 1;
            localStorage.setItem(element.word, JSON.stringify(item));
            const audio = new Audio();
            audio.src = `${audioAPI}${element.audioSrc}`
            audio.volume = 1;
            audio.play();
          }
        } else if (this.gameState === "playing" && div !== this.current.element) {
          this.error(div);
        } else if (this.gameState === "playing" && div === this.current.element) {
          this.correct(div);
        }
      });

      back.onmouseover = () => {
        div.classList.add("flip");
      }
      back.onmouseout = () => {
        div.classList.remove("flip");
      }
    });

    if (arr.length === 0) {
      const h1 = document.createElement("h1");
      h1.textContent = `No words found`;
      this.appBlock.append(h1);
      this.gameState = null;
    }

    if (document.getElementById("toggle__switch") && this.gameState === "train")
      this.togglePlayMode(document.getElementById("toggle__switch").checked);
    this.startGame();
  }
}

export default Cards;
