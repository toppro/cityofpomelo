var appDir = '../game-server/app/';

var utils = require(appDir + 'util/utils');
var consts = require(appDir + 'consts/consts');

var bpDir = appDir + 'domain/entity/blueprints/';

var Blueprint = require(bpDir + 'bpBase');
var BpUniversity = require(bpDir + 'bpUniversity');
var BpDragonGate = BpUniversity;
var BpSlum = require(bpDir + 'bpSlum');
var BpWishingWell = require(bpDir + 'bpWishingWell');
var BpThroneHall = require(bpDir + 'bpThroneHall');
var BpPark = require(bpDir + 'bpPark');
var BpFort = require(bpDir + 'bpFort');
var BpWall = require(bpDir + 'bpWall');
var BpLighthouse = require(bpDir + 'bpLighthouse');

var cards =
{
  "green": [
    {
      "name": "酒馆",
      "cost": 1,
      "count": 5,
      "typeId": 1
    },
    {
      "name": "贸易站",
      "cost": 2,
      "count": 3,
      "typeId": 2
    },
    {
      "name": "市场",
      "cost": 2,
      "count": 4,
      "typeId": 3
    },
    {
      "name": "码头",
      "cost": 3,
      "count": 3,
      "typeId": 4
    },
    {
      "name": "海港",
      "cost": 4,
      "count": 3,
      "typeId": 5
    },
    {
      "name": "市政厅",
      "cost": 5,
      "count": 2,
      "typeId": 6
    }
  ],
  "red": [
    {
      "name": "岗哨",
      "cost": 1,
      "count": 3,
      "typeId": 7
    },
    {
      "name": "监狱",
      "cost": 2,
      "count": 3,
      "typeId": 8
    },
    {
      "name": "竞技场",
      "cost": 3,
      "count": 3,
      "typeId": 9
    },
    {
      "name": "堡垒",
      "cost": 5,
      "count": 2,
      "typeId": 10
    }
  ],
  "blue": [
    {
      "name": "神殿",
      "cost": 1,
      "count": 3,
      "typeId": 11
    },
    {
      "name": "教堂",
      "cost": 2,
      "count": 3,
      "typeId": 12
    },
    {
      "name": "修道院",
      "cost": 3,
      "count": 3,
      "typeId": 13
    },
    {
      "name": "大教堂",
      "cost": 5,
      "count": 2,
      "typeId": 14
    }
  ],
  "golden": [
    {
      "name": "庄园",
      "cost": 3,
      "count": 5,
      "typeId": 15
    },
    {
      "name": "城堡",
      "cost": 4,
      "count": 5,
      "typeId": 16
    },
    {
      "name": "皇宫",
      "cost": 5,
      "count": 3,
      "typeId": 17
    }
  ],
  "purple": [
    {
      "name":  "大学",
      "cost":  6,
      "count": 1,
      "desc": "建成后，最后计分时，额外获得2分",
      "typeId": 18,
      "specialBpClass": BpUniversity
    },
    {
      "name": "许愿井",
      "cost": 5,
      "count": 1,
      "desc": "建成后，最后计分时，除此之外的每一个紫色建筑多计1分",
      "typeId": 19,
      "specialBpClass": BpWishingWell
    },
    {
      "name": "博物馆",
      "cost": 4,
      "count": 1,
      "desc": "建成后，每个回合可点击这个建筑技能，将一张建筑图纸藏于其中，最后计分时，每藏一张可多得1分",
      "typeId": 20,
      "specialBpClass": null
    },
    {
      "name": "灯塔",
      "cost": 3,
      "count": 1,
      "desc": "建出时，可随机获得一张图纸",
      "typeId": consts.ROOM.BLUEPRINT_TYPE_ID.LIGHTHOUSE,
      "specialBpClass": BpLighthouse
    },
    {
      "name":  "龙门",
      "cost":  6,
      "count":  1,
      "desc": "建成后，最后计分时，额外获得2分",
      "typeId": 22,
      "specialBpClass": BpDragonGate
    },
    {
      "name": "图书馆",
      "cost": 6,
      "count": 1,
      "desc": "建成后，获得资源时，可选择获得两张图纸",
      "typeId": 23,
      "specialBpClass": null
    },
    {
      "name": "公园",
      "cost": 6,
      "count": 1,
      "desc": "建成后，回合结束时，若无手牌则可获得两张图纸",
      "typeId": 24,
      "specialBpClass": BpPark
    },
    {
      "name": "城墙",
      "cost": 6,
      "count": 1,
      "desc": "建成后，军阀摧毁你的建筑时需要花费与建造时等量的金币",
      "typeId": 25,
      "specialBpClass": BpWall
    },
    {
      "name": "工厂",
      "cost": 6,
      "count": 1,
      "desc": "建成后，可少花费一个金币建造其它紫色建筑",
      "typeId": 26,
      "specialBpClass": null
    },
    {
      "name": "要塞",
      "cost": 3,
      "count": 1,
      "desc": "该建筑不能被军阀摧毁",
      "typeId": 27,
      "specialBpClass": BpFort
    },
    {
      "name": "贫民窟",
      "cost": 5,
      "count": 1,
      "desc": "建成后，回合结束时，若无金币则可获得一个",
      "typeId": 28,
      "specialBpClass": BpSlum
    },
    {
      "name": "军械库",
      "cost": 3,
      "count": 1,
      "desc": "建成后，无视角色，都可摧毁它并炸毁任何一个建筑",
      "typeId": 29,
      "specialBpClass": null
    },
    {
      "name": "地图室",
      "cost": 5,
      "count": 1,
      "desc": "建成后，最后计分时，每有一张图纸多计1分",
      "typeId": 30,
      "specialBpClass": null
    },
    {
      "name": "鬼城",
      "cost": 2,
      "count": 1,
      "desc": "建成后，最后计分时，此建筑可算作任何颜色",
      "typeId": 31,
      "specialBpClass": null
    },
    {
      "name": "魔法学院",
      "cost": 6,
      "count": 1,
      "desc": "建成后，国王、主教、商人、军阀每回合可获得一个额外的金币",
      "typeId": 32,
      "specialBpClass": null
    },
    {
      "name":  "采石场",
      "cost":  5,
      "count":  1,
      "desc": "建成后，同一种建筑可以建造两个",
      "typeId": 33,
      "specialBpClass": null
    },
    {
      "name": "医院",
      "cost": 6,
      "count": 1,
      "desc": "建成后，就算被杀，仍然可以获得资源",
      "typeId": 34,
      "specialBpClass": null
    },
    {
      "name": "王座厅",
      "cost": 6,
      "count": 1,
      "desc": "建成后，每当王冠的所有权变更，就可获得一个金币",
      "typeId": 35,
      "specialBpClass": BpThroneHall
    },
    {
      "name": "铁匠铺",
      "cost": 5,
      "count": 1,
      "desc": "建成后，每回合都可花费两个金币购买三张图纸",
      "typeId": 36,
      "specialBpClass": null
    },
    {
      "name": "实验室",
      "cost": 5,
      "count": 1,
      "desc": "建成后，便可以一张图纸一个金币的价格出售图纸，每回合限使用一次",
      "typeId": 37,
      "specialBpClass": null
    },
    {
      "name": "天文台",
      "cost": 5,
      "count": 1,
      "desc": "建成后，每回合获得资源时，会出现三张图纸供选",
      "typeId": 38,
      "specialBpClass": null
    },
    {
      "name": "钟塔",
      "cost": 5,
      "count": 1,
      "desc": "建成时，指定一个玩家，当该玩家建造出七个建筑时，游戏就宣告结束; 如果该建筑被摧毁，游戏恢复原设定",
      "typeId": 39,
      "specialBpClass": null
    },
    {
      "name":  "墓地",
      "cost": 5,
      "count":  1,
      "desc": "建成后，当军阀摧毁一个建筑，可花费一个金币将此图纸赎回，但军阀不能使用该功能",
      "typeId": 40,
      "specialBpClass": null
    },
    {
      "name": "藏宝库",
      "cost": 4,
      "count": 1,
      "desc": "建成后，最后计分时，每有一个金币多计1分",
      "typeId": 41,
      "specialBpClass": null
    }
  ]
};


var BlueprintSet = function() {
  // testing code
  this.despatchNum = 0;
  // testing code
  this.dataArray = [];
  this.dataMapById = {};
  this.dataMapByTypeId = {};
  var self = this;
  var idx = 0;
  for(var color in cards) {
    var cardList = cards[color];
    cardList.forEach(function(card) {
      card.color = color;
      card.desc = card.desc || "";
      card.dismantleCost = Math.max(card.cost - 1, 0);
      var cnt = card.count;
      for(var i = 0; i < cnt; i++) {
        var bp = null;
        if(!!card.specialBpClass) {
          bp = new card.specialBpClass(++idx, card);
        } else {
          bp = new Blueprint(++idx, card);
        }
        self.dataArray.push(bp);
        self.dataMapById[idx] = bp;
        if(!self.dataMapByTypeId[card.typeId]) {
          self.dataMapByTypeId[card.typeId] = [];
        }
        self.dataMapByTypeId[card.typeId].push(bp);
      }
    });
  };
  self.maxNum = idx;
  // console.log('1 ~ dataArray = ', JSON.stringify(this.dataArray));
  // console.log('1 ~ dataArray.length = ', this.dataArray.length);
  this.shuffle();
  // console.log('2 ~ dataArray = ', JSON.stringify(this.dataArray));
  // console.log('2 ~ dataArray.length = ', this.dataArray.length);
};

BlueprintSet.prototype.getBlueprintByTypeId = function(typeId) {
  return this.dataMapByTypeId[typeId];
};

BlueprintSet.prototype.getBlueprintById = function(id) {
  return this.dataMapById[id];
};

BlueprintSet.prototype.getNextBlueprint = function() {
  if(this.dataArray.length <= 0) {
    return null;
  }

  /*
  // testing code
  if(++this.despatchNum === 1) {
    for(var i in this.dataArray) {
      var bp = this.dataArray[i];
      if(bp && bp.card.typeId === 21) {
        this.dataArray.splice(i, 1);
        return bp;
      }
    }
  }
  // testing code
  */

  return this.dataArray.shift();
};

BlueprintSet.prototype.returnBlueprint2set = function(bp) {
  if(this.dataArray.length >= this.maxNum) {
    return false;
  }
  // utils.myPrint('bp = ', JSON.stringify(bp));
  return this.dataArray.push(bp);
};

BlueprintSet.prototype.shuffle = function() {
  // change the position 'i' with position x
  var len = this.dataArray.length;
  for(var i = 0; i < len; i++) {
    var rnd = Math.floor(Math.random() * len);
    var tmp = this.dataArray[rnd];
    this.dataArray[rnd] = this.dataArray[i];
    this.dataArray[i] = tmp;
  }
};

module.exports = BlueprintSet;

