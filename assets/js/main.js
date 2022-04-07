let isContinue = false;
const SESSION_NAME = "tresenraya";

// POSIBILIDADES DE GANAR
const posibleWinner = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

/*
 * PROPS gameArray
 * player: "bot" | "human" | ""
 */

const gameArray = [
  { player: "", index: 0 },
  { player: "", index: 1 },
  { player: "", index: 2 },
  { player: "", index: 3 },
  { player: "", index: 4 },
  { player: "", index: 5 },
  { player: "", index: 6 },
  { player: "", index: 7 },
  { player: "", index: 8 },
];

window.addEventListener("load", () => {
  renderItems(gameArray);
  const txt_name = document.getElementById("txt_name");
  txt_name.value = getPlayerName() ?? "";
});

const btn_play = document.getElementById("play");
btn_play.addEventListener("click", () => {
  const txt_name = document.getElementById("txt_name");

  const val = btn_play.innerText === "JUGAR!";

  if (val) {
    if (txt_name.value) {
      if (!txt_name.value) return null;

      isContinue = true;
      localStorage.setItem(SESSION_NAME, txt_name.value);
      btn_play.innerText = val ? "VOLVER A JUGAR" : "JUGAR!";
    } else {
      confirm("Tienes que ingresar tu nombre antes de continuar.");
    }
  } else {
    localStorage.removeItem(SESSION_NAME);
    window.location.reload();
  }
});

const clickHuman = async (index) => {
  if (!isContinue)
    return confirm("Primero debes ingresar su nombre e iniciar el juego para continuar.");

  if (!gameArray[index].player && isOpenModal()) {
    gameArray[index].player = "human";
    renderItems(gameArray);
    findWinner("human");
    await clickBot();
  }
};

const clickBot = async () => {
  await wait(1000);

  const filtered = gameArray.filter((item) => !item.player);

  let itemRandom = null;
  let status = true;

  while (!Boolean(itemRandom)) {
    const random = Math.floor(Math.random() * 9);
    itemRandom = filtered[random];
    if (filtered.length === 0) {
      status = false;
      break;
    }
  }

  if (status) {
    const indexFind = gameArray.findIndex((item) => item.index === itemRandom.index);

    gameArray[indexFind].player = "bot";

    renderItems(gameArray);
    await findWinner("bot");
  }
};

const findWinner = async (item) => {
  await wait(500);
  const filterWin = gameArray
    .filter((i) => i.player === item)
    .map((i) => i.index)
    .sort((a, b) => (a > b ? 1 : -1));

  posibleWinner.forEach((posible) => {
    let counter = 0;

    posible.forEach((test) => {
      const finder = filterWin.find((i) => i === test);
      if (typeof finder === "number") counter++;
    });

    if (counter >= 3) return renderMessage(item);
  });
};

const renderItems = (items) => {
  const container = document.querySelector(".game__container");
  container.innerHTML = "";
  items.forEach((item, index) => {
    const { player } = item;
    container.innerHTML += `
      <div class="game__container--item" onclick={clickHuman(${index})}>
        ${
          Boolean(player)
            ? `<img src="./assets/images/${player === "bot" ? "black" : "red"}.png" />`
            : ``
        }
      </div>
    `;
  });
};

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const renderMessage = (winner) => {
  const modal = document.querySelector(".modal");
  modal.classList.remove("hidden");
  modal.innerHTML = `
    <div class="modal__container">
      <h1>${winner === "bot" ? `¡Oh no! ${getPlayerName()}` : `Felicidades ${getPlayerName()}`}</h1>
      <h2>${winner === "bot" ? "¡Perdiste el juego!" : "¡Ganaste el juego!"}</h2>
    </div>
  `;
};

const getPlayerName = () => localStorage.getItem(SESSION_NAME);

const isOpenModal = () => {
  const modal = document.querySelector(".modal");
  return modal.classList.contains("hidden");
};
