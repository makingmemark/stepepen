import * as ex from "excalibur";
import { Images } from "../../../resources.js";
import { ANCHOR_CENTER,  LEFT,RIGHT,TAG_HERO_BULLET, SCALE } from "../../../constants.js";
import { DrawShapeHelper } from "../../../classes/DrawShapeHelper.js";
import { CryptoadHorizontalBullet } from "./CryptoadHorizontalBullet.js";

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
  image: Images.cryptoadSheetImage,
  grid: {
    columns: 4,
    rows: 3,
    spriteWidth: 32,
    spriteHeight: 23,
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

const paintIdleAnim = ex.Animation.fromSpriteSheet(spriteSheet, [7], 200);
paintIdleAnim.strategy = ex.AnimationStrategy.Freeze;

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

export class Cryptoad extends ex.Actor {
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

      if(!this.hitWithPaint) this.shoot(); // ah if i have this on, the handleCollisionWithMegaManBullet doesn't seem to work the same way
      // must be to do with events etc

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

  
    console.log('behaviour running...')
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

  async shoot() {
    console.log('shoot running...')
    if(this.hitWithPaint) return;

    await this.actions.delay(2000).toPromise();

    if (this.hitWithPaint) {
      return;
    }
    this.graphics.use(enterHidingAnim);
    await this.actions.delay(800).toPromise();
    if (this.hitWithPaint) {
      return;
    }
    
    this.createHorizontalBullets();

    await this.actions.delay(1000).toPromise();
    if(!this.hitWithPaint) 
    {
      this.graphics.use(idleHidingAnim);

      // if (this.isKilled()) {
      //   return;
      // }
      this.shoot();
    }
  }

  createHorizontalBullets() {

    if(this.hitWithPaint) return;

    const x = this.pos.x;
    const y = this.pos.y + SCALE * -2;
    this.scene.engine.add(
      new CryptoadHorizontalBullet(x - 12 * SCALE, y, LEFT)
    );
    // this.scene.engine.add(
    //   new HardHatHorizontalBullet(x + 12 * SCALE, y, RIGHT)
    // );
  }

  // onPreUpdate(engine, delta) {
  //   console.log('onPreUpdate')
  // }


  async handleCollisionWithMegaManBullet(other) {
    console.log('collision with megaman bullet, play color animation!, other', other)
     
    // await this.actions.delay(50).toPromise();
    other.kill();
    
    this.hitWithPaint = true
    this.body.collisionType = ex.CollisionType.PreventCollision;
    // await this.actions.delay(100).toPromise(); // wait one second so bullet gets to  him
    this.graphics.use(paintAnim); //  show anim
    

    await this.actions.delay(1000).toPromise();
    this.graphics.use(paintIdleAnim);
    // this.graphics.opacity = 0.5;
    // this.z = 0;
    

    // this.kill();
    // other.deflect(); // if we want to deflect
    

    // this.hitWithPaint = true
    
  }
}
