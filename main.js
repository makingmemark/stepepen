import * as ex from "excalibur";
import { Hero } from "./src/actors/Hero/Hero.js";
import { MM_CameraStrategy } from "./src/classes/CameraStrategy.js";
import {
  CUSTOM_EVENT_CAMERA_Y_CHANGE,
  SCALE,
  SCALED_CELL,
  TAG_HERO,
  CUSTOM_EVENT_HERO_DEAD,
  START_X,
  START_Y
} from "./src/constants.js";
import { Lifebar } from "./src/hud/Lifebar.js";
import { HeroHp } from "./src/classes/HeroHp.js";
// import { DrewMan_Stage } from "./src/stages/DrewMan_Stage.js";
import { Mario_Stage } from "./src/stages/Mario_Stage.js";
import { loader } from "./src/resources.js";
import { Soundtracks } from "./src/resources.js";

async function main() {
  const game = new ex.Engine({
    width: 256 * SCALE,
    height: 240 * SCALE,
    displayMode: ex.DisplayMode.FitScreenAndFill,
    fixedUpdateFps: 60,
    antialiasing: false, // Pixel art graphics,
    backgroundColor: ex.Color.fromHex('#000000')
  });

  // game.showDebug(true);

  // Set global gravity
  ex.Physics.acc = new ex.Vector(0, 1500);

  // Global state classes
  const mmHp = new HeroHp(game);

  //-----------------------------------------------------------------------------------------

  const stage = new Mario_Stage();
  stage.rooms.forEach((room) => {
    game.add(room);
  });

  // const hero = new Hero(45 * SCALED_CELL, 2 * SCALED_CELL);
  const hero = new Hero(START_X  * SCALED_CELL, START_Y * SCALED_CELL); // 14
  game.add(hero);
  const cameraStrategy = new MM_CameraStrategy(hero);
  cameraStrategy.setRoomLimits(stage.firstMap.limits);

  const lifebar = new Lifebar();
  game.add(lifebar);

  game.on("initialize", () => {
    game.currentScene.camera.addStrategy(cameraStrategy);
    game.currentScene.world.queryManager.createQuery([TAG_HERO]);
  });

  game.on(CUSTOM_EVENT_CAMERA_Y_CHANGE, async ({ yPos, direction, room }) => {
    // Change Y position
    cameraStrategy.onPinChange(yPos);
    cameraStrategy.setRoomLimits(room.limits);

    hero.setTransitioningRooms(direction);

    // Let the camera catch up
    await hero.actions.delay(1500).toPromise();

    hero.setTransitioningRooms(null);
  });

  function resetGame() {
    console.log('resetGame');
    const hero = new Hero(START_X * SCALED_CELL, START_Y * SCALED_CELL); // 14
    game.add(hero);
    cameraStrategy.setTarget(hero);

    mmHp.resetHp();
    mmHp.init();
    mmHp.hero = hero;
  }

  game.on(CUSTOM_EVENT_HERO_DEAD, async (event ) => {
    if(event) {
      console.log('dead event received in main')
      resetGame();
    }
  });

  await game.start(loader); // will load and then immediately start of suppressPlayButton is true

  Soundtracks.LEVEL1.loop = true;
  Soundtracks.LEVEL1.play()
  mmHp.init();
  mmHp.hero = hero;
}

// Call the main function to start the game
main();


/*
// this works - basic
// https://github.com/mattjennings/excalibur-router/tree/main

import * as ex from 'excalibur'
import { Router, FadeTransition } from 'excalibur-router'

const engine = new ex.Engine({
  width: 800,
  height: 600,
  displayMode: ex.DisplayMode.FitScreen,
})

class Level1 extends ex.Scene {
  onInitialize(engine) {
    engine.add(
      new ex.Label({
        x: 100,
        y: 100,
        text: 'Level 1 - click to go to level 2',
        font: new ex.Font({
          size: 48,
        }),
      })
    )
  }

  onActivate() {
    this.engine.input.pointers.primary.once('down', () => {
      router.goto('level2', { transition: new FadeTransition() })
    })
  }
}

class Level2 extends ex.Scene {
  onInitialize(engine) {
    engine.add(
      new ex.Label({
        x: 100,
        y: 100,
        text: 'Level 2 - click to go to level 1',
        font: new ex.Font({
          size: 48,
        }),
      })
    )
  }

  onActivate() {
    this.engine.input.pointers.primary.once('down', () => {
      router.goto('level1', { transition: new FadeTransition() })
    })
  }
}

const router = new Router({
  routes: {
    level1: Level1,
    level2: Level2,
  },
})

router.start(engine).then(() => {
  router.goto('level1')
})
*/