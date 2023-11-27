import * as ex from "excalibur";

let punkImage = 'punk9007-all-sheet.png';
// let punkImage = 'punk9255-all-sheet.png';

const Images = {
  // heroSheetImage: new ex.ImageSource("/sprites/mm-48-drew-blue-sheet.png"),
  // heroSheetImage: new ex.ImageSource("/sprites/mm-48-marka.png"),
  heroSheetImage: new ex.ImageSource("/sprites/bunya/stepepen-bored.png"),
  // heroJumpSheetImage: new ex.ImageSource("/sprites/bunya/jumping.png"),
  // heroBulletImage: new ex.ImageSource("/sprites/mm-lemon.png"),
  heroBulletImage: new ex.ImageSource("/sprites/mm-paint-bullets.png"),

  blockImage: new ex.ImageSource("/sprites/block.png"),

  // map1Image: new ex.ImageSource("/maps/DrewMan_stage/map1-marka-full-c.png"),
  map1Image: new ex.ImageSource("/maps/DrewMan_stage/map-mario.png"),
  // map1Image: new ex.ImageSource("/maps/DrewMan_stage/map1.png"),
  map2Image: new ex.ImageSource("/maps/DrewMan_stage/map2-full-c.png"), 
  map3Image: new ex.ImageSource("/maps/DrewMan_stage/map3.png"),

  shotmanSheetImage: new ex.ImageSource("/sprites/new-shotman-sheet.png"),
  // hardHatSheetImage: new ex.ImageSource("/sprites/hardhat-sheet.png"),
  hardHatSheetImage: new ex.ImageSource("/sprites/1327/" + punkImage),
  pipiSheetImage: new ex.ImageSource("/sprites/pipi-sheet.png"),
  pipiSheetImageNew: new ex.ImageSource("/sprites/bunya/enemies.png"),
  explosionSpriteSheet: new ex.ImageSource("/sprites/explosion-sheet.png"),

  sweatSpriteSheetImage: new ex.ImageSource("/sprites/mm-pain-sweat-sheet.png"),
  painFlashImage: new ex.ImageSource("/sprites/mm-pain-flash.png"),
  mmExplosionSpriteSheet: new ex.ImageSource("/sprites/mm-die-explosion.png"),
};

const Sounds = {
  LANDING: new ex.Sound("/sounds/mm-floor-landing.wav"),
  // SHOOT: new ex.Sound("/sounds/mm-bullet.wav"),
  SHOOT: new ex.Sound("/sounds/Fire.wav"),
  // PAIN: new ex.Sound("/sounds/mm-pain.wav"),
  PAIN: new ex.Sound("/sounds/Die.wav"),
  JUMP: new ex.Sound("/sounds/Jump.wav")
};

const Soundtracks = {
  LEVEL1: new ex.Sound("/sounds/Underwater-Theme.wav")
}

const loader = new ex.Loader();
loader.suppressPlayButton = true; // hides play button
const allResources = { ...Images, ...Sounds, ...Soundtracks };
for (const res in allResources) {
  loader.addResource(allResources[res]);
}

export { loader, Images, Sounds, Soundtracks };
