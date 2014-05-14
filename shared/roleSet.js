var consts = require('../game-server/app/consts/consts');
var utils = require('../game-server/app/util/utils');

var cards =
[
  {
    "name": "刺客",
    "id": 1,
    "desc": "选择一个角色(不是玩家), 杀死他, 被杀的人在本回合就失去行动力, 回合结束才能表明身份",
    "skills": ["杀人"]
  },
  {
    "name": "盗贼",
    "id": 2,
    "desc": "偷取一个角色身上所有的钱, 但是无法对刺客和被刺客暗杀的角色进行偷盗",
    "skills": ["偷盗"]
  },
  { 
    "name": "魔术师",
    "id": 3,
    "desc": "可以将自己的建筑图纸与一名指定的玩家对换, 或者选择丢弃一定数量的建筑图纸, 与系统交换",
    "skills": ["交换"]
  },
  {
    "name": "国王",
    "id": 4,
    "desc": "根据拥有的皇室(金色)建筑数量, 收取对应张数的钱币. 并获得皇冠, 即使被杀也能获得",
    "skills": ["国王抽税(golden)"]
  },
  { 
    "name": "主教",
    "id": 5,
    "desc": "根据拥有的宗室(蓝色)建筑数量, 收取对应张数的钱币. 而且保护自己的建筑不会被军阀摧毁",
    "skills": ["主教抽税(blue)"]
  },
  {
    "name": "商人",
    "id": 6,
    "desc": "根据拥有的商务(绿色)建筑数量, 收取对应张数的钱币. 并且能额外得到一个钱币的资源奖励",
    "skills": ["商人抽税(green)"] 
  },
  {
    "name": "建筑师",
    "id": 7,
    "desc": "如果选择建筑图纸则可额外获得两张, 并且允许最多建造3个建筑",
    "skills": ["获取额外的图纸"]
  },
  {
    "name": "军阀",
    "id": 8,
    "desc": "根据拥有的军用(红色)建筑数量, 收取对应张数的钱币. 您还可以指挥部队摧毁一个建筑, 但是要花费该建筑建造费用减1个钱币. 当建造出第八个建筑, 军阀就不能攻击他, 但可以攻击别人",
    "skills": ["摧毁", "商人抽税(red)"]
  },
  {
    "name": "皇后",
    "id": 9,
    "desc": "如果您的座位号与国王只相隔一, 那就可以额外获得3个钱币, 就算国王被暗杀了, 也能获得",
    "skills": ["皇后技能"]
  }
];


var Role = function(card) {
  this.id = card.id;
  this.card = card;
};

var RoleSet = function() {
  var self = this;
  self.dataMapById = [];
  cards.forEach(function(card) {
    var r = new Role(card);
    self.dataMapById[card.id] = r;
  });
  self.reset();
};

RoleSet.prototype.reset = function() {
  this.discardIdList = [];
  this.killedId = 0;
  this.stolenId = 0;
  this.availableIdList4select = [];
  for(var i in this.dataMapById) {
    this.availableIdList4select.push(parseInt(i));
  }
  // console.log('1 ~ availableIdList4select = ', this.availableIdList4select);
};

RoleSet.prototype.getRoleById = function(id) {
  return this.dataMapById[id];
};

RoleSet.prototype.setDiscardRoleIdList = function(idList) {
  if(idList && Array.isArray(idList)) {
    this.discardIdList = idList;

    for(var k in idList) {
      var i = this.availableIdList4select.indexOf(idList[k]);
      // console.log('setDiscardRoleIdList ~ i, idList[k] = ', i, idList[k]);
      if(i >= 0) {
        this.availableIdList4select.splice(i, 1);
      }
    }
    // console.log('2 ~ discardIdList = ', this.discardIdList);
    // console.log('2 ~ availableIdList4select = ', this.availableIdList4select);
  }
};

RoleSet.prototype.getKillAvailableIdList = function(crownFlag) {
  var tmpL = [];
  // utils.myPrint('discardIdList = ', this.discardIdList);
  for(var i in this.dataMapById) {
    i = parseInt(i);
    var isDiscarded = false;
    if(crownFlag) {
      // filter discarded roles just for the player who choose role first
      isDiscarded = (this.discardIdList.indexOf(i) >= 0);
    }
    // utils.myPrint('i, isDiscarded = ', i, isDiscarded);
    if(i !== consts.ROOM.ROLE_ID.ASSASSIN && !isDiscarded) {
      tmpL.push(i);
    }
  }
  return tmpL;
};

RoleSet.prototype.setKilledId = function(id) {
  if(id > consts.ROOM.ROLE_ID.ASSASSIN && id <= consts.ROOM.ROLE_ID.QUEEN) {
    this.killedId = id;
    return true;
  }
};

RoleSet.prototype.getKilledId = function(id) {
  return this.killedId;
};

RoleSet.prototype.getStolenId = function(id) {
  return this.stolenId;
};

RoleSet.prototype.getStealAvailableIdList = function(crownFlag) {
  var tmpL = [];
  for(var i in this.dataMapById) {
    i = parseInt(i);
    var isDiscarded = false;
    if(crownFlag) {
      // filter discarded roles just for the player who choose role first
      isDiscarded = (this.discardIdList.indexOf(i) >= 0);
    }
    if(i > consts.ROOM.ROLE_ID.THIEF && !isDiscarded && i !== this.killedId) {
      tmpL.push(i);
    }
  }
  return tmpL;
};

RoleSet.prototype.setStolenId = function(id) {
  /*
  if(!(this.killedId > consts.ROOM.ROLE_ID.THIEF && this.killedId <= consts.ROOM.ROLE_ID.QUEEN)) {
    return; 
  }
  */
  if(id > consts.ROOM.ROLE_ID.THIEF && id <= consts.ROOM.ROLE_ID.QUEEN && id !== this.killedId) {
    this.stolenId = id;
    return true;
  }
};

RoleSet.prototype.selectRoleId = function(id) {
  var L = this.availableIdList4select;
  var idx = L.indexOf(id);
  if(idx >= 0) {
    L.splice(idx, 1);
    return true;
  } else {
    return false;
  }
};

RoleSet.prototype.getAvailableIdList4select = function() {
  return this.availableIdList4select;
};


/**
 * Expose 'RoleSet' constructor.
 */
module.exports = RoleSet;

