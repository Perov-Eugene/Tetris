import Game from "./src/model.js";
import View from "./src/view.js";
import Controller from "./src/controller.js";

const root = document.querySelector("#root");
const game = new Game();
const view = new View(root, 650, 650, 20, 10);
const controller = new Controller(game, view);

window.game = game;
window.view = view;
window.controller = controller;
