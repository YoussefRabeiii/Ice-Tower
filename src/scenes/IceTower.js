import Phaser from "phaser";

import ScoreLabel from "../ui/ScoreLabel";

class IceTower extends Phaser.Scene {
  constructor() {
    super("game-scene");

    this.player = undefined;
    this.cursors = undefined;
    this.scoreLabel = undefined;
  }

  preload() {
    this.load.image("sky", "assets/sky.png");
    this.load.image("space", "assets/space.jpg");
    this.load.image("ground", "assets/platform.png");
    this.load.image("star", "assets/star.png");
    this.load.image("bomb", "assets/bomb.png");

    this.load.spritesheet("dude", "assets/dude.png", {
      frameWidth: 32,
      frameHeight: 48,
    });
  }

  create() {
    // The Background
    // this.add.image(400, 300, "space");
    this.add.image(400, 300, "sky");

    // The Platforms
    const platforms = this.createPlatforms();

    // The Player
    this.player = this.createPlayer();

    // The Stars
    const stars = this.createStars();

    this.scoreLabel = this.createScoreLabel(16, 16, 0);

    // Give the player and the platforms the ability to collide
    this.physics.add.collider(this.player, platforms);

    // Make the Stars and the Platforms be able to Collide
    this.physics.add.collider(stars, platforms);

    this.physics.add.overlap(this.player, stars, this.collectStar, null, this);

    // Track the keyboard input
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  createPlatforms() {
    // The Platforms Group (Ground and the 2 ledges we can jump on)
    const platforms = this.physics.add.staticGroup();

    // The Ground
    platforms.create(400, 568, "ground").setScale(2).refreshBody();

    // The Ledges
    platforms.create(600, 400, "ground");
    platforms.create(50, 250, "ground");
    platforms.create(750, 220, "ground");

    return platforms;
  }

  createPlayer() {
    const player = this.physics.add.sprite(100, 450, "dude");

    player.setBounce(0.2);
    player.setCollideWorldBounds(true);

    player.anims.create({
      key: "left",
      frames: this.anims.generateFrameNumbers("dude", { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "turn",
      frames: [{ key: "dude", frame: 4 }],
      frameRate: 20,
    });

    this.anims.create({
      key: "right",
      frames: this.anims.generateFrameNumbers("dude", { start: 5, end: 8 }),
      frameRate: 10,
      repeat: -1,
    });

    return player;
  }

  update() {
    if (this.cursors.left.isDown) {
      // move it to the left 160 px (-ve => left)
      this.player.setVelocityX(-160);

      // Play the left animation (from frame 0 to 3)
      this.player.anims.play("left", true);
    } else if (this.cursors.right.isDown) {
      // move it to the right 160 px (+ve => right)
      this.player.setVelocityX(160);

      // Play the right animation (from frame 5 to 8)
      this.player.anims.play("right", true);
    } else {
      // Stop
      this.player.setVelocityX(0);

      // Play the face animation (4th frame)
      this.player.anims.play("turn");
    }
    if (this.cursors.up.isDown && this.player.body.touching.down) {
      // Play the Up animation (jump)
      this.player.setVelocityY(-330);
    }
  }

  createStars() {
    const stars = this.physics.add.group({
      key: "star",
      repeat: 11,
      setXY: { x: 12, y: 0, stepX: 70 },
    });

    return stars;
  }

  collectStar(player, star) {
    star.disableBody(true, true);

    this.scoreLabel.add(10);
  }

  createScoreLabel(x, y, score) {
    const style = { fontSize: "32px", fill: "#000" };

    const label = new ScoreLabel(this, x, y, score, style);

    this.add.existing(label);

    return label;
  }
}

export default IceTower;
