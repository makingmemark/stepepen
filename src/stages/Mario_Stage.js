import { Room } from "../actors/Room.js";
import { Images } from "../resources.js";
import { SCALE, SCALED_CELL, ROOM_HEIGHT_1PX, Objs } from "../constants.js";

const SCALED_ROOM_HEIGHT = ROOM_HEIGHT_1PX * SCALE;

const room1 = new Room({
  image: Images.map1Image,
  x: 0,
  y: 0,
  limits: [SCALED_CELL * 8, (83 - 7) * SCALED_CELL - 2],
  
  platforms: [
    
    //   {
       
    //     x: 5,
    //     y: 7,
    //     widthCells: 3, // 82,
    //     heightCells: 1,
    //     dir: 1
    //   },
    //   {
      
    //     x: 2,
    //     y: 4,
    //     widthCells: 3, // 82,
    //     heightCells: 1,
    //     dir: 1
    //   }
   
  ],
  
  floors: [
    {
      //Covers the left side exit
      x: -1,
      y: 0,
      widthCells: 1,
      heightCells: 12,
    },
    // first portion
    {
      x: 0,
      y: 12,
      widthCells: 6, // 82,
      heightCells: 1,
    },
    // second portion
    {
        x: 6,
        y: 12,
        widthCells: 17, // 82,
        heightCells: 1,
    },
    {
        x: 21,
        y: 10,
        widthCells: 1, // 82,
        heightCells: 3,
    },
    {
        x: 25,
        y: 10,
        widthCells: 1, // 82,
        heightCells: 3,
    },
    {
        x: 28,
        y: 8,
        widthCells: 1, // 82,
        heightCells: 5,
    },
    {
        x: 31,
        y: 6,
        widthCells: 1, // 82,
        heightCells: 7,
    },
    {
        x: 34,
        y: 4,
        widthCells: 2, // 82,
        heightCells: 9,
    },

    {
        x: 36,
        y: 12,
        widthCells: 12, // 82,
        heightCells: 1,
    },
    {
        x: 46,
        y: 10,
        widthCells: 1, // 82,
        heightCells: 3,
    },
    {
        x: 46,
        y: 10,
        widthCells: 1, // 82,
        heightCells: 3,
    },
    {
        x: 50,
        y: 10,
        widthCells: 1, // 82,
        heightCells: 1,
    },
    {
        x: 53,
        y: 8,
        widthCells: 1, // 82,
        heightCells: 1,
    },
    {
        x: 56,
        y: 6,
        widthCells: 1, // 82,
        heightCells: 1,
    },
    {
        x: 59,
        y: 4,
        widthCells: 2, // 82,
        heightCells: 1,
    },
    {
        x: 63,
        y: 12,
        widthCells: 7, // 82,
        heightCells: 1,
    }, 
  ],
  portals: [
    {
        x: 69,
        y: 2,
        widthCells: 1, // 82,
        heightCells: 10,
    }
  ],
  objects: [
    // By the rules, this should come in from the OTHER room
    // {
    //   type: Objs.LADDER,
    //   x: 80.5, //81 
    //   y: 6,
    //   // widthCells: 2,
    //   heightCells: 4
    // },
    {
      type: Objs.HARD_HAT,
      x:45, // was 53
      y: 11.15,
    },
    {
      type: Objs.CRYPTOAD,
      x:20, // was 53
      y: 11.25,
    },
    // {
    //   type: Objs.NEW_SHOTMAN,
    //   x:63, // was 53
    //   y:10.25,
    // },
    // {
    //   type: Objs.PIPI,
    //   x:53, // was 53
    //   y: 4,
    // },
  ],
});

const room2 = new Room({
  image: Images.map2Image,
  x: SCALED_CELL * 65,
  y: SCALED_ROOM_HEIGHT * -1,
  limits: [(65 + 8) * SCALED_CELL, (83 - 7) * SCALED_CELL - 2],
  platforms: [],
  floors: [
    //Left wall
    {
      x: 1,
      y: 1,
      widthCells: 1,
      heightCells: 12,
    },
    // Right wall
    {
      x: 17,
      y: 2,
      widthCells: 1,
      heightCells: 13,
    },

    {
      x: 6,
      y: 14,
      widthCells: 11,
      heightCells: 1,
    },
    {
      x: 2,
      y: 12,
      widthCells: 4,
      heightCells: 3,
    },

    //Leftish elevated platform
    {
      x: 2,
      y: 6,
      widthCells: 9,
      heightCells: 2,
    },

    // Rightish stub
    {
      x: 15,
      y: 7,
      widthCells: 2,
      heightCells: 2,
    },

    //Ceil left stub
    {
      x: 2,
      y: 1,
      widthCells: 2,
      heightCells: 1,
    },
    {
      x: 5,
      y: 1,
      widthCells: 13,
      heightCells: 1,
    },
  ],
  portals: [
  ],
  objects: [
    {
      //Ladder dips down to Map1
      type: Objs.LADDER,
      x: 12,
      y: 14,
      heightCells: 5,
    },
    {
      type: Objs.LADDER,
      x: 14,
      y: 7,
      heightCells: 4,
    },
    {
      type: Objs.MAP_CHANGE,
      x: 12,
      y: 15,
      upYDest: SCALED_ROOM_HEIGHT * -1,
      downYDest: 0,
    },
  ],
});

const room3 = new Room({
  image: Images.map3Image,
  x: SCALED_CELL * 65,
  y: SCALED_ROOM_HEIGHT * -2,
  limits: [(65 + 8) * SCALED_CELL, (83 + 27 - 7) * SCALED_CELL - 2],
  platforms: [],
  floors: [
    // Left wall
    {
      x: 1,
      y: 1,
      widthCells: 1,
      heightCells: 12,
    },
    {
      // Main floor
      x: 2,
      y: 12,
      widthCells: 44,
      heightCells: 3,
    },
    {
      // First hump
      x: 10,
      y: 10,
      widthCells: 5,
      heightCells: 2,
    },
    {
      // Second hump
      x: 20,
      y: 10,
      widthCells: 5,
      heightCells: 2,
    },
    {
      // Third hump Left
      x: 27,
      y: 8,
      widthCells: 2,
      heightCells: 4,
    },
    {
      // Third hump Right
      x: 29,
      y: 6,
      widthCells: 3,
      heightCells: 6,
    },

    {
      // Ceil over third hump
      x: 25,
      y: 1,
      widthCells: 10,
      heightCells: 1,
    },

    {
      // Boss Intro Floor 1
      x: 36,
      y: 9,
      widthCells: 5,
      heightCells: 3,
    },
    {
      // Boss Intro Floor 2
      x: 41,
      y: 8,
      widthCells: 5,
      heightCells: 4,
    },
    {
      // Boss Ceil 1
      x: 41,
      y: 2,
      widthCells: 5,
      heightCells: 2,
    },
    {
      // Covers Boss door
      x: 45,
      y: 4,
      widthCells: 1,
      heightCells: 4,
    },
  ],
  portals: [
  ],
  objects: [
    {
      type: Objs.MAP_CHANGE,
      x: 4,
      y: 15,
      upYDest: SCALED_ROOM_HEIGHT * -2,
      downYDest: SCALED_ROOM_HEIGHT * -1,
    },
    {
      type: Objs.LADDER,
      x: 4,
      y: 12,
      heightCells: 7,
    },
  ],
});

export class Mario_Stage {
  constructor() {
    // this.rooms = [room1, room2, room3];
    this.rooms = [room1];
  }

  get firstMap() {
    return this.rooms[0];
  }
}
