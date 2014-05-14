var pomelo = window.pomelo;


pomelo.on('onInitAllPlayerData', function(data) {
  if (!data) {
    return;
  }
  gGameLobbyLayer.replaceScene2MainGame();
  if(gMainGamePanelLayer) {
    gMainGamePanelLayer.onInitAllPlayerData(data);
  }
});

pomelo.on('onEmployRole', function(data) {
  if (!data) {
    return;
  }
  // console.log('onEmployRole ~ data = ', JSON.stringify(data));
  gMainGamePanelLayer.onEmployRole(data);
});

pomelo.on('onComeOnStage', function(data) {
  if (!data) {
    return;
  }
  // console.log('onComeOnStage ~ data = ', JSON.stringify(data));
  gMainGamePanelLayer.onComeOnStage(data);
});

pomelo.on('onUpdatePlayerBuilding', function(data) {
  if (!data) {
    return;
  }
  // console.log('onUpdatePlayerBuilding ~ data = ', JSON.stringify(data));
  gMainGamePanelLayer.onUpdatePlayerBuilding(data);
});

pomelo.on('onUpdatePlayerBlueprint', function(data) {
  if (!data) {
    return;
  }
  // console.log('onUpdatePlayerBlueprint ~ data = ', JSON.stringify(data));
  gMainGamePanelLayer.onUpdatePlayerBlueprint(data);
});

pomelo.on('onUpdatePlayerCoin', function(data) {
  if (!data) {
    return;
  }
  // console.log('onUpdatePlayerCoin ~ data = ', JSON.stringify(data));
  gMainGamePanelLayer.onUpdatePlayerCoin(data);
});

pomelo.on('onKillRoleNotify', function(data) {
  if (!data) {
    return;
  }
  // console.log('onKillRoleNotify ~ data = ', JSON.stringify(data));
  gMainGamePanelLayer.onKillRoleNotify(data);
});

pomelo.on('onStealRoleNotify', function(data) {
  if (!data) {
    return;
  }
  console.log('onStealRoleNotify ~ data = ', JSON.stringify(data));
  gMainGamePanelLayer.onStealRoleNotify(data);
});

pomelo.on('onRestartRound', function(data) {
  if (!data) {
    return;
  }
  console.log('onRestartRound ~ data = ', JSON.stringify(data));
  gMainGamePanelLayer.onRestartRound(data);
});

pomelo.on('onGameOver', function(data) {
  if (!data) {
    return;
  }
  console.log('onGameOver ~ data = ', JSON.stringify(data));
  gMainGamePanelLayer.onGameOver(data);
});

pomelo.on('onUpdateCrownStatus', function(data) {
  if (!data) {
    return;
  }
  // console.log('onUpdateCrownStatus ~ data = ', JSON.stringify(data));
  gMainGamePanelLayer.onUpdateCrownStatus(data);
});

pomelo.on('onUpdatePlayerScore', function(data) {
  if (!data) {
    return;
  }
  // console.log('onUpdatePlayerScore ~ data = ', JSON.stringify(data));
  gMainGamePanelLayer.onUpdatePlayerScore(data);
});

pomelo.on('onUpdateTeamScore', function(data) {
  if (!data) {
    return;
  }
  // console.log('onUpdateTeamScore ~ data = ', JSON.stringify(data));
  gMainGamePanelLayer.onUpdateTeamScore(data);
});

pomelo.on('onExchangeWithPlayerNotify', function() {
  // console.log('onExchangeWithPlayerNotify is running ...');
  gMainGamePanelLayer.onExchangeWithPlayerNotify();
});

pomelo.on('onConstructBuildingNotify', function(data) {
  if (!data) {
    return;
  }
  // console.log('onConstructBuildingNotify ~ data = ', data);
  gMainGamePanelLayer.onConstructBuildingNotify(data);
});

pomelo.on('onHideEmployRoleLayer', function(data) {
  if (!data) {
    return;
  }
  // console.log('onHideEmployRoleLayer ~ data = ', data);
  gMainGamePanelLayer.onHideEmployRoleLayer();
});

pomelo.on('onUpdatePlayerNum', function(data) {
  if (!data) {
    return;
  }
  // console.log('onUpdatePlayerNum ~ data = ', data);
  if(!!gInputNameLayer) {
    gInputNameLayer.onUpdatePlayerNum(data);
  }
});

pomelo.on('onUpdateRoomList', function(data) {
  if (!data) {
    return;
  }
  // console.log('onUpdateRoomList ~ data = ', data);
  if(!!gGameLobbyLayer) {
    gGameLobbyLayer.onUpdateRoomList(data);
  }
});

pomelo.on('onShowPurpleFlag', function(data) {
  if (!data) {
    return;
  }
  // console.log('onShowPurpleFlag ~ data = ', data);
  gMainGamePanelLayer.onShowPurpleFlag(data);
});

pomelo.on('onUpdateBank', function(data) {
  if (!data) {
    return;
  }
  // console.log('onUpdateBank ~ data = ', data);
  if(gMainGamePanelLayer) {
    gMainGamePanelLayer.onUpdateBank(data);
  }
});

pomelo.on('onNotifyFail2Dismantle', function(data) {
  if (!data) {
    return;
  }
  // console.log('onNotifyFail2Dismantle ~ data = ', data);
  if(gMainGamePanelLayer) {
    gMainGamePanelLayer.onNotifyFail2Dismantle();
  }
});

pomelo.on('onNotifyFail2Construct', function(data) {
  if (!data) {
    return;
  }
  // console.log('onNotifyFail2Construct ~ data = ', data);
  if(gMainGamePanelLayer) {
    gMainGamePanelLayer.onNotifyFail2Construct();
  }
});

pomelo.on('onChat', function(data) {
  if (!data) {
    return;
  }
  // console.log('onChat ~ data = ', data);
  if(gMainGamePanelLayer) {
    gMainGamePanelLayer.onChat(data);
  }
});

