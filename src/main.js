import Phaser from "phaser";

import IceTower from "./scenes/IceTower";

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 300 },
      debug: false,
    },
  },
  scene: [IceTower],
};

export default new Phaser.Game(config);
