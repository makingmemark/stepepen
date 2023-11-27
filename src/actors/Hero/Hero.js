import * as ex from "excalibur";
import { DirectionQueue } from "../../classes/DirectionQueue.js";
// import { HeroBullet } from "./HeroBullet.js";
import { HeroPaintBullet } from "./HeroPaintBullet.js";
import { DrawShapeHelper } from "../../classes/DrawShapeHelper.js";
import {
  ANCHOR_CENTER,
  CUSTOM_EVENT_MM_DAMAGED,
  UP,
  DOWN,
  LEFT,
  RIGHT,
  TAG_HERO,
  SCALE_2x,
  SCALE,
  TAG_LADDER,
  TAG_PORTAL,
  TAG_PLATFORM,
  DEAD_Y,
  TAG_LADDER_DETECT_TOP,
  MAX_HP,
} from "../../constants.js";
import { HeroPain } from "./HeroPain.js";
import { Sounds } from "../../resources.js";
import anims, { animationMap } from "./animations.js";

//MOVING SPEEDS
const WALKING_VELOCITY = 150; // was 150
const RUNNING_VELOCITY = 240; // was 240

const ACCELERATION = 600; // Acceleration speed
const FRICTION = 0.90; // Friction factor (between 0 and 1)

const JUMP_VELOCITY = -600;
const LADDER_JUMP_VELOCITY = -200;
const LADDER_CLIMB_VELOCITY = 100;
const PAIN_PUSHBACK_VELOCITY = 50;
const ROOM_TRANSITION_VELOCITY = 20;
const MAX_FALLING_VELOCITY = 400;

// TIMING constants
const DURATION_CLIMB_TOP_TOTAL_MS = 140;
const DURATION_PRE_STEP = 80;

const WALK_ANIM_SPEED = 140;
const WALK_TOTAL_MS = WALK_ANIM_SPEED * 4;

const RUN_ANIM_SPEED = 140;
const RUN_TOTAL_MS = RUN_ANIM_SPEED * 4;

const LADDER_ANIM_SPEED = 220;
const LADDER_TOTAL_MS = LADDER_ANIM_SPEED * 2;

export class Hero extends ex.Actor {
  constructor(x, y) {
    super({
      x: x,
      y: y,
      width: 48,
      height: 48,
      // collider: ex.Shape.Box(11, 22, ANCHOR_CENTER, new ex.Vector(0, -3)),
      collider: ex.Shape.Box(21, 27, ANCHOR_CENTER, new ex.Vector(0, 2)),
      scale: SCALE_2x,
      collisionType: ex.CollisionType.Active,
      color: ex.Color.Green
    });
    this.graphics.use(anims.idleRight);

    this.z = 100; // making hero z high

    //Identifier
    this.isHero = true;
    this.onGround = false;
    // this.onPlatform = true;

    // States
    this.painState = null;
    this.climbTopState = null;
    this.climbingLadderState = false;

    this.isOverlappingLadderTop = false;
    this.ladderOverlap = null;
    this.platformOverlap = null;

    this.directionQueue = new DirectionQueue();
    this.spriteDirection = RIGHT;

    this.shootingMsLeft = 0;
    this.preStepMsLeft = 0;

    this.walkingAnimationFramesMs = WALK_TOTAL_MS;
    this.runningAnimationFramesMs = RUN_TOTAL_MS;
    this.ladderAnimationFramesMs = LADDER_TOTAL_MS;

    this.on("collisionstart", (evt) => this.onCollisionStart(evt));
    this.on("collisionend", (evt) => this.onCollisionEnd(evt));
    this.on("postcollision", (evt) => this.onPostCollision(evt));
  }

  onInitialize(_engine) {
    this.addTag(TAG_HERO);
    // new DrawShapeHelper(this); // this shows shape
  }

  onCollisionStart(evt) {

    if (evt.other.hasTag(TAG_PORTAL)) {
      alert('BRAVO STEPEPEN!')
    }

    // Know when we overlap a ladder, keep track of its X value
    if (evt.other.hasTag(TAG_LADDER)) {
      this.ladderOverlap = {
        x: evt.other.pos.x + 18, // offset to nudge Hero to be right on the ladder
      };
    }


    if (evt.other.hasTag(TAG_PLATFORM)) {
      this.onGround = true;
      // this.onPlatform = true;
      // this.platformOverlap = {
      //   y: evt.other.pos.y + 18, // offset to nudge Hero to be right on the ladder
      // };
      // this.setPlatformLocked(true)
    }

    // Know when we overlap the top of a ladder
    if (evt.other.hasTag(TAG_LADDER_DETECT_TOP)) {
      this.isOverlappingLadderTop = true;
    }

    // Handle hero bullet collisions
    if (evt.other.damagesHeroWithNumber) {
      // Damage hero
      this.takeDamage(evt.other.damagesHeroWithNumber);

      // Remove other bullet
      if (evt.other.diesOnCollideWithHero) {
        evt.other.kill();
      }
    }
  }

  onCollisionEnd(evt) {
    // console.log('onCollisionEnd:',evt.other)
    if (evt.other.hasTag(TAG_LADDER)) {
      this.ladderOverlap = null;
    }
    if (evt.other.hasTag(TAG_PLATFORM)) {
      // this.platformOverlap = null;
      // this.onPlatform = true;
      this.onGround = false;
    }
    if (evt.other.hasTag(TAG_LADDER_DETECT_TOP)) {
      this.isOverlappingLadderTop = false;
    }
  }

  onPostCollision(evt) {
    if (evt.other.isFloor && evt.side === ex.Side.Bottom) {
      // || evt.other.isPlatform && evt.side === ex.Side.Bottom
      // console.log('collided with :',evt.other, evt.side )

      // if(evt.other.isPlatform && evt.side === ex.Side.Bottom)  this.onPlatform = true;

      if (!this.onGround) {
        Sounds.LANDING.play();
      }
      this.onGround = true;
    }
  }

  setTransitioningRooms(newValue) {
    this.transitioningRoomDirection = newValue;
    if (newValue) {
      this.body.collisionType = ex.CollisionType.Passive;
      return;
    }

    if (!this.climbingLadderState) {
      this.body.collisionType = ex.CollisionType.Active;
    }
  }

  setLadderLocked(newValue) {
    this.climbingLadderState = newValue;
    this.vel.y = 0;
    this.vel.x = 0;
    if (newValue) {
      this.pos.x = this.ladderOverlap.x;
      this.body.collisionType = ex.CollisionType.Passive;
      return;
    }
    this.body.collisionType = ex.CollisionType.Active;
  }

  setPlatformLocked(newValue) {
    console.log('setPlaformLocked, x', this.pos.x)
    // this.climbingLadderState = newValue;
    this.vel.y = 0;
    // this.vel.x = 0;
    if (newValue) {
      this.pos.y = this.platformOverlap.y;
      // this.body.collisionType = ex.CollisionType.Passive;
      return;
    }
    // this.body.collisionType = ex.CollisionType.Active;
  }

  onPreUpdatePhysics(engine, delta) {
    const keyboard = engine.input.keyboard;
    const keys = ex.Input.Keys;
    const JUMP_KEY = keys.Z;

    //Always listen for Horizontal input regardless of being locked
    [
      { key: keys.Left, dir: LEFT },
      { key: keys.Right, dir: RIGHT },
    ].forEach((group) => {
      if (engine.input.keyboard.wasPressed(group.key)) {
        this.directionQueue.add(group.dir);
      }
      if (engine.input.keyboard.wasReleased(group.key)) {
        this.directionQueue.remove(group.dir);
      }
    });

    

    // console.log(this.pos.y)

    if(this.pos.y > DEAD_Y) {
      console.log('Below Ground');
      this.takeDamage(MAX_HP)
    }

    //Reset grounding
    if (this.vel.y !== 0) {
      // if(this.onPlatform) return;
      this.onGround = false;
    }
    // Always downtick timers
    if (this.shootingMsLeft > 0) {
      this.shootingMsLeft -= delta;
    }
    // Sync direction to keyboard input
    this.spriteDirection =
      this.directionQueue.direction ?? this.spriteDirection;

    // EARLY STOP - transitionining maps, stop here
    if (this.transitioningRoomDirection === DOWN) {
      this.vel.y = ROOM_TRANSITION_VELOCITY;
      return;
    }
    if (this.transitioningRoomDirection === UP) {
      this.vel.y = -ROOM_TRANSITION_VELOCITY;
      return;
    }

    // EARLY STOP - handle Pain
    if (this.painState) {
      if (this.painState.moveDirection === LEFT) {
        this.vel.x = -PAIN_PUSHBACK_VELOCITY;
      } else if (this.painState.moveDirection === RIGHT) {
        this.vel.x = PAIN_PUSHBACK_VELOCITY;
      }
      this.painState.msRemaining -= delta;
      if (this.painState.msRemaining <= 0) {
        this.painState = null;
      }
      return;
    }

    // EARLY STOP - handle Climb Top
    if (this.climbTopState) {
      this.vel.x = 0;
      this.vel.y = 0;
      this.climbTopState.msRemaining -= delta;
      if (this.climbTopState.msRemaining <= 0) {
        if (this.climbTopState.action === "CLIMB_DOWN") {
          this.setLadderLocked(true);
          this.pos.y += 32;
        }
        this.climbTopState = null;
      }
      return;
    }

    // Ladder movement
    if (this.climbingLadderState) {
      // Assume no vertical movement unless we have UP/DOWN pressed
      this.vel.y = 0;

      const isShooting = this.shootingMsLeft > 0;
      if (!isShooting) {
        // Allow Move UP the ladder if we're not shooting
        if (keyboard.isHeld(keys.Up)) {
          this.vel.y = -LADDER_CLIMB_VELOCITY;
          // Check for upwards exit
          if (this.isOverlappingLadderTop) {
            this.pos.y -= 10; // Nudge upwards to complete the climb (Places Hero on the ground up there)
            this.climbTopState = {
              action: "CLIMB_UP",
              msRemaining: DURATION_CLIMB_TOP_TOTAL_MS,
            };
            this.setLadderLocked(false);
          }
        }

        // Allow Move DOWN the ladder if we're not shooting
        if (keyboard.isHeld(keys.Down)) {
          this.vel.y = LADDER_CLIMB_VELOCITY;
          // Exit ladder by climbing off bottom
          if (!this.ladderOverlap) {
            this.setLadderLocked(false);
          }
        }

        //Work on Ladder frames
        if (this.vel.y !== 0) {
          this.ladderAnimationFramesMs -= delta;
          if (this.ladderAnimationFramesMs <= 0) {
            this.ladderAnimationFramesMs = LADDER_TOTAL_MS;
          }
        }
      }

      // Shoot handler (Ladder)
      this.checkForShootInput(engine);

      // Jump handler (Ladder)
      if (keyboard.wasPressed(JUMP_KEY)) {
        this.setLadderLocked(false);
        this.vel.y = LADDER_JUMP_VELOCITY;
      }
      return;
    }

    // Normal LEFT/RIGHT movement (Ground and In Air)
    if (!this.climbingLadderState) {

      // Maybe reset "prestep" if just on the ground
      const leftOrRightPressed = keyboard.wasPressed(keys.Left) || keyboard.wasPressed(keys.Right);
      if (leftOrRightPressed && this.onGround) {
        this.preStepMsLeft = DURATION_PRE_STEP;
      }

      // Assume no movement
      // this.vel.x = 0; // TODO: check if this ok

      // Do what the current arrow says
      if (this.directionQueue.direction) {
        const dir = this.directionQueue.direction;

        // if (keyboard.isHeld(keys.X)) {
        //   console.log('X held')
        // }
        if (this.onGround) {
          if (this.preStepMsLeft > 0) {
            this.preStepMsLeft -= delta;
          } else {
            if (keyboard.isHeld(keys.X)) {
              this.vel.x = dir === LEFT ? -RUNNING_VELOCITY : RUNNING_VELOCITY;
            } else {
              this.vel.x = dir === LEFT ? -WALKING_VELOCITY : WALKING_VELOCITY;
            } 
          }
        } else {
          // IN AIR
          if (keyboard.isHeld(keys.X)) {
            this.vel.x = dir === LEFT ? -RUNNING_VELOCITY : RUNNING_VELOCITY;
          } else {
            this.vel.x = dir === LEFT ? -WALKING_VELOCITY : WALKING_VELOCITY;
          } 
        }
      }
      else {
        // Apply friction when no direction is pressed
        
        this.vel.x *= FRICTION;
        // console.log(this.vel.x)
        if(this.vel.x > -10 && this.vel.x < 10) this.vel.x = 0;
      }
      

      // Work on running frames
      if (this.vel.x !== 0) {
        this.runningAnimationFramesMs -= delta;
        this.walkingAnimationFramesMs -= delta;
        if (this.runningAnimationFramesMs <= 0) {
          this.runningAnimationFramesMs = RUN_TOTAL_MS;
        }
        if (this.walkingAnimationFramesMs <= 0) {
          this.walkingAnimationFramesMs = WALK_TOTAL_MS;
        }
      }

      //Jump handler (while on ground)
      const canJump = this.onGround;
      if (canJump && engine.input.keyboard.wasPressed(JUMP_KEY)) {
        this.vel.y = JUMP_VELOCITY;
      }
      // Variable jump - shut off negative velocity when releasing the key
      if (engine.input.keyboard.wasReleased(JUMP_KEY) && this.vel.y < 0) {
        this.vel.y = 0;
      }
    }

    // Grab ladder handler while in air
    if (this.ladderOverlap && !this.onGround && keyboard.wasPressed(keys.Up)) {
      this.setLadderLocked(true);
    }

    // Enter ladder downwards from ground
    if (this.ladderOverlap && this.onGround && keyboard.wasPressed(keys.Down)) {
      this.pos.x = this.ladderOverlap.x; // Sync to ladder X
      this.climbTopState = {
        msRemaining: DURATION_CLIMB_TOP_TOTAL_MS,
        action: "CLIMB_DOWN",
      };
    }

    //Shoot handler (Ground/Air)
    this.checkForShootInput(engine);

    // Limit falling speed
    if (this.vel.y > MAX_FALLING_VELOCITY) {
      this.vel.y = MAX_FALLING_VELOCITY;
    }

    // Demo pain setter
    if (engine.input.keyboard.wasPressed(ex.Input.Keys.Space)) {
      this.takeDamage(22);
    }
  }

  checkForShootInput(engine) {
    const SHOOT_KEY = ex.Input.Keys.X;
    if (engine.input.keyboard.wasPressed(SHOOT_KEY)) {
      this.shootBullet(engine);
    }
  }

  onPreUpdate(engine, delta) {
    // Do any physics things
    this.onPreUpdatePhysics(engine, delta);

    // Show correct frame for Mega Man's state
    this.onPreUpdateAnimationLoop(delta);
  }

  takeDamage(num = 10) {
    const engine = this.scene.engine;

    if (this.isFlashingInPain) {
      return;
    }

    engine.emit(CUSTOM_EVENT_MM_DAMAGED, num);

    this.setLadderLocked(false); //Fall off ladder if on one
    this.painState = {
      moveDirection: this.spriteDirection === LEFT ? RIGHT : LEFT,
      msRemaining: 400,
    };

    Sounds.PAIN.play();
    const painFlash = new HeroPain(this); // lockToActor so it follows hero
    engine.add(painFlash);

    void this.beginPainFlashing();
  }

  async beginPainFlashing() {
    this.isFlashingInPain = true;
    const PAIN_FLASH_SPEED = 200;
    for (let i = 0; i <= 4; i++) {
      this.graphics.opacity = 0;
      await this.actions.delay(PAIN_FLASH_SPEED).toPromise();
      this.graphics.opacity = 1;
      await this.actions.delay(PAIN_FLASH_SPEED).toPromise();
    }
    this.isFlashingInPain = false;
  }

  shootBullet(engine) {
    this.shootingMsLeft = 300;

    // Get ideal bullet position per direction
    let bulletX = this.pos.x - 18 * SCALE;
    if (this.spriteDirection === RIGHT) {
      bulletX = this.pos.x + 18 * SCALE;
    }

    Sounds.SHOOT.play();
    const bullet = new HeroPaintBullet(
      bulletX,
      this.pos.y - 8,
      this.spriteDirection
    );
    engine.add(bullet);
  }

  onPreUpdateAnimationLoop(_delta) {
    // Start with LEFT or RIGHT
    let index = this.spriteDirection === LEFT ? 0 : 1;
    // Uptick index if shooting
    if (this.shootingMsLeft > 0) {
      index += 2;
    }

    if (this.painState) {
      this.graphics.use(animationMap["PAIN"][index]);
      return;
    }
    if (this.climbTopState) {
      this.graphics.use(anims.climbTop);
      return;
    }
    if (this.climbingLadderState) {
      this.graphics.use(this.getLadderAnim());
      return;
    }
    if (!this.onGround) {
      this.graphics.use(animationMap["JUMP"][index]);
      return;
    }
    if (this.vel.x !== 0) {
      // console.log(index, this.vel.x)
      //check if run button if pressed if so: 
      
      if (this.vel.x >= RUNNING_VELOCITY || this.vel.x <= -RUNNING_VELOCITY ) {
        this.graphics.use(this.getRunningAnim(index)); // Use running animation
      } else {
        this.graphics.use(this.getWalkingAnim(index)); // Use walking animation
      }
      return;
    }
    if (this.preStepMsLeft > 0) {
      this.graphics.use(animationMap["PRESTEP"][index]);
      return;
    }
    this.graphics.use(animationMap["IDLE"][index]);
  }

  getWalkingAnim(index) {
    /*
    if (this.walkingAnimationFramesMs < WALK_TOTAL_MS * 0.25) {
      return animationMap["WALK1"][index];
    }
    if (this.walkingAnimationFramesMs < WALK_TOTAL_MS * 0.5) {
      return animationMap["WALK2"][index];
    }
    if (this.walkingAnimationFramesMs < WALK_TOTAL_MS * 0.75) {
      return animationMap["WALK3"][index];
    }
    */
    if (this.walkingAnimationFramesMs < WALK_TOTAL_MS * 0.20) {
      return animationMap["WALK5"][index];
    }
    if (this.walkingAnimationFramesMs < WALK_TOTAL_MS * 0.4) {
      return animationMap["WALK4"][index];
    }
    if (this.walkingAnimationFramesMs < WALK_TOTAL_MS * 0.6) {
      return animationMap["WALK3"][index];
    }
    if (this.walkingAnimationFramesMs < WALK_TOTAL_MS * 0.8) {
      return animationMap["WALK2"][index];
    }

    return animationMap["WALK1"][index];
  }

  getRunningAnim(index) {
    // looks like different running animations based on speeds

    if (this.runningAnimationFramesMs < RUN_TOTAL_MS * 0.25) {
      return animationMap["RUN1"][index];
    }
    if (this.runningAnimationFramesMs < RUN_TOTAL_MS * 0.5) {
      return animationMap["RUN2"][index];
    }
    if (this.runningAnimationFramesMs < RUN_TOTAL_MS * 0.75) {
      return animationMap["RUN3"][index];
    }
    return animationMap["RUN2"][index];
  }

  getLadderAnim() {
    const isShooting = this.shootingMsLeft > 0;
    const isRight = this.spriteDirection === RIGHT;

    if (isShooting) {
      this.ladderAnimationFramesMs = LADDER_TOTAL_MS;
      return isRight ? anims.ladderShootR : anims.ladderShoot;
    }
    if (this.ladderAnimationFramesMs < LADDER_TOTAL_MS * 0.5) {
      return anims.ladder;
    }
    return anims.ladderR;
  }
}
