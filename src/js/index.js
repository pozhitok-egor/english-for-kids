import '../css/style.scss';
import cardsData from './cards-data';
import renderBurger from './burger';
import Categories from './categories';
import Cards from './cards';
import Stats from './stats';
import checkLocalStorage from './checkStorage';

require.context('../assets/img');

const App = {
  elements : {
    categorycards: null,
    wordcards: null,
    stats: null,
    menu: null,
    hover: null,
    toggleMenuId: null,
    repeatButton: null
  },

  init() {
    this.elements.hover = document.querySelector(".burger .hover")
    this.elements.toggleMenuId = document.getElementById("menu__toggle");
    this.elements.menu = document.querySelector(".burger__menu");
    const appBlock = document.querySelector(".app>.container");
    this.elements.repeatButton = document.createElement("button");
    this.elements.repeatButton.classList.add("stats-buttons__repeat");
    this.elements.repeatButton.textContent = "Repeat difficult words";
    renderBurger(document.querySelector(".burger__menu>ul"));

    this.elements.categorycards = new Categories(appBlock, cardsData[0],
      cardsData.reduce((acc, val, index) => {
        if (index > 0)
         acc.push(val[0].image)
        return acc
      }, [])
    );
    this.elements.categorycards.init();
    this.elements.wordcards = new Cards(appBlock);
    this.elements.stats = new Stats(appBlock, this.elements.repeatButton);

    checkLocalStorage(cardsData);

    this.elements.repeatButton.onclick = () => {
      this.elements.wordcards.render(this.elements.stats.getDifficultWords());
    };

    this.elements.toggleMenuId.addEventListener('click', () => {
      if ( this.elements.toggleMenuId.checked ) {
        this.elements.hover.classList.add("active")
        this.elements.menu.classList.add("active")
      } else {
        this.elements.menu.classList.remove("active");
        this.elements.hover.classList.remove("active");
      }
    });

    const toggleGame = document.getElementById("toggle__switch");
    toggleGame.addEventListener("change", () => {
      if (this.elements.wordcards.gameState)
        if (toggleGame.checked)
          this.elements.wordcards.togglePlayMode(toggleGame.checked);
        else
          this.elements.wordcards.clearAll();
    });

    this.elements.hover.addEventListener("click", () => {
      this.elements.menu.classList.remove("active");
      this.elements.hover.classList.remove("active");
      this.elements.toggleMenuId.checked = false;
    });
  },

  renderOnPageLoadOrURLChange() {
    this.elements.menu.classList.remove("active");
    this.elements.hover.classList.remove("active");
    this.elements.toggleMenuId.checked = false;
    const currentPath = decodeURI(window.location.hash).substr(1);
    if (currentPath === "") {
      this.elements.wordcards.clearAll()
      this.elements.wordcards.gameState = null;
      this.elements.categorycards.render();
    } else if (currentPath === "stats"){
      this.elements.wordcards.clearAll()
      this.elements.wordcards.gameState = null;
      this.elements.stats.render()
    } else if (cardsData[0].indexOf(currentPath) !== -1 && cardsData[cardsData[0].indexOf(currentPath)+1]) {
      this.elements.wordcards.render(cardsData[cardsData[0].indexOf(currentPath)+1]);
    } else {
      window.location.href = `${window.location.origin}${window.location.pathname}#`;
    }
  }
}

window.onload = () => {
  App.init();
  App.renderOnPageLoadOrURLChange();
};

window.addEventListener('popstate', (e) => {
  e.preventDefault();
  App.renderOnPageLoadOrURLChange();
});
