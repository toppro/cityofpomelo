module.exports = {
  ROOM: {
    ROLE_ID: {
      ASSASSIN: 1,
      THIEF: 2,
      MAGICIAN: 3,
      KING: 4,
      BISHOP: 5,
      MERCHANT: 6,
      ARCHITECT: 7,
      WARLORD: 8,
      QUEEN: 9
    },

    BLUEPRINT_TYPE_ID: {
     LIGHTHOUSE: 21
    },

    COLOR: {
      GREEN: "green",
      RED: "red",
      BLUE: "blue",
      GOLDEN: "golden",
      PURPLE: "purple"
    },
    CONSTRUCT_NUM_FOR_COMMON: 1,
    CONSTRUCT_NUM_FOR_ARCHITECT: 3,
    ROOM_ID_NONE: 0, // player without room(not in any room)
    PLAYER_ID_NONE: 0, // none player id in a room(placeholder)
    TEAM_ID_NONE: -1, // none team id (placeholder)
    USER_ID_NONE: 0, // none user id (placeholder)
    SERVER_ID_NONE: 0, // none server id (placeholder)
    SEAT_ID_NONE: 0, // none seat id (placeholder)
    PLAYER_INFO_NONE: '', // none player info	(placeholder)
    PLAYER_NAME_NONE: '', // none player name	(placeholder)
    JOIN_ROOM_RET_CODE: {
      OK							: 1,	// join ok
      NO_POSITION			: -1,	// there is no position
      ALREADY_IN_ROOM	: -2,	// already in the room
      IN_OTHER_ROOM		: -3,	// already in other room
      SYS_ERROR				: -4	// system error
    }, // return code of trying to join a room

    ROOM_TITLE: {
      MEMBER: 0,
      CAPTAIN: 1
    }, // room member title(member/captain)

    WINNER_INDEX: {
      TEAM_A: 0,
      TEAM_B: 1,
      DRAW: 2
    }, // TEAM_A/TEAM_B win, draw

    EFFECT_TRIGGER_TIMING: {
      ROUND_END: 1,

      THRONE_CHANGE: 6,
      WALL: 7,
      LIGHTHOUSE: 8,

      GAME_OVER: 9
    },

    // sys return
    OK: 1,
    FAILED: 0,

    // yes / no
    YES: 1,
    NO: 0,

    MAX_MEMBER_NUM: 6, // max member num in a room

    DEFAULT_NAME: '',

    PREFIX_4_ROBOT: 'Robot_',

    WIN_GAME_BUILDING_NUM4ROBOT: 8,
    WIN_GAME_BUILDING_NUM: 11,

    QUEEN_EXTRA_COIN_NUM: 3,

    ROBOT_TIMEOUT: 3000,

    MAX_RANDOM_NUM: 999999999,

    MAX_BLUEPRINT_NUM_IN_HAND: 8,
    MAX_BUILDING_NUM: 8,

    DISCARD_ROLE_NUM: 1,

    MAX_COLOR_NUM: 5,

    MAX_COIN_IN_BANK: 32,

    ROOM_NUM_PER_PAGE: 9
  }
};

