class Categories {
  constructor(appBlock, categories, images) {
    this.appBlock = appBlock;
    this.categories = categories;
    this.images = images;
    this.elements = [];
  }

  init() {
    this.categories.forEach((element, index) => {
      const div = document.createElement("div");
      const a = document.createElement("a");
      const imgDiv = document.createElement("div");
      const img = document.createElement("img");
      const title = document.createElement("div");
      title.textContent = element;
      imgDiv.classList.add("category-card__image");
      img.src = `./${this.images[index]}`;
      img.setAttribute("alt", element);
      div.classList.add("category-card");
      title.classList.add("category-card__title")
      a.href = `#${element}`;
      imgDiv.append(img);
      a.append(imgDiv);
      a.append(title);
      div.append(a);
      this.elements.push(div);
    });
  }

  render() {
    while (this.appBlock.firstChild) {
      this.appBlock.removeChild(this.appBlock.firstChild);
    }
    this.elements.forEach(val => this.appBlock.append(val));
  }
}

export default Categories;
