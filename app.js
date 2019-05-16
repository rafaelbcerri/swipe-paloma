const element = document.getElementsByClassName('items')[0];
let offset = 3;

async function initialize() {
  const gifsData = await getGifs();

  gifsData.forEach(item => {
    const imageUrl = item.images.fixed_height.url;
    element.insertAdjacentHTML("afterbegin", template(imageUrl));
  });

  const cards = document.querySelectorAll(".card");
  cards.forEach(element => addHammerToElement(element))
}

function addHammerToElement(element) {
  const elementHammer = new Hammer(element);
  elementHammer.on("pan", (event) => {
    const xMovement = event.deltaX;
    const rotationDeg = xMovement * 0.2;

    renderAnimation(element, xMovement, 0, rotationDeg);
  });

  elementHammer.on("panend", event => {
    const xMovement = event.deltaX;
    if (xMovement > 80 || xMovement < -80) {
      const { xPosition, yPosition} = getCoordsFromEvent(event)
      const rotationDeg = xMovement * 0.2;

      renderAnimation(element, xPosition, yPosition, rotationDeg);
      handleGifSwipe();
    } else {
      renderAnimation(element, 0, 0, 0);
    }
  });
}

function getCoordsFromEvent(event) {
  const moveOutWidth = document.body.clientWidth;
  const endX = Math.max(Math.abs(event.velocityX) * moveOutWidth, moveOutWidth);
  const toX = event.deltaX > 0 ? endX : -endX;
  const endY = Math.abs(event.velocityY) * moveOutWidth;
  const toY = event.deltaY > 0 ? endY : -endY;
  return {
    xPosition: toX,
    yPosition: toY + event.deltaY
  }
}

function renderAnimation(element, xPosition, yPosition, degrees) {
  element.style.transform = `
    translate(${xPosition}px, ${yPosition}px)
    rotate(${degrees}deg)
  `;
}

function getGifs(limit=3, offset=0) {
  const url = `https://api.giphy.com/v1/gifs/trending?&api_key=3Y58rC1smDMY1cLt6dNyVLpZCSS12Mfv&limit=${limit}&offset=${offset}`;

  return fetch(url).then(response => response.json())
    .then(json => json.data)
    .catch(error => error);
}


async function handleGifSwipe() {
  const data = await getGifs(1, offset++);
  const imageUrl = data[0].images.fixed_height.url;
  element.children[element.children.length - 1].remove();
  element.insertAdjacentHTML("afterbegin", template(imageUrl));

  const card = document.querySelectorAll(".card")[0];
  addHammerToElement(card)
}

function template(url) {
  return `
    <div class="card">
      <img src="${url}">
    </div>
  `;
}

initialize();