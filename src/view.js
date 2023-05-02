export default class View {
  colors = {
    1: "cyan",
    2: "blue",
    3: "orange",
    4: "yellow",
    5: "green",
    6: "purple",
    7: "red",
  };

  //для создания объекта, представляющего игровое поле и панель для игры
  constructor(element, width, height, rows, columns) {
    this.element = element;
    this.width = width;
    this.height = height;

    this.canvas = document.createElement("canvas");
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.context = this.canvas.getContext("2d");

    this.playFieldBorderWidth = 4;
    this.playFieldX = this.playFieldBorderWidth;
    this.playFieldY = this.playFieldBorderWidth;
    this.playFieldWidth = (this.width * 2) / 3;
    this.playFieldHeight = this.height;
    this.playFieldInnerWidth =
      this.playFieldWidth - this.playFieldBorderWidth * 2;
    this.playFieldInnerHeight =
      this.playFieldHeight - this.playFieldBorderWidth * 2;

    this.blockWidth = this.playFieldInnerWidth / columns;
    this.blockHeight = this.playFieldInnerHeight / rows;

    this.panelX = this.playFieldWidth + 10;
    this.panelY = 0;
    this.panelWidth = this.width / 2;
    this.panelHeight = this.height;
    1;
    // создаем элемент <div>
    this.div = document.createElement("div");
    this.div.textContent = "Press enter to start";
    this.div.id = "start-message";
    this.element.appendChild(this.div);
    this.element.appendChild(this.canvas);
  }
  //////////////////////////////////////////////////////////////////////////

  //принимает объект state, для отрисовки игрового экрана в браузере
  renderMainScreen(state) {
    this.clearScreen();
    this.renderPlayField(state);
    this.renderPanel(state);
  }
  ////////////////////////////////////////////////////////////////////

  //для отображения стартового экрана в игре

  renderStartScreen() {
    document.addEventListener("keydown", function (event) {
      if (event.code === "Enter") {
        var startMessage = document.getElementById("start-message");
        startMessage.addEventListener("animationend", function () {
          startMessage.style.display = "none";
        });
        startMessage.id = "explosion";
      }
    });
  }
  ////////////////////////////////////////////////////////////////////

  //для отображения экрана при паузе
  renderPauseScreen() {
    this.context.fillStyle = "rgba(0,0,0,0.75)";
    this.context.fillRect(0, 0, this.width, this.height);
    this.context.fillStyle = "white";
    this.context.font = '3em "Anton", sans-serif';
    this.context.letterSpacing = "2px";
    this.context.textAlign = "center";
    this.context.textBaseline = "middle";
    this.context.fillText(
      "Press enter to resume",
      this.width / 2,
      this.height / 2
    );
  }
  ///////////////////////////////////////////

  //для отображения экрана при пройгрыше
  renderEndScreen({ score }) {
    this.clearScreen();
    this.context.fillStyle = "rgb(205, 129, 119)";
    this.context.font = '3em "Anton", sans-serif';
    this.context.letterSpacing = "2px";
    this.context.textAlign = "center";
    this.context.textBaseline = "middle";
    this.context.fillText("Game over", this.width / 2, this.height / 2 - 48);
    this.context.fillText(`Score ${score}`, this.width / 2, this.height / 2);
    this.context.fillText(
      "Press enter to restart",
      this.width / 2,
      this.height / 2 + 48
    );
  }
  ///////////////////////////////////////////////

  //для очистки экрана
  clearScreen() {
    this.context.clearRect(0, 0, this.width, this.height);
  }
  //////////////////////////////////////////////////////

  //для отрисовки игрового поля
  renderPlayField({ playField }) {
    for (let y = 0; y < playField.length; y++) {
      const line = playField[y];
      for (let x = 0; x < line.length; x++) {
        const block = line[x];
        if (block) {
          this.renderBlock(
            this.playFieldX + x * this.blockWidth,
            this.playFieldY + y * this.blockHeight,
            this.blockWidth,
            this.blockHeight,
            view.colors[block]
          );
        }
      }
    }

    this.context.strokeRect(0, 0, this.playFieldWidth, this.playFieldHeight);
  }
  //////////////////////////////////////////////////////////////

  //для отрисовки игровой панели в игре
  renderPanel({ level, score, lines, nextPiece, color }) {
    this.context.textAlign = "start";
    this.context.textBaseline = "top";
    this.context.fillStyle = "rgb(63, 54, 37)";

    this.context.font = '1.3em "Anton", sans-serif';

    this.context.fillText(`level ${level}`, this.panelX, this.panelY + 15);
    this.context.fillText(`score ${score}`, this.panelX, this.panelY + 47);
    this.context.fillText(`lines ${lines}`, this.panelX, this.panelY + 80);
    this.context.fillText("next", this.panelX, this.panelY + 170);

    for (let y = 0; y < nextPiece.blocks.length; y++) {
      for (let x = 0; x < nextPiece.blocks[y].length; x++) {
        const block = nextPiece.blocks[y][x];
        if (block) {
          this.renderBlock(
            this.panelX + x * this.blockWidth * 0.5,
            this.panelY + 100 + y * this.blockHeight * 0.5,
            this.blockWidth * 0.5,
            this.blockHeight * 0.5,
            view.colors[block]
          );
        }
      }
    }
  }
  //////////////////////////////////////////////////////////////////

  //для отрисовки отдельного блока на игровом поле или на игровой панели
  renderBlock(x, y, width, height, color) {
    this.context.fillStyle = color;
    this.context.strokeStyle = "black";
    this.context.lineWidth = 2.5;

    this.context.fillRect(x, y, width, height);
    this.context.strokeRect(x, y, width, height);
  }
  /////////////////////////////////////////////////////////////////////////

  //для различных анимаций
  renderAnimate() {
    //анимации с gsap
    const myDiv = document.getElementById("myDiv");

    gsap.to(myDiv, {
      duration: 1, // длительность анимации в секундах
      rotation: 360, // поворот элемента на 360 градусов
    });

    const spans = document.querySelectorAll("#myDiv span"); // выбираем все span элементы внутри h1 элемента

    gsap.to(spans, {
      duration: 3,
      color: [
        //список цветов которые будут использоваться в анимации
        "rgb(194, 28, 28)",
        "rgb(190, 126, 6)",
        "rgb(222, 222, 22)",
        "rgb(3, 157, 3)",
        "rgb(31, 230, 230)",
        "rgb(127, 13, 127)",
      ],
      ease: "none",
      stagger: 0.3,
      yoyo: true, // изменяет цвета элементов в обратном порядке после завершения анимации
      repeat: 1, // повторяет анимацию дважды, чтобы вернуть цвета к исходным
    });

    const canvas = document.createElement("canvas");

    const context = canvas.getContext("2d");

    const background = document.querySelector("#background");
    background.appendChild(canvas);

    let blocks = [
      {
        x: Math.random() * 290,
        y: Math.random() * 140,
        width: 15,
        height: 15,
        color: "red",
        dx: 0.5,
        dy: 0.5,
      },
      {
        x: Math.random() * 290,
        y: Math.random() * 140,
        width: 15,
        height: 15,
        color: "blue",
        dx: 0.5,
        dy: 0.5,
      },
      {
        x: Math.random() * 290,
        y: Math.random() * 140,
        width: 15,
        height: 15,
        color: "green",
        dx: 0.5,
        dy: 0.5,
      },
    ];

    function drawBlock(block) {
      context.fillStyle = block.color;
      context.fillRect(block.x, block.y, block.width, block.height);
    }

    function updateBlock(block) {
      if (block.x > 290 || block.x < 0) {
        block.dx = -block.dx;
      }

      if (block.y > 140 || block.y < 0) {
        block.dy = -block.dy;
      }
      block.x += block.dx;
      block.y += block.dy;
    }

    function animate() {
      requestAnimationFrame(animate);

      context.clearRect(0, 0, window.innerWidth, window.innerHeight);

      for (let i = 0; i < blocks.length; i++) {
        drawBlock(blocks[i]);
        updateBlock(blocks[i]);
      }
    }

    animate();
  }
}
///////////////////////////////////////////////////////////////////////////////////
