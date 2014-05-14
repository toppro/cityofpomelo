var gNotification = cc.NotificationCenter.getInstance();
var gSpriteFrameCache = cc.SpriteFrameCache.getInstance();
var gSharedEngine = cc.AudioEngine.getInstance();


var roleAvailablePNG = 'image/roleAvailable.png';
var roleAvailablePList = 'image/plist/roleAvailable.plist';

var roleNotAvailablePNG = 'image/roleNotAvailable.png';
var roleNotAvailablePList = 'image/plist/roleNotAvailable.plist';

var roleIconSmallPNG = 'image/roleIconSmall.png';
var roleIconSmallPList = 'image/plist/roleIconSmall.plist';

var roleNameSmallPNG = 'image/roleNameSmall.png';
var roleNameSmallPList = 'image/plist/roleNameSmall.plist';

var skillIconPNG = 'image/skillIcon.png';
var skillIconPList = 'image/plist/skillIcon.plist';

var roundEndPNG = 'image/roundEnd.png';
var roundEndPList = 'image/plist/roundEnd.plist';

var taxesPNG = 'image/taxes.png';
var taxesPList = 'image/plist/taxes.plist';

var roleSkillPNG = 'image/roleSkill.png';
var roleSkillPList = 'image/plist/roleSkill.plist';

var seatNumberCBigPNG = 'image/seatNumberCBig.png';
var seatNumberCBigPList = 'image/plist/seatNumberCBig.plist';

var statusPNG = 'image/status.png';
var statusPList = 'image/plist/status.plist';

var seatNumberCSmallPNG = 'image/seatNumberCSmall.png';
var seatNumberCSmallPList = 'image/plist/seatNumberCSmall.plist';

var confirmAndCancelBigPNG = 'image/confirmAndCancelBig.png';
var confirmAndCancelBigPList = 'image/plist/confirmAndCancelBig.plist';

var confirmAndCancelSmallPNG = 'image/confirmAndCancelSmall.png';
var confirmAndCancelSmallPList = 'image/plist/confirmAndCancelSmall.plist';

var exchangeCardPNG = 'image/exchangeCard.png';
var exchangeCardPList = 'image/plist/exchangeCard.plist';

var configAndClosePNG = 'image/configAndClose.png';
var configAndClosePList = 'image/plist/configAndClose.plist';

var roleSkillOrnamentPNG = 'image/roleSkillOrnament.png';
var roleSkillOrnamentPList = 'image/plist/roleSkillOrnament.plist';

var blueprintAvailableBigPNG = 'image/blueprintAvailableBig.png';
var blueprintAvailableBigPList = 'image/plist/blueprintAvailableBig.plist';

var coinBigPNG = 'image/coinBig.png';
var coinBigPList = 'image/plist/coinBig.plist';

var countdownNumPNG = 'image/countdownNum.png';
var countdownNumPList = 'image/plist/countdownNum.plist';

var blueprintNamePNG = 'image/blueprintName.png';
var blueprintNamePList = 'image/plist/blueprintName.plist';

var blueprintNameDecolorPNG = 'image/blueprintNameDecolor.png';
var blueprintNameDecolorPList = 'image/plist/blueprintNameDecolor.plist';

var dismantlePNG = 'image/dismantle.png';
var dismantlePList = 'image/plist/dismantle.plist';

var blueprintAvailableSmallPNG = 'image/blueprintAvailableSmall.png';
var blueprintAvailableSmallPList = 'image/plist/blueprintAvailableSmall.plist';

var selectCoinOrBlueprintPNG = 'image/selectCoinOrBlueprint.png';
var selectCoinOrBlueprintPList = 'image/plist/selectCoinOrBlueprint.plist';

var previousAndNextPagePNG = 'image/previousAndNextPage.png';
var previousAndNextPagePList = 'image/plist/previousAndNextPage.plist';

var preNextPagePNG = 'image/preNextPage.png';
var preNextPagePList = 'image/plist/preNextPage.plist';

var refreshBtnPNG = 'image/refreshBtn.png';
var refreshBtnPList = 'image/plist/refreshBtn.plist';

var roleIconBigPNG = 'image/roleIconBig.png';
var roleIconBigPList = 'image/plist/roleIconBig.plist';

var arrowMiddlePNG = 'image/arrowMiddle.png';
var arrowMiddlePList = 'image/plist/arrowMiddle.plist';

var skillFramePNG = 'image/skillFrame.png';
var skillFramePList = 'image/plist/skillFrame.plist';

var colorBlockPNG = 'image/colorBlock.png';
var colorBlockPList = 'image/plist/colorBlock.plist';

var helpBtnPNG = 'image/helpBtn.png';
var helpBtnPList = 'image/plist/helpBtn.plist';

var createRoomPNG = 'image/createRoom.png';
var createRoomPList = 'image/plist/createRoom.plist';

var enterRoomPNG = 'image/enterRoom.png';
var enterRoomPList = 'image/plist/enterRoom.plist';

var exitRoomPNG = 'image/exitRoom.png';
var exitRoomPList = 'image/plist/exitRoom.plist';

var loginBtnPNG = 'image/loginBtn.png';
var loginBtnPList = 'image/plist/loginBtn.plist';

var sendBtnPNG = 'image/sendBtn.png';
var sendBtnPList = 'image/plist/sendBtn.plist';


var killSmallPNG = 'image/animation/killSmall.png';
var killSmallPList = 'image/animation/plist/killSmall.plist';

var killBigPNG = 'image/animation/killBig.png';
var killBigPList = 'image/animation/plist/killBig.plist';

var beKilledBigPNG = 'image/animation/beKilledBig.png';
var beKilledBigPList = 'image/animation/plist/beKilledBig.plist';

var beStolenBigPNG = 'image/animation/beStolenBig.png';
var beStolenBigPList = 'image/animation/plist/beStolenBig.plist';

var magicBigPNG = 'image/animation/magicBig.png';
var magicBigPList = 'image/animation/plist/magicBig.plist';

var employRoleOrnamentPNG = 'image/animation/employRoleOrnament.png';
var employRoleOrnamentPList = 'image/animation/plist/employRoleOrnament.plist';

var constructBuildingPNG = 'image/animation/constructBuilding.png';
var constructBuildingPList = 'image/animation/plist/constructBuilding.plist';

var dismantleBuildingPNG = 'image/animation/dismantleBuilding.png';
var dismantleBuildingPList = 'image/animation/plist/dismantleBuilding.plist';

var purpleFlagPNG = 'image/animation/purpleFlag.png';
var purpleFlagPList = 'image/animation/plist/purpleFlag.plist';

var wishingWellPNG = 'image/animation/wishingWell.png';
var wishingWellPList = 'image/animation/plist/wishingWell.plist';

var taxesFramePNG = 'image/animation/taxesFrame.png';
var taxesFramePList = 'image/animation/plist/taxesFrame.plist';

var comeOnStagePNG = 'image/animation/comeOnStage.png';
var comeOnStagePList = 'image/animation/plist/comeOnStage.plist';


var employRolePNG = 'image/employRole.png';
var selectedRoleMarkPNG = 'image/selectedRoleMark.png';
var employRoleMarkPNG = 'image/employRoleMark.png';
var roleXPNG = 'image/roleX.png';
var headerPNG = 'image/header.png';
var footerPNG = 'image/footer.png';
var footer6PNG = 'image/footer6.png';
var actionOrderPNG = 'image/actionOrder.png';
var actionOrder6PNG = 'image/actionOrder6.png';
var roleBgPNG = 'image/roleBg.png';
var actionRoleMarkPNG = 'image/actionRoleMark.png';
var crownPNG = 'image/crown.png';
var teamBattlePNG = 'image/teamBattle.png';
var scoreboardPNG = 'image/scoreboard.png';
var scoreboard6PNG = 'image/scoreboard6.png';
var lineLeftPNG = 'image/lineLeft.png';
var lineRightPNG = 'image/lineRight.png';
var grassPNG = 'image/grass.png';
var grass6PNG = 'image/grass6.png';
var roleListBgPNG = 'image/roleListBg.png';
var exchangeWithPlayerPNG = 'image/exchangeWithPlayer.png';
var exchangeCardBgPNG = 'image/exchangeCardBg.png';
var blueprintDescBgPNG = 'image/blueprintDescBg.png';
var blueprintFramePNG = 'image/blueprintFrame.png';
var selectSourceBigPNG = 'image/selectSourceBig.png';
var selectSourceSmallPNG = 'image/selectSourceSmall.png';
var inputNameBgPNG = 'image/inputNameBg.png';
var inputNameEditPNG = 'image/inputNameEdit.png';
var inputBgPNG = 'image/inputBg.png';
var inputNameOrnamentPNG = 'image/inputNameOrnament.png';
var winnerFlag4TeamAPNG = 'image/winnerFlag4TeamA.png';
var winnerFlag4TeamBPNG = 'image/winnerFlag4TeamB.png';
var winnerFlag4DrawPNG = 'image/winnerFlag4Draw.png';
var countdownBgPNG = 'image/countdownBg.png';
var playerNumPNG = 'image/playerNum.png';
var inputPanelBgPNG = 'image/inputPanelBg.png';
var bankPNG = 'image/bank.png';
var bdOrnamentPNG = 'image/buildingOrnament.png';
var bdXOrnamentPNG = 'image/buildingXOrnament.png';
var helpPNG = 'image/help.png';
var gameLobbyPNG = 'image/gameLobby.png';
var loginBgPNG = 'image/loginBg.png';
var selectRoleBgPNG = 'image/selectRoleBg.png';
var chatInputBgPNG = 'image/chatInputBg.png';


var killStatusPNG = 'status_1.png';
var stealStatusPNG = 'status_2.png';


var MUSIC_BACKGROUND = "audio/musicGaoshanliushui.mp3";
var EFFECT_KILL = "audio/effectKill.ogg";
var EFFECT_STEAL = "audio/effectSteal.ogg";
var EFFECT_ROUND_START = "audio/effectRoundStart.ogg";
var EFFECT_CONSTRUCT = "audio/effectConstruct.ogg";
var EFFECT_DISMANTLE = "audio/effectDismantle.ogg";
var EFFECT_ROLE_SHOW = "audio/effectRoleShow.ogg";
var EFFECT_ROLE_CHANGE = "audio/effectRoleChange.ogg";
var EFFECT_SELECT = "audio/effectSelect.ogg";
var EFFECT_CONFIRM = "audio/effectConfirm.ogg";
var EFFECT_CANCEL = "audio/effectCancel.ogg";
var EFFECT_WARNING = "audio/effectWarning.ogg";

var EFFECT_COUNTDOWN_0 = "audio/effectCountdown0.ogg";
var EFFECT_COUNTDOWN_1 = "audio/effectCountdown1.ogg";
var EFFECT_COUNTDOWN_2 = "audio/effectCountdown2.ogg";
var EFFECT_COUNTDOWN_3 = "audio/effectCountdown3.ogg";
var EFFECT_COUNTDOWN_4 = "audio/effectCountdown4.ogg";
var EFFECT_COUNTDOWN_5 = "audio/effectCountdown5.ogg";

var EFFECT_PURPLE_FLAG = "audio/effectPurpleFlag.mp3";
var EFFECT_SPRING = "audio/effectSpring.mp3";

var EFFECT_GAME_OVER = "audio/effectGameOver.ogg";

var g_resources = [
  {src: roleAvailablePNG},
  {src: roleAvailablePList},

  {src: roleNotAvailablePNG},
  {src: roleNotAvailablePList},

  {src: roleNameSmallPNG},
  {src: roleNameSmallPList},

  {src: roleIconSmallPNG},
  {src: roleIconSmallPList},

  {src: roundEndPNG},
  {src: roundEndPList},

  {src: skillIconPNG},
  {src: skillIconPList},

  {src: taxesPNG},
  {src: taxesPList},

  {src: roleSkillPNG},
  {src: roleSkillPList},

  {src: seatNumberCBigPNG},
  {src: seatNumberCBigPList},

  {src: statusPNG},
  {src: statusPList},

  {src: seatNumberCSmallPNG},
  {src: seatNumberCSmallPList},

  {src: confirmAndCancelBigPNG},
  {src: confirmAndCancelBigPList},

  {src: confirmAndCancelSmallPNG},
  {src: confirmAndCancelSmallPList},

  {src: exchangeCardPNG},
  {src: exchangeCardPList},

  {src: configAndClosePNG},
  {src: configAndClosePList},

  {src: roleSkillOrnamentPNG},
  {src: roleSkillOrnamentPList},

  {src: blueprintNamePNG},
  {src: blueprintNamePList},

  {src: blueprintNameDecolorPNG},
  {src: blueprintNameDecolorPList},

  {src: dismantlePNG},
  {src: dismantlePList},

  {src: blueprintAvailableSmallPNG},
  {src: blueprintAvailableSmallPList},

  {src: selectCoinOrBlueprintPNG},
  {src: selectCoinOrBlueprintPList},

  {src: previousAndNextPagePNG},
  {src: previousAndNextPagePList},

  {src: preNextPagePNG},
  {src: preNextPagePList},

  {src: refreshBtnPNG},
  {src: refreshBtnPList},

  {src: killSmallPNG},
  {src: killSmallPList},

  {src: killBigPNG},
  {src: killBigPList },

  {src: beKilledBigPNG},
  {src: beKilledBigPList},

  {src: beStolenBigPNG},
  {src: beStolenBigPList},

  {src: magicBigPNG},
  {src: magicBigPList},

  {src: employRoleOrnamentPNG},
  {src: employRoleOrnamentPList},

  {src: constructBuildingPNG},
  {src: constructBuildingPList},

  {src: dismantleBuildingPNG},
  {src: dismantleBuildingPList},

  {src: purpleFlagPNG},
  {src: purpleFlagPList},

  {src: wishingWellPNG},
  {src: wishingWellPList},

  {src: taxesFramePNG},
  {src: taxesFramePList},

  {src: comeOnStagePNG},
  {src: comeOnStagePList},

  {src: skillFramePNG},
  {src: skillFramePList},

  {src: colorBlockPNG},
  {src: colorBlockPList},

  {src: helpBtnPNG},
  {src: helpBtnPList},

  {src: createRoomPNG},
  {src: createRoomPList},

  {src: enterRoomPNG},
  {src: enterRoomPList},

  {src: exitRoomPNG},
  {src: exitRoomPList},

  {src: loginBtnPNG},
  {src: loginBtnPList},

  {src: sendBtnPNG},
  {src: sendBtnPList},

  {src: roleIconBigPNG},
  {src: roleIconBigPList},

  {src: blueprintAvailableBigPNG},
  {src: blueprintAvailableBigPList},

  {src: coinBigPNG},
  {src: coinBigPList},

  {src: countdownNumPNG},
  {src: countdownNumPList},

  {src: arrowMiddlePNG},
  {src: arrowMiddlePList},

  {src: employRolePNG},
  {src: selectedRoleMarkPNG},
  {src: employRoleMarkPNG},
  {src: roleXPNG},
  {src: headerPNG},
  {src: footerPNG},
  {src: footer6PNG},
  {src: actionOrderPNG},
  {src: actionOrder6PNG},
  {src: roleBgPNG},
  {src: actionRoleMarkPNG},
  {src: crownPNG},
  {src: teamBattlePNG},
  {src: scoreboardPNG},
  {src: scoreboard6PNG},
  {src: lineLeftPNG},
  {src: lineRightPNG},
  {src: grassPNG},
  {src: grass6PNG},
  {src: roleListBgPNG},
  {src: exchangeWithPlayerPNG},
  {src: exchangeCardBgPNG},
  {src: blueprintDescBgPNG},
  {src: blueprintFramePNG},
  {src: selectSourceBigPNG},
  {src: selectSourceSmallPNG},
  {src: inputNameBgPNG},
  {src: inputNameEditPNG},
  {src: inputBgPNG},
  {src: inputNameOrnamentPNG},
  {src: winnerFlag4TeamAPNG},
  {src: winnerFlag4TeamBPNG},
  {src: winnerFlag4DrawPNG},
  {src: countdownBgPNG},
  {src: playerNumPNG},
  {src: inputPanelBgPNG},
  {src: bankPNG},
  {src: bdOrnamentPNG},
  {src: bdXOrnamentPNG},
  {src: helpPNG},
  {src: gameLobbyPNG},
  {src: loginBgPNG},
  {src: selectRoleBgPNG},
  {src: chatInputBgPNG},

  {src: MUSIC_BACKGROUND},
  {src: EFFECT_STEAL},
  {src: EFFECT_ROUND_START},
  {src: EFFECT_CONSTRUCT},
  {src: EFFECT_DISMANTLE},
  {src: EFFECT_ROLE_SHOW},
  {src: EFFECT_SELECT},
  {src: EFFECT_CONFIRM},
  {src: EFFECT_CANCEL},
  {src: EFFECT_WARNING},

  {src: EFFECT_COUNTDOWN_0},
  {src: EFFECT_COUNTDOWN_1},
  {src: EFFECT_COUNTDOWN_2},
  {src: EFFECT_COUNTDOWN_3},
  {src: EFFECT_COUNTDOWN_4},
  {src: EFFECT_COUNTDOWN_5},

  {src: EFFECT_ROLE_CHANGE},
  {src: EFFECT_KILL},
  {src: EFFECT_PURPLE_FLAG},
  {src: EFFECT_SPRING},

  {src: EFFECT_GAME_OVER}
];

var gGameSvrAddr = {
  ip: '10.240.155.201',
  port: 3014
};

var gHidePos = {
  x: -999999,
  y: -999999
};

var gMinRoleId = 1
  , gMaxRoleId = 9
  , gMagicianRoleId = 3
  , gArchitectRoleId = 7
  , gWarlordRoleId = 8;

var gPopupLayer = null;
var gWinSize = null;
var gMaxBlueprintNum = 41;
var gMaxBlueprintNumInHand = 8;
var gMaxBuildingNum = 8;
var gMaxCoinCostNum = 6;
var gMaxStatusNum = 6;
var gMaxStatusIconNum = 24;
var gMaxPlayerNum = 6;

var gDescCharColorList = [207, 201, 255];
var gCountdownBoardPos = [0, 196];

var gPlayerId = 0;
var gShowDismantleFlag = false;

var PREFIX_AVAILABLE = 'available_'
  , PREFIX_NOT_AVAILABLE = 'notAvailable_';

var PREFIX_COUNTDOWN = 'countdownNum_';

var PREFIX_COLOR = 'colorBlock_';

var gEffectCountdown = {
  0: EFFECT_COUNTDOWN_0,
  1: EFFECT_COUNTDOWN_1,
  2: EFFECT_COUNTDOWN_2,
  3: EFFECT_COUNTDOWN_3,
  4: EFFECT_COUNTDOWN_4,
  5: EFFECT_COUNTDOWN_5
};

var gMainGamePanelLayer = null;
var gInputNameLayer = null;
var gGameLobbyLayer = null;
var gLoginLayer = null;
var gPlayerName = "palmtoy";

var gColorSeatNumMap = {"red": 1, "golden": 2, "green": 3, "blue": 4, "purple": 5};

////////////////////////////////////////

