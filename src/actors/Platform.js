import * as ex from "excalibur";
import { SCALE_2x } from "../constants.js";
import { DrawShapeHelper } from "../classes/DrawShapeHelper.js";
import { Images } from "../resources.js";

const blockSprite = Images.blockImage.toSprite();

export class Platform extends ex.Actor {
  constructor(x, y, cols, rows) {
    const SIZEW = 20;
    const SIZEH = 16;

    super({
      name: "Platform",
      width: SIZEW * cols,
      height: SIZEH * rows,
      pos: new ex.Vector(x, y),
      scale: SCALE_2x,
      anchor: ex.Vector.Zero,
      collider: ex.Shape.Box(SIZEW * cols, SIZEH * rows, ex.Vector.Zero),
      collisionType: ex.CollisionType.Fixed,
    //   color: ex.Color.Black,
    });

    // const blockSprite = Images.blockImage.toSprite();

    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            console.log(i,j)
            // this.graphics.use(blockSprite);
            this.graphics.show(blockSprite, { 
                anchor: ex.Vector.Zero,
                offset: ex.vec( i * blockSprite.width, j * blockSprite.height)
            })
        }
    }

   
    // this.graphics.opacity = 0.0;

    this.isPlatform = true;
  }
  onInitialize(engine) {
    // new DrawShapeHelper(this);
  }
}
