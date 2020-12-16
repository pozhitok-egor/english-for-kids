import cards from './cards-data';

export default function renderBurger(burgerUl) {
  const arr = [];
  if (!(burgerUl.querySelectorAll('li').length >= cards.length)) {
    burgerUl.querySelectorAll('li').forEach(element => {
      element.remove();
    });;
    const main = document.createElement("li");
    const mainLink = document.createElement("a");
    mainLink.textContent = "Main Page";
    mainLink.href = "#";
    main.append(mainLink);
    burgerUl.append(main);
    arr.push(main);
    cards[0].forEach(elem => {
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.textContent = elem;
      a.href = `#${elem}`;
      li.append(a);
      burgerUl.append(li);
      arr.push(li);
    });
    const stats = document.createElement("li");
    const statsLink = document.createElement("a");
    statsLink.textContent = "Stats";
    statsLink.href = "#stats";
    stats.append(statsLink);
    burgerUl.append(stats);
    arr.push(stats);
  }
  return arr;
};
