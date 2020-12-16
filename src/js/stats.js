import cards from './cards-data';
import checkLocalStorage from './checkStorage';

class Stats {
  constructor(appBlock, repeatButton) {
    this.appBlock = appBlock;
    this.repeatButton = repeatButton;
    this.item = null;
    this.table = null;
    this.sortElement = null;
    this.difficultWords = null;
  }

  switchSortClasses(element) {
    if (this.sortElement === element) {
      if (this.sortElement.classList.contains("descending")) {
        this.sortElement.classList.remove("descending");
        this.sortElement.classList.add("ascending");
      } else if (this.sortElement.classList.contains("ascending")) {
        this.sortElement.classList.remove("ascending");
        this.sortElement.classList.add("descending");
      }
    } else if (this.sortElement) {
      if (this.sortElement.classList.contains("descending")) {
        this.sortElement.classList.remove("descending");
      } else if (this.sortElement.classList.contains("ascending")) {
        this.sortElement.classList.remove("ascending");
      }
      this.sortElement = element;
      this.sortElement.classList.add("ascending");
    } else if (!this.sortElement) {
      this.sortElement = element;
      this.sortElement.classList.add("ascending");
    }
  }

  sortTable(n, type) {
    const {rows} = this.table;
    let sorting = false;
    rows.forEach((elem, index) => {
      if (index > 0 && index < rows.length-1) {
        const x = elem.getElementsByTagName("TD")[n];
        const y = rows[index + 1].getElementsByTagName("TD")[n];
        if (type === "number" && this.sortElement.classList.contains("ascending") && Number(x.textContent) > Number(y.textContent)) {
          elem.parentNode.insertBefore(rows[index + 1], elem);
          sorting = true;
        } else if (type === "number" && this.sortElement.classList.contains("descending") && Number(x.textContent) < Number(y.textContent)) {
          elem.parentNode.insertBefore(rows[index + 1], elem);
          sorting = true;
        } else if (type === "string" && this.sortElement.classList.contains("descending") && x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
          elem.parentNode.insertBefore(rows[index + 1], elem);
          sorting = true;
        } else if (type === "string" && this.sortElement.classList.contains("descending") && x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
          elem.parentNode.insertBefore(rows[index + 1], elem);
          sorting = true;
        }
      }
    });
    if (sorting) this.sortTable(n, type);
  }

  getDifficultWords() {
    this.funcName = "getDificultWords"
    const array = [];
    cards.forEach( (category, index) => {
      if (index > 0) {
        category.forEach(word => {
          const item = JSON.parse(localStorage.getItem(word.word));
          const percent = item.correct > 0 ? Math.floor(item.incorrect * 100 / item.correct) : 0;
          if (percent > 25) array.push({
            "element": word,
            "percent": percent
          });
        });
      }
    });
    array.sort((a,b) => b.percent-a.percent);
    this.difficultWords = array.slice(0, 8).map(element => {return element.element});
    return this.difficultWords;
  }

  getItem(word) {
    this.item = JSON.parse(localStorage.getItem(word));
  }

  getTrained() {
    return this.item ? this.item.trained : 0;
  }

  getCorrect() {
    return this.item ? this.item.correct : 0;
  }

  getIncorrect() {
    return this.item ? this.item.incorrect : 0;
  }

  getPercent() {
    return this.item && this.item.correct > 0 ? Math.floor(this.item.incorrect * 100 / this.item.correct) : 0;
  }

  render() {
    const headerElements = ["Category", "Word", "Translation", "Trained", "Correct", "Incorrect", "%"];

    while (this.appBlock.firstChild) {
      this.appBlock.removeChild(this.appBlock.firstChild);
    }

    const buttons = document.createElement("div");
    buttons.classList.add("stats-buttons");
    const reset = document.createElement("button");
    reset.classList.add("stats-buttons__reset");
    reset.textContent = "Reset";
    reset.onclick = () => {
      localStorage.clear();
      checkLocalStorage(cards);
      this.render();
    };
    buttons.append(...[this.repeatButton, reset]);

    const div = document.createElement("div");
    div.classList.add("table-block");
    this.table = document.createElement("table");

    const thead = document.createElement("thead");
    const tr = document.createElement("tr");
    headerElements.forEach((element, index) => {
      const th = document.createElement("th");
      th.setAttribute("scope", "col");
      th.textContent = element;
      th.onclick = () => {
        this.switchSortClasses(th);
        if (index > 2) this.sortTable(index, "number");
        else this.sortTable(index, "string")
      };
      tr.append(th);
    });
    thead.append(tr);
    this.table.append(thead);

    const tbody = document.createElement("tbody");
    cards[0].forEach( (title, index) => {
      cards[index+1].forEach( word => {
        const row = document.createElement("tr");
        const categoryColumn = document.createElement("td");
        categoryColumn.textContent = title;
        row.append(categoryColumn);
        const wordColumn = document.createElement("td");
        wordColumn.textContent = word.word;
        row.append(wordColumn);
        const translationColumn = document.createElement("td");
        translationColumn.textContent = word.translation;
        row.append(translationColumn);
        this.getItem(word.word)
        const trainedColumn = document.createElement("td");
        trainedColumn.textContent = this.getTrained();
        row.append(trainedColumn);
        const correctColumn = document.createElement("td");
        correctColumn.textContent = this.getCorrect();
        row.append(correctColumn);
        const incorrectColumn = document.createElement("td");
        incorrectColumn.textContent = this.getIncorrect();
        row.append(incorrectColumn);
        const percentColumn = document.createElement("td");
        percentColumn.textContent = this.getPercent();
        row.append(percentColumn);
        tbody.append(row);
      });
    });
    this.table.append(tbody);
    div.append(this.table);
    this.appBlock.append(buttons);
    this.appBlock.append(div);
  }
}

export default Stats;
