import * as ex from "excalibur";
import { Images } from "../../../resources.js";

// export const pipiSpriteSheet = ex.SpriteSheet.fromImageSource({
//   image: Images.pipiSheetImage,
//   grid: {
//     columns: 5,
//     rows: 3,
//     spriteWidth: 32,
//     spriteHeight: 32,
//   },
// });

export const pipiSpriteSheet = ex.SpriteSheet.fromImageSource({
  image: Images.pipiSheetImageNew,
  grid: {
    columns: 6,
    rows: 1,
    spriteWidth: 48,
    spriteHeight: 48,
  },
});
