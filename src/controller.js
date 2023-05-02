export default class Controller {
  constructor(game, view) {
    // Инициализация объекта игры
    this.game = game;
    this.view = view;

    // Идентификатор интервала
    this.intervalId = null;
    this.isPlaying = false;

    // Добавление обработчиков событий клавиатуры
    document.addEventListener("keydown", this.handleKeyDown.bind(this));
    document.addEventListener("keyup", this.handleKeyUp.bind(this));

    // Отрисовка начального экрана и анимации
    this.view.renderStartScreen();
    this.view.renderAnimate();
  }

  // Обновление состояния игры и отображения
  update() {
    this.game.movePieceDown();
    this.updateView();
  }

  // Запуск игры
  play() {
    this.isPlaying = true;
    this.startTimer();
    this.updateView();
  }

  // Пауза игры
  pause() {
    this.isPlaying = false;
    this.stopTimer();
    this.updateView();
  }

  // Сброс игры
  reset() {
    this.game.reset();
    this.play();
  }

  // Обновление отображения в зависимости от состояния игры
  updateView() {
    const state = this.game.getState();
    if (state.isGameOver) {
      this.view.renderEndScreen(state);
    } else if (!this.isPlaying) {
      this.view.renderPauseScreen();
    } else {
      this.view.renderMainScreen(this.game.getState());
    }
  }

  // Запуск таймера
  startTimer() {
    const speed = 500 - this.game.getState().level * 50;
    if (!this.intervalId) {
      this.intervalId = setInterval(
        () => {
          this.update();
        },
        speed > 0 ? speed : 50
      );
    }
  }

  // Остановка таймера
  stopTimer() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  // Обработчик события нажатия клавиши
  handleKeyDown(event) {
    // Получаем текущее состояние игры
    const state = this.game.getState();

    // Обрабатываем нажатие клавиш
    switch (event.keyCode) {
      // Если нажата клавиша Enter
      case 13:
        // Если игра окончена, перезапускаем её
        if (state.isGameOver) {
          this.reset();
          // Если игра идёт, останавливаем её
        } else if (this.isPlaying) {
          this.pause();
          // Если игра не идёт, запускаем её
        } else {
          this.play();
        }
        break;
      // Если нажата клавиша влево
      case 37:
        // Если игра идёт, передвигаем фигуру влево и обновляем вид
        if (this.isPlaying) {
          this.game.movePieceLeft();
          this.updateView();
        }
        break;
      // Если нажата клавиша вверх
      case 38:
        // Если игра идёт, поворачиваем фигуру и обновляем вид
        if (this.isPlaying) {
          this.game.rotatePiece();
          this.updateView();
        }
        break;
      // Если нажата клавиша вправо
      case 39:
        // Если игра идёт, передвигаем фигуру вправо и обновляем вид
        if (this.isPlaying) {
          this.game.movePieceRight();
          this.updateView();
        }
        break;
      // Если нажата клавиша вниз
      case 40:
        // Если игра идёт, останавливаем таймер, опускаем фигуру вниз и обновляем вид
        if (this.isPlaying) {
          this.stopTimer();
          this.game.movePieceDown();
          this.updateView();
        }
        break;
    }
  }

  // Обработчик события отпускания клавиши
  handleKeyUp() {
    // Если игра идёт
    if (this.isPlaying) {
      // Обрабатываем отпускание клавиши
      switch (event.keyCode) {
        // Если отпущена клавиша вниз, запускаем таймер
        case 40:
          this.startTimer();
          break;
      }
    }
  }
}
