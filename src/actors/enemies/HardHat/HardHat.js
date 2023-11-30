import * as ex from "excalibur";
import { Images } from "../../../resources.js";
import { ANCHOR_CENTER,  LEFT,RIGHT,TAG_HERO_BULLET, SCALE } from "../../../constants.js";
import { DrawShapeHelper } from "../../../classes/DrawShapeHelper.js";
import { HardHatHorizontalBullet } from "./HardHatHorizontalBullet.js";

// const spriteSheet = ex.SpriteSheet.fromImageSource({
//   image: Images.hardHatSheetImage,
//   grid: {
//     columns: 5,
//     rows: 3,
//     spriteWidth: 32,
//     spriteHeight: 32,
//   },
// });



// const collisionBox = ex.Shape.Box(
//   24,
//   24,
//   ANCHOR_CENTER,
//   new ex.Vector(0, 0) //pixels
// );


export class HardHat extends ex.Actor {
  constructor(x, y, id) {
    super({
      x: x,
      y: y,
      id: id,
      width: 24,
      height: 24,
      collider: ex.Shape.Box(
        24,
        24,
        ANCHOR_CENTER,
        new ex.Vector(0, 0) //pixels
      ),
      scale: new ex.Vector(2, 2),
      color: ex.Color.Green,
      collisionType: ex.CollisionType.Fixed,
    });

    // TODO: clean these up
    // let idleHidingAnim, enterHidingAnim, exitHidingAnim, spriteSheet, paintAnim, paintIdleAnim, standingAnim = null;

    this.id = id; // Assuming id is either "9007" or "9255"
    this.imageToLoad = Images[this.id]; // Use bracket notation to access the image

    if (!this.imageToLoad) {
      console.error("Invalid ID or Image not found for ID:", this.id);
      return;
    } else console.log('imageToload', this.imageToLoad)

    this.hitWithPaint = false;
    this.damagesHeroWithNumber = 4;

    this.spriteSheet = ex.SpriteSheet.fromImageSource({
      image:  this.imageToLoad,
      grid: {
        columns: 4,
        rows: 3,
        spriteWidth: 26,
        spriteHeight: 28,
      },
    });

    this.idleHidingAnim = ex.Animation.fromSpriteSheet(this.spriteSheet, [0], 200);
    this.idleHidingAnim.strategy = ex.AnimationStrategy.Freeze;

    this.paintAnim = ex.Animation.fromSpriteSheet(this.spriteSheet, [8,9,10,11], 50);
    this.paintAnim.strategy = ex.AnimationStrategy.Freeze;

    this.paintIdleAnim = ex.Animation.fromSpriteSheet(this.spriteSheet, [7], 200);
    this.paintIdleAnim.strategy = ex.AnimationStrategy.Freeze;

    this.standingAnim = ex.Animation.fromSpriteSheet(this.spriteSheet, [3], 200);

    this.exitHidingAnim = ex.Animation.fromSpriteSheet(
      this.spriteSheet,
      // [0, 1, 2],
      [0],
      200
    );

    this.enterHidingAnim = ex.Animation.fromSpriteSheet(
      this.spriteSheet,
      [0,1,2,3],
      200
    );
    this.enterHidingAnim.strategy = ex.AnimationStrategy.Freeze;
    

    this.graphics.use(this.idleHidingAnim);

    this.on("initialize", () => {

      console.log('iniitalizing hardhat, id:', this.id)

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


    this.graphics.use(this.enterHidingAnim);
    // this.graphics.use(exitHidingAnim);

    await this.actions.delay(2000).toPromise();

    this.graphics.use(this.exitHidingAnim);

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
    // console.log('shoot running...')
    if(this.hitWithPaint) return;

    await this.actions.delay(2000).toPromise();

    if (this.hitWithPaint) {
      return;
    }
    this.graphics.use(this.enterHidingAnim);
    await this.actions.delay(800).toPromise();
    if (this.hitWithPaint) {
      return;
    }
    
    this.createHorizontalBullets();

    await this.actions.delay(1000).toPromise();
    if(!this.hitWithPaint) 
    {
      this.graphics.use(this.idleHidingAnim);

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
      new HardHatHorizontalBullet(x - 12 * SCALE, y, LEFT)
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
    this.graphics.use(this.paintAnim); //  show anim
    

    await this.actions.delay(1000).toPromise();
    this.graphics.use(this.paintIdleAnim);
    // this.graphics.opacity = 0.5;
    // this.z = 0;
    

    // this.kill();
    // other.deflect(); // if we want to deflect
    

    // this.hitWithPaint = true
    
  }
}
