/*
Week 5 — Example 4: Data-driven world with JSON + Smooth Camera

Course: GBDA302 | Instructors: Dr. Karen Cochrane & David Han
Date: Feb. 12, 2026

Move: WASD/Arrows

Learning goals:
- Extend the JSON-driven world to include camera parameters
- Implement smooth camera follow using interpolation (lerp)
- Separate camera behavior from player/world logic
- Tune motion and feel using external data instead of hard-coded values
- Maintain player visibility with soft camera clamping
- Explore how small math changes affect “game feel”
*/

const VIEW_W = 500;
const VIEW_H = 450;

let worldData;
let level;
let player;
let bgImage;
let playerSprites = {};

let camX = 0;
let camY = 0;

function preload() {
  worldData = loadJSON("world.json"); // load JSON before setup [web:122]
  bgImage = loadImage("Assets/backgrund.png"); // load background image
  
  // Load player sprites
  playerSprites.rest = loadImage("Assets/gorest.png");
  playerSprites.right = loadImage("Assets/goright.png");
  playerSprites.left = loadImage("Assets/goleft.png");
  playerSprites.up = loadImage("Assets/goup.png");
  playerSprites.down = loadImage("Assets/gostraight.png");
}

function setup() {
  createCanvas(VIEW_W, VIEW_H);
  textFont("sans-serif");
  textSize(14);

  level = new WorldLevel(worldData, bgImage);

  // Start player in middle of the map
  const start = worldData.playerStart ?? { x: level.w / 2, y: level.h / 2, speed: 3 };
  player = new Player(start.x, start.y, start.speed, playerSprites);

  camX = player.x - width / 2;
  camY = player.y - height / 2;
}

function draw() {
  player.updateInput();

  // Keep player inside world
  player.x = constrain(player.x, 0, level.w);
  player.y = constrain(player.y, 0, level.h);

  // Target camera (center on player)
  let targetX = player.x - width / 2;
  let targetY = player.y - height / 2;

  // Clamp target camera safely
  const maxCamX = max(0, level.w - width);
  const maxCamY = max(0, level.h - height);
  targetX = constrain(targetX, 0, maxCamX);
  targetY = constrain(targetY, 0, maxCamY);

  // Smooth follow using the JSON knob
  const camLerp = level.camLerp; // ← data-driven now
  camX = lerp(camX, targetX, camLerp);
  camY = lerp(camY, targetY, camLerp);

  push();
  translate(-camX, -camY);
  level.drawWorld();
  player.draw();
  pop();

  level.drawHUD(player, camX, camY);
}

function keyPressed() {
  if (key === "r" || key === "R") {
    const start = worldData.playerStart ?? { x: level.w / 2, y: level.h / 2, speed: 3 };
    player = new Player(start.x, start.y, start.speed, playerSprites);
  }
}
