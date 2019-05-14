const element = document.getElementsByClassName('items')[0];
let offset = 3;
// const hammertime = Hammer(element).on('swipe', () => {
//   swipeGif();
// })

async function swipeGif() {
  const data = await getGifs(1, offset);
  const imageUrl = data[0].images.fixed_height.url;
  element.children[element.children.length - 1].remove();
  element.insertAdjacentHTML("afterbegin", template(imageUrl));

  const card = document.querySelectorAll(".card")[0];
  const elementHammer = new Hammer(card);
  elementHammer.on("pan", (event) => {
    const xMulti = event.deltaX * 0.2;
    if (event.deltaX < 100 && event.deltaX > -100) {
      card.style.transform = 'translate(' + event.deltaX + 'px, ' + 0 + 'px) rotate(' + xMulti + 'deg)';
    }
  });

  elementHammer.on("panend", event => {
    const xMulti = event.deltaX * 0.2;
    if (event.deltaX > 90 || event.deltaX < -90) {
      var moveOutWidth = document.body.clientWidth;
      var endX = Math.max(Math.abs(event.velocityX) * moveOutWidth, moveOutWidth);
      var toX = event.deltaX > 0 ? endX : -endX;
      var endY = Math.abs(event.velocityY) * moveOutWidth;
      var toY = event.deltaY > 0 ? endY : -endY;
      card.style.transform = 'translate(' + toX + 'px, ' + (toY + event.deltaY) + 'px) rotate(' + xMulti + 'deg)';
      console.log("Manda ver")
      swipeGif()
    } else {
      card.style.transform = 'translate(0px, 0px) rotate(0deg)';
      console.log("volta")
    }
  });

  offset++;
}

async function getGifs(limit, offset) {
  const url = `https://api.giphy.com/v1/gifs/trending?&api_key=3Y58rC1smDMY1cLt6dNyVLpZCSS12Mfv&limit=${limit}&offset=${offset}`;
  return fetch(url).then(response => response.json())
    .then(json => json.data)
    .catch(error => error);
}

async function initialize() {
  const data = await getGifs(3, 0);
  data.forEach(item => {
    const imageUrl = item.images.fixed_height.url;
    element.innerHTML += template(imageUrl);
  });
  const cards = document.querySelectorAll(".card");
  console.log(cards)
  cards.forEach(element => {
    const elementHammer = new Hammer(element);
    elementHammer.on("pan", (event) => {
      const xMulti = event.deltaX * 0.2;
      if (event.deltaX < 100 && event.deltaX > -100) {
        element.style.transform = 'translate(' + event.deltaX + 'px, ' + 0 + 'px) rotate(' + xMulti + 'deg)';
      }
    });

    elementHammer.on("panend", event => {
      const xMulti = event.deltaX * 0.2;
      if (event.deltaX > 90 || event.deltaX < -90) {
        var moveOutWidth = document.body.clientWidth;
        var endX = Math.max(Math.abs(event.velocityX) * moveOutWidth, moveOutWidth);
        var toX = event.deltaX > 0 ? endX : -endX;
        var endY = Math.abs(event.velocityY) * moveOutWidth;
        var toY = event.deltaY > 0 ? endY : -endY;
        element.style.transform = 'translate(' + toX + 'px, ' + (toY + event.deltaY) + 'px) rotate(' + xMulti + 'deg)';
        console.log("Manda ver")
        swipeGif()
      } else {
        element.style.transform = 'translate(0px, 0px) rotate(0deg)';
        console.log("volta")
      }
    });
  })
}
function template(url) {
  return `
    <div class="card">
      <img src="${url}">
    </div>
  `;
}
initialize();