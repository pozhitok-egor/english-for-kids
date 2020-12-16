export default function checkLocalStorage(cards) {
  cards.forEach((elem, index) => {
    if (index > 0) {
      elem.forEach( word => {
        let data = JSON.parse(localStorage.getItem(word.word));
        if (!data) {
          data = {
            trained: 0,
            correct: 0,
            incorrect: 0
          }
        }
        localStorage.setItem( word.word, JSON.stringify(data) );
      });
    }
  });
}
