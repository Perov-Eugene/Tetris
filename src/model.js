export default class Game {
  points = {
    1: 40,
    2: 100,
    3: 300,
    4: 1200,
  };
  constructor() {
    this.reset();
  }
  get level() {
    return Math.floor(this.lines * 0.1);
  }

  //для получения текущего состояния игры

  getState() {
    const playField = this.createPlayField();
    const { y: pieceY, x: pieceX, blocks } = this.activePiece;
    for (let y = 0; y < this.playField.length; y++) {
      playField[y] = [];
      for (let x = 0; x < this.playField[y].length; x++) {
        playField[y][x] = this.playField[y][x];
      }
    }
    for (let y = 0; y < blocks.length; y++) {
      for (let x = 0; x < blocks[y].length; x++) {
        if (blocks[y][x]) {
          playField[pieceY + y][pieceX + x] = blocks[y][x];
        }
      }
    }

    return {
      score: this.score, //счет игрока
      level: this.level, //уровень игры
      lines: this.lines,
      nextPiece: this.nextPiece, //следующая фигура, которая появится на игровом поле
      playField, //количество заполненных линий игроком
      isGameOver: this.topOut, //флаг, показывающий, закончилась ли игра (true, если игрок проиграл, false в противном случае)
    };
  }
  ///////////////////////////////////////////////////////////

  //для сброса игрового поля и начала новой игры
  reset() {
    this.score = 0;
    this.lines = 0;
    this.topOut = false;
    this.playField = this.createPlayField();
    this.activePiece = this.createPiece();
    this.nextPiece = this.createPiece();
  }
  //////////////////////////////////////////////////////////////

  //создаем игровое поле 20х10
  createPlayField() {
    const playField = [];
    for (let y = 0; y < 20; y++) {
      playField[y] = [];
      for (let x = 0; x < 10; x++) {
        playField[y][x] = 0;
      }
    }
    return playField;
  }
  ///////////////////////////////////////////////

  //для создания новой фигуры в игре в виде объекта piece
  createPiece() {
    const index = Math.floor(Math.random() * 7);
    const type = "IJLOSTZ"[index];
    const piece = {};

    switch (type) {
      case "I":
        piece.blocks = [
          [0, 0, 0, 0],
          [1, 1, 1, 1],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
        ];
        break;
      case "J":
        piece.blocks = [
          [0, 0, 0],
          [2, 2, 2],
          [0, 0, 2],
        ];
        break;
      case "L":
        piece.blocks = [
          [0, 0, 0],
          [3, 3, 3],
          [3, 0, 0],
        ];
        break;
      case "O":
        piece.blocks = [
          [0, 0, 0, 0],
          [0, 4, 4, 0],
          [0, 4, 4, 0],
          [0, 0, 0, 0],
        ];
        break;
      case "S":
        piece.blocks = [
          [0, 0, 0],
          [0, 5, 5],
          [5, 5, 0],
        ];
        break;
      case "T":
        piece.blocks = [
          [0, 0, 0],
          [6, 6, 6],
          [0, 6, 0],
        ];
        break;
      case "Z":
        piece.blocks = [
          [0, 0, 0],
          [7, 7, 0],
          [0, 7, 7],
        ];
        break;
      default:
        throw new Error("Неизвестный тип фигуры");
    }
    piece.x = Math.floor((10 - piece.blocks[0].length) / 2);
    piece.y = -1;
    return piece;
  }
  ///////////////////////////////////////////////////////////

  //для управления фигурами влево, вправо, вниз
  movePieceLeft() {
    this.activePiece.x -= 1;
    if (this.hasColision()) this.activePiece.x += 1;
  }
  movePieceRight() {
    this.activePiece.x += 1;
    if (this.hasColision()) this.activePiece.x -= 1;
  }
  movePieceDown() {
    if (this.topOut) return;
    this.activePiece.y += 1;
    if (this.hasColision()) {
      this.activePiece.y -= 1;
      this.lockPiece();
      const clearedLines = this.clearLines();
      this.updateScore(clearedLines);
      this.updatePieces();
    }
    if (this.hasColision()) {
      this.topOut = true;
    }
  }
  /////////////////////////////////////////////////

  //для поворота фигуры
  rotatePiece() {
    const blocks = this.activePiece.blocks;
    const length = blocks.length;

    const temp = [];
    for (let i = 0; i < length; i++) {
      temp[i] = new Array(length).fill(0);
    }
    for (let y = 0; y < length; y++) {
      for (let x = 0; x < length; x++) {
        temp[x][y] = blocks[length - 1 - y][x];
      }
    }
    this.activePiece.blocks = temp;
    if (this.hasColision()) {
      this.activePiece.blocks = blocks;
    }
  }
  ///////////////////////////////////////////////////

  //для проверки не вышла ли фигура за пределы поля
  hasColision() {
    const { y: pieceY, x: pieceX, blocks } = this.activePiece;
    for (let y = 0; y < blocks.length; y++) {
      for (let x = 0; x < blocks[y].length; x++) {
        if (
          blocks[y][x] &&
          (this.playField[pieceY + y] === undefined ||
            this.playField[pieceY + y][pieceX + x] === undefined ||
            this.playField[pieceY + y][pieceX + x])
        ) {
          return true;
        }
      }
    }
    return false;
  }
  ////////////////////////////////////////////////////

  //для переноса фигуры на игровое поле
  lockPiece() {
    const { y: pieceY, x: pieceX, blocks } = this.activePiece;
    for (let y = 0; y < blocks.length; y++) {
      for (let x = 0; x < blocks[y].length; x++) {
        if (blocks[y][x]) {
          this.playField[pieceY + y][pieceX + x] = blocks[y][x];
        }
      }
    }
  }
  /////////////////////////////////////////////////////

  //для удаления заполненных линий на игровом поле
  clearLines() {
    const rows = 20;
    const columns = 10;
    let lines = [];

    for (let y = rows - 1; y >= 0; y--) {
      let numberOfBlocks = 0;
      for (let x = 0; x < columns; x++) {
        if (this.playField[y][x]) {
          numberOfBlocks += 1;
        }
      }

      if (numberOfBlocks === 0) {
        break;
      } else if (numberOfBlocks < columns) {
        continue;
      } else if (numberOfBlocks === columns) {
        lines.unshift(y);
      }
    }
    for (let index of lines) {
      this.playField.splice(index, 1);
      this.playField.unshift(new Array(columns).fill(0));
    }
    return lines.length;
  }
  //////////////////////////////////////////////////////////

  //для обновления счета игрока и количества заполненных линий
  updateScore(clearedLines) {
    if (clearedLines > 0) {
      this.score += game.points[clearedLines] * (this.level + 1);
      this.lines += clearedLines;
    }
  }
  ////////////////////////////////////////////////////////////

  //для обновления активной фигуры и следующей фигуры.
  updatePieces() {
    this.activePiece = this.nextPiece;
    this.nextPiece = this.createPiece();
  }
  /////////////////////////////////////////////////////////////
}
