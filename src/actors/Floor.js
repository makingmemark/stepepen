import * as ex from "excalibur";
import { SCALE_2x } from "../constants.js";
import { DrawShapeHelper } from "../classes/DrawShapeHelper.js";

export class Floor extends ex.Actor {
  constructor(x, y, cols, rows) {
    const SIZE = 16;

    super({
      name: "Floor",
      width: SIZE * cols,
      height: SIZE * rows,
      pos: new ex.Vector(x, y),
      scale: SCALE_2x,
      anchor: ex.Vector.Zero,
      collider: ex.Shape.Box(SIZE * cols, SIZE * rows, ex.Vector.Zero),
      collisionType: ex.CollisionType.Fixed,
      color: ex.Color.Black,
    });

    this.graphics.opacity = 0.0;

    this.isFloor = true;
  }
  onInitialize(engine) {
    // new DrawShapeHelper(this);
  }
}
