class Player {
  constructor(x, y, speed, sprites) {
    this.x = x;
    this.y = y;
    this.s = speed ?? 3;
    this.sprites = sprites;
    this.currentSprite = "rest";
    this.spriteSize = 70;
  }

  updateInput() {
    const dx =
      (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) -
      (keyIsDown(LEFT_ARROW) || keyIsDown(65));

    const dy =
      (keyIsDown(DOWN_ARROW) || keyIsDown(83)) -
      (keyIsDown(UP_ARROW) || keyIsDown(87));

    // Update sprite based on direction
    if (dx > 0) {
      this.currentSprite = "right";
    } else if (dx < 0) {
      this.currentSprite = "left";
    } else if (dy > 0) {
      this.currentSprite = "down";
    } else if (dy < 0) {
      this.currentSprite = "up";
    } else {
      this.currentSprite = "rest";
    }

    // Apply speed boost when shift is held
    const speedMultiplier = keyIsDown(SHIFT) ? 1.5 : 1;
    const currentSpeed = this.s * speedMultiplier;

    const len = max(1, abs(dx) + abs(dy));
    this.x += (dx / len) * currentSpeed;
    this.y += (dy / len) * currentSpeed;
  }

  draw() {
    // Draw sprite centered at (this.x, this.y)
    const sprite = this.sprites[this.currentSprite];
    if (sprite) {
      image(
        sprite,
        this.x - this.spriteSize / 2,
        this.y - this.spriteSize / 2,
        this.spriteSize,
        this.spriteSize,
      );
    }
  }
}
