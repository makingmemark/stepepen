import * as ex from "excalibur";
import { ANCHOR_TOP_LEFT, Objs, SCALE_2x, SCALED_CELL } from "../constants.js";
import { Floor } from "./Floor.js";
import { Portal } from "./Portal.js";
import { Platform } from "./Platform.js";
import { Ladder } from "./Ladder.js";
import { HardHat } from "./enemies/HardHat/HardHat.js";
import { Cryptoad } from "./enemies/Cryptoad/Cryptoad.js";
import { Pipi } from "./enemies/Pipi/Pipi.js";
import { NewShotman } from "./enemies/NewShotman/NewShotman.js";
import { RoomChange } from "./RoomChange.js";
import { DrawShapeHelper } from "../classes/DrawShapeHelper.js";

export class Room extends ex.Actor {
  constructor({ x, y, image, platforms, floors, portals, objects, limits }) {
    super({
      anchor: ANCHOR_TOP_LEFT,
      pos: new ex.Vector(x, y),
      scale: SCALE_2x,
    });

    this.platforms = platforms;
    this.floors = floors;
    this.portals = portals;
    this.objects = objects;
    this.limits = limits || [];

    const mapSprite = image.toSprite();
    this.graphics.use(mapSprite);
  }

  onInitialize(engine) {

    new DrawShapeHelper(this);

    this.platforms.forEach((f) => {
      const x = this.pos.x + f.x * SCALED_CELL;
      const y = this.pos.y + f.y * SCALED_CELL;

      const platform = new Platform(x, y, f.widthCells, f.heightCells, f.dir, f.distance, f.vertical);
      engine.add(platform);
    });

    this.floors.forEach((f) => {
      const x = this.pos.x + f.x * SCALED_CELL;
      const y = this.pos.y + f.y * SCALED_CELL;

      const floor = new Floor(x, y, f.widthCells, f.heightCells);
      engine.add(floor);
    });

    this.portals.forEach((f) => {
      const x = this.pos.x + f.x * SCALED_CELL;
      const y = this.pos.y + f.y * SCALED_CELL;

      const portal = new Portal(x, y, f.widthCells, f.heightCells);
      engine.add(portal);
    });

    this.objects.forEach((obj) => {
      if (obj.type === Objs.MAP_CHANGE) {
        const x = this.pos.x + obj.x * SCALED_CELL;
        const y = this.pos.y + obj.y * SCALED_CELL;
        const roomChange = new RoomChange(x, y, 1, 1, {
          upYDest: obj.upYDest,
          downYDest: obj.downYDest,
          room: this,
        });
        engine.add(roomChange);
      }

      const x = this.pos.x + obj.x * SCALED_CELL;
      const y = this.pos.y + obj.y * SCALED_CELL;

      // Handle object spawn cases
      if (obj.type === Objs.LADDER) {
        const ladder = new Ladder(x, y, obj.heightCells);
        engine.add(ladder);
      }

      if (obj.type === Objs.HARD_HAT) {
        const id = obj.id;
        console.log('load HardHat id:', id)
        const hardHard = new HardHat(x, y, id);
        engine.add(hardHard);
      }

      if (obj.type === Objs.CRYPTOAD) {
        const cryptoad = new Cryptoad(x, y);
        engine.add(cryptoad);
      }

      if (obj.type === Objs.PIPI) {
        const pipi = new Pipi(x, y);
        engine.add(pipi);
      }

      if (obj.type === Objs.NEW_SHOTMAN) {
        const enemy = new NewShotman(x, y);
        engine.add(enemy);
      }

    });
  }
}
