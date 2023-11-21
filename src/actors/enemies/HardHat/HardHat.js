import * as ex from "excalibur";
import { Images } from "../../../resources.js";
import { ANCHOR_CENTER, TAG_HERO_BULLET } from "../../../constants.js";
import { DrawShapeHelper } from "../../../classes/DrawShapeHelper.js";
// import { HardHatBullet } from "./HardHatBullet.js";

// const spriteSheet = ex.SpriteSheet.fromImageSource({
//   image: Images.hardHatSheetImage,
//   grid: {
//     columns: 5,
//     rows: 3,
//     spriteWidth: 32,
//     spriteHeight: 32,
//   },
// });

const spriteSheet = ex.SpriteSheet.fromImageSource({
  image: Images.hardHatSheetImage,
  grid: {
    columns: 4,
    rows: 3,
    spriteWidth: 24,
    spriteHeight: 24,
  },
});

const enterHidingAnim = ex.Animation.fromSpriteSheet(
  spriteSheet,
  [0,1,2,3],
  200
);
enterHidingAnim.strategy = ex.AnimationStrategy.Freeze;

// const paintAnim = ex.Animation.fromSpriteSheet(
//   spriteSheet,
//   [12,13,14,15],
//   200
// );
// paintAnim.strategy = ex.AnimationStrategy.Freeze;

const idleHidingAnim = ex.Animation.fromSpriteSheet(spriteSheet, [0], 200);
idleHidingAnim.strategy = ex.AnimationStrategy.Freeze;

const paintAnim = ex.Animation.fromSpriteSheet(spriteSheet, [8,9,10,11], 50);
paintAnim.strategy = ex.AnimationStrategy.Freeze;

const exitHidingAnim = ex.Animation.fromSpriteSheet(
  spriteSheet,
  // [0, 1, 2],
  [0],
  200
);
// exitHidingAnim.  strategy = ex.AnimationStrategy.Freeze;

const standingAnim = ex.Animation.fromSpriteSheet(spriteSheet, [3], 200);
// const standingAnimPain = ex.Animation.fromSpriteSheet(spriteSheet, [7], 200);
// const walkingAnim = ex.Animation.fromSpriteSheet(spriteSheet, [3, 4], 200);
// const walkingAnimPain = ex.Animation.fromSpriteSheet(spriteSheet, [8, 9], 200);

// const collisionBox = ex.Shape.Box(
//   14,
//   14,
//   ANCHOR_CENTER,
//   new ex.Vector(0, 8) //pixels
// );

const collisionBox = ex.Shape.Box(
  24,
  24,
  ANCHOR_CENTER,
  new ex.Vector(0, 0) //pixels
);

export class HardHat extends ex.Actor {
  constructor(x, y) {
    super({
      x: x,
      y: y,
      width: 24,
      height: 24,
      collider: collisionBox,
      scale: new ex.Vector(2, 2),
      color: ex.Color.Green,
      collisionType: ex.CollisionType.Fixed,
    });

    this.hitWithPaint = false;

    // paintAnim.events.on('end', () => {
    //   // this.paintAnimPlayed = true;
    //   console.log('paintAnim finished');
    // });

    this.graphics.use(idleHidingAnim);

    this.on("initialize", () => {
      // void this.behavior();

      // this.graphics.add("only", onlyAnim);
      // this.graphics.getGraphic("only").events.on("frame", (frame) => {
      //   console.log("frame", frame);
      // });
      // this.graphics.show("only");

      //Collide with body
      this.on("collisionstart", (ev) => {

        console.log("collisionstart ",this.hitWithPaint)

        if(this.hitWithPaint) return
        
        if (ev.other.hasTag(TAG_HERO_BULLET)) {
          this.handleCollisionWithMegaManBullet(ev.other);
        }
      });
    });
  }

  onInitialize(_engine) {
    // new DrawShapeHelper(this); // this shows shape
  }

  async behavior() {

  
    if (this.hitWithPaint) {
      return; // Exit the function early
    }


    this.graphics.use(enterHidingAnim);
    // this.graphics.use(exitHidingAnim);

    await this.actions.delay(2000).toPromise();

    this.graphics.use(exitHidingAnim);

    // // exitHidingAnim.goToFrame(0);
    // // enterHidingAnim.goToFrame(0);

    // this.graphics.use(standingAnim);

    // // this.shootBullet(engine);

    // await this.actions.delay(2000).toPromise();

    // this.graphics.use(enterHidingAnim);

    await this.actions.delay(2000).toPromise();

    if (!this.hitWithPaint) {
      void this.behavior();
    }
  }

  // onPreUpdate(engine, delta) {
  //   console.log('onPreUpdate')
  // }


  async handleCollisionWithMegaManBullet(other) {
    console.log('collision with megaman bullet, play color animation!')

    this.hitWithPaint = true

    await this.actions.delay(100).toPromise(); // wait one second so bullet gets to  him
    this.graphics.use(paintAnim); //  show anim
    other.kill();

    await this.actions.delay(1000).toPromise();
    // this.graphics.opacity = 0.5;

    

    this.kill();
    // other.deflect(); // if we want to deflect
    


    

    // this.hitWithPaint = true
    
  }

  shootBullet(engine) {
    this.shootingMsLeft = 300;

    // Get ideal bullet position per direction
    let bulletX = this.pos.x - 18 * SCALE;
    if (this.spriteDirection === RIGHT) {
      bulletX = this.pos.x + 18 * SCALE;
    }

    Sounds.SHOOT.play();
    const bullet = new HeroBullet(
      bulletX,
      this.pos.y - 8,
      this.spriteDirection
    );
    engine.add(bullet);
  }
}
