let ready = false;
let tickRate = 0.1; // Sekunder

// ---------- Resources ------------- //
let Resources = {
  wood: {
    name: "Wood",
    max: 50,
    count: 50,
  },
  minerals: {
    name: "Minerals",
    max: 50,
    count: 0,
  },
  iron: {
    name: "Iron",
    max: 50,
    count: 5,
  },
  coal: {
    name: "Coal",
    max: 50,
    count: 0,
  },
  gold: {
    name: "Gold",
    max: 50,
    count: 0,
  },
  wheat: {
    name: "Wheat",
    max: 50,
    count: 0,
  },
  food: {
    name: "Food",
    max: 50,
    count: 0,
  },
  people: {
    name: "People",
    max: 2,
    count: 2,
  },
  sheep: {
    name: "Sheep",
    max: 0,
    count: 0,
  },
  fighter: {
    name: "Fighters",
    count: 0,
    baseHp: 10,
    baseDmg: 1,
    hp: 0,
    maxHp: 0,
    dmg: 0,
    attackRate: 5,
    selected: 0,
  },
  dragon: {
    name: "Dragons",
    max: 0,
    count: 0,
  },
}

// ---------- Buildings ------------- //
let Buildings = {
  Sawmill: {
    name: "Sawmill",
    tooltip: "Produces Wood",
    count: 0,
    type: [
      "production",
    ],
    baseCost: {
      wood: 20,
      iron: 5,
    },
    cost: {
      wood: 20,
      iron: 5,
    },
    costKoefficient: 1.2,
    effect: {
      wood: 0.5,
    },
  },

  Mine: {
    name: "Mine",
    tooltip: "Produces Minerals and Coal",
    count: 0,
    type: [
      "production",
    ],
    baseCost: {
      wood: 10,
    },
    cost: {
      wood: 10,
    },
    costKoefficient: 1.1,
    effect: {
      coal: 0.1,
      minerals: 0.4,
    },
  },

  Furnace: {
    name: "Furnace",
    tooltip: "Melts Minerals",
    count: 0,
    type: [
      "production",
    ],
    baseCost: {
      minerals: 20,
    },
    cost: {
      minerals: 20,
    },
    costKoefficient: 1.2,
    effect: {
      coal: -0.1,
      minerals: -0.2,
      iron: 0.05,
    },
  },

  Farm: {
    name: "Farm",
    tooltip: "Produces Wheat",
    count: 0,
    type: [
      "production",
    ],
    baseCost: {
      wood: 5,
    },
    cost: {
      wood: 5,
    },
    costKoefficient: 1.1,
    effect: {
      wheat: 0.3,
    },
  },

  Bakery: {
    name: "Bakery",
    tooltip: "Turns Wheat Into Food",
    count: 0,
    type: [
      "production",
    ],
    baseCost: {
      iron: 2,
    },
    cost: {
      iron: 2,
    },
    costKoefficient: 1.3,
    effect: {
      wheat: -1,
      food: 0.1
    },
  },

  House: {
    name: "House",
    tooltip: "Nice House man! :^)",
    count: 0,
    type: [
      "storage",
    ],
    baseCost: {
      wood: 20,
      minerals: 5,
    },
    cost: {
      wood: 20,
      minerals: 5,
    },
    costKoefficient: 2,
    effect: {
      people: 2,
    },
  },

  Storehouse: {
    name: "Storehouse",
    tooltip: "More Storage",
    count: 0,
    type: [
      "storage",
    ],
    baseCost: {
      wood: 20,
      minerals: 10,
      iron: 2,
    },
    cost: {
      wood: 20,
      minerals: 10,
      iron: 2,
    },
    costKoefficient: 2,
    effect: {
      wood: 25,
      minerals: 20,
      coal: 20,
      iron: 15,
      gold: 5,
      wheat: 25,
      food: 20,
    },
  },
}
// ---------- Upgrades -------------//
let Upgrades = {
  
}

let Stats = {
  maxStage: 1,
  stage: 1,
  fighting: false,
  tick: 0,
  
  Enemy: {
    maxHp: 0,
    hp: 0,
    dmg: 1,
    attackRate: 5,
  }

}



function updateAllText() {
  // Resources
  for (const resource in Resources) {
    updateResourceText(resource);
  }
  // Buildings
  for (const building in Buildings) {
    if (getBuilding(building).count != 0) {
      updateBuildingText(building);
    }
  }
}
function clickBuilding(building) {
  console.log(document.getElementById(building));

  holdit(document.getElementById(building),function(){buyBuilding(building)}, 250, 1.1);
}


function buyBuilding(building) {
  console.log(building);
  if (canBuyBuilding(building)) {
    for (const resource in getBuilding(building).cost) {
      addResource(resource, -getBuilding(building).cost[resource]);
    }
    for (const type of getBuilding(building).type) {
      if (type == "storage") {
        for (const resource in getBuilding(building).effect) {
          addStorageResource(resource, getBuilding(building).effect[resource]);
        }
      }
    }


    getBuilding(building).count++;
    updateBuildingCost(building);
    updateBuildingTooltip(building);
    updateBuildingText(building);
  }
}




function updateBuildingText(building) {
  setText(building, getBuilding(building).name + " (" + getBuilding(building).count + ")");
}


function canBuyBuilding(building) {
  for (const resource in getBuilding(building).cost) {
    if (getResource(resource).count < getBuilding(building).cost[resource]) {
      return false;
    }
  } return true;
}
function tooltipCanAffordResource(building) {
  
}

function updateBuildingCost(building) {
  for (const resource in getBuilding(building).cost) {
    getBuilding(building).cost[resource] = getBuilding(building).baseCost[resource]
      * Math.pow(getBuilding(building).costKoefficient, getBuilding(building).count);
    console.log(resource + ": " + getBuilding(building).cost[resource]);

  }
}

function updateResourceText(resource) {
  setText(resource + "Name", getResource(resource).name + ": ");
  setText(resource + "Amount", getResource(resource).count);
  setText(resource + "MaxAmount", "/" + getResource(resource).max);
}

function addResource(resource, value) {
  getResource(resource).count += value;
  if (getResource(resource).max != null)
    getResource(resource).count = getResource(resource).count.clamp(0, getResource(resource).max);
  
  setText(resource + "Amount", getResource(resource).count.toFixed(2));
}

function addStorageResource(resource, value) {
  getResource(resource).max += value;
  setText(resource + "MaxAmount", "/" + getResource(resource).max.toFixed(2));
}

function setStage(number) {
  Stats.stage = number;
  setText('currentStage', Stats.stage);
}
function addStage(number) {
  Stats.stage += number;
  setText('currentStage', Stats.stage);
}


function getResource(resource) {
  return Resources[resource];
}
function getBuilding(building) {
  return Buildings[building];
}



let tooltip = null;
window.onload = function() {
  ready = true;
  tooltip = document.getElementById('tooltip');
  updateAllText();

  var enemyHpBar = document.getElementById('enemyHpBar');
  var fighterHpBar = document.getElementById('fighterHpBar');

}

function buildingTooltipInfo(building) {
  if (building == "null") {
    tooltip.style.display = "none";
    return;
  }
  
  updateBuildingTooltip(building);
  tooltip.style.display = "block";
}
function updateBuildingTooltip(building) {
  let text = getBuilding(building).tooltip;
  console.log(getBuilding(building).cost);


  for (const resource in getBuilding(building).cost) {
    text += "<br>" + resource + ": " + getBuilding(building).cost[resource].toFixed(2);
  }

  tooltip.innerHTML = text;
}

// Change Selected Middle Div
let selectedMiddleDiv = "buildingsDiv";
function changeMiddleDiv(changeTo) {
  console.log(changeTo);
  if (changeTo == "buildingsDiv") {
    changeStyle("buildingsBtn").backgroundColor = "rgb(0, 96, 41)";
    changeStyle("upgradesBtn").backgroundColor = "#4CAF50";
  } else {
    changeStyle("buildingsBtn").backgroundColor = "#4CAF50";
    changeStyle("upgradesBtn").backgroundColor = "rgb(0, 96, 41)";
  }
  changeStyle(selectedMiddleDiv).display = "none";
  changeStyle(changeTo).display = "block";
  selectedMiddleDiv = changeTo;
}

// Replace this with better update timer? interval = bad
setInterval(function () {
  update();
}, 1000 * tickRate);


function update() {
  if (ready) {
    getResourcesFromBuildings();
    regainPeople();

    updateCanBuyColor();
    attackTick();
  }
}

function attackTick() {
  if (Stats.fighting) {
    Stats.tick++;
    if (getResource('fighter').hp > 0 && Stats.tick % getResource('fighter').attackRate == 0) {
      console.log("fighters  " + Stats.tick);
      dmgEnemy(getResource('fighter').dmg);
    }
  }

}

function dmgEnemy(dmg) {
  Stats.Enemy.hp -= dmg;
  if (Stats.Enemy.hp <= 0){
    console.log("respawn");
  }
  updateEnemyHpBar();
}

function updateCanBuyColor() {
  for (const building in Buildings) {
    if (canBuyBuilding(building)) {
      changeStyle(building).backgroundColor = '#0db058';
    } else changeStyle(building).backgroundColor = '#6d1616';
  }
}

function getResourcesFromBuildings() {
  for (const building in Buildings) {
    for (const type of getBuilding(building).type) {
      if (type == 'production' && getBuilding(building).count > 0) {
        for (const resource in getBuilding(building).effect) {
          // if resource inte blir mindre änn noll.
          if (getResource(resource).count + getBuilding(building).effect[resource] * getBuilding(building).count * tickRate < 0) {
            // skippa till nästa building
            break;
          } 
            // addera resurs
            addResource(resource, getBuilding(building).effect[resource] * getBuilding(building).count * tickRate);
        }
      }
    }
  }
}

function regainPeople() {
  if (getResource("people").count < getResource("people").max) {
    addResource("people", 0.001 * Math.pow(2, getResource("people").count));
  }
}



function setText(id, text) {
  if (document.getElementById(id) != null)
    document.getElementById(id).innerHTML = text;
}
function changeStyle(id) {
  return document.getElementById(id).style;
}


// Tooltip
window.onmousemove = function(e) {
  if (ready) {
    let x = e.clientX,
        y = e.clientY;
    tooltip.style.top = (y + 20) + 'px';
    tooltip.style.left = (x + 20) + 'px';
  }
};

//


// Fight Select Fighters
function sliderChange(sliderValue , id) {
  // change % text.
  console.log(id);
  setText(id + "SliderProcent", sliderValue+"%");
  getResource("fighter").selected = Math.floor(Resources.people.count * (sliderValue / 100))
  setText(id + "Selected", getResource("fighter").selected);
}

function startFight() {
  if (!Stats.fighting && hasFighters()) {
    console.log("start");
    addResource("fighter", getResource("fighter").selected);
    console.log(getResource("fighter").max);

    // Start from stage 1
    resetFight();
    
    Stats.fighting = true;
  }
}

function resetFight() {
  setStage(1);
  calculateEnemyStats();
  instanciateFighters();
  updateFighterHpbar();
}
let enemyLerpValue
function calculateEnemyStats() {
  Stats.Enemy.hp = 10;
  Stats.Enemy.maxHp = 10;
  Stats.Enemy.dmg = 1;
  enemyLerpValue = Stats.Enemy.maxHp;
  updateEnemyHpBar();
}

function updateEnemyHpBar() {
  while (enemyLerpValue / Stats.Enemy.hp < 0.9) {
    enemyLerpValue-= 0.1;
    enemyHpBar.style.width = ""+ 100 * (enemyLerpValue / Stats.Enemy.maxHp)+"%";
  }
}

function instanciateFighters() {
  let fighter = getResource('fighter');
  fighter.maxHp = fighter.baseHp  * fighter.count;
  fighter.hp    = fighter.baseHp  * fighter.count;
  fighter.dmg   = fighter.baseDmg * fighter.count;
}

function updateFighterHpbar() {
  let fighter = getResource('fighter');
  fighterHpBar.style.width = ""+ 100 * (fighter.hp / fighter.maxHp)+"%";
}

function hasFighters() {
  // check for different types
  if (getResource("fighter").selected > 0) return true;
}




function holdit(btn, action, start, speedup) {
  console.log("holdit");
  //let button = document.getElementById(btn);
  let t;

  let repeat = function () {
    action();
    t = setTimeout(repeat, start);
    start = start / speedup;
  }

  btn.onmousedown = function () {
    console.log("down");
    repeat();
  }

//<p class="centerText" id="fightersSliderProcent">Fighters: 50%</p>

  btn.onmouseup = function () {
    console.log("up");
    clearTimeout(t);
  }
};

/* to use */
// holdit(btn, function () { }, 1000, 2); /* x..1000ms..x..500ms..x..250ms..x */
function test() {
  console.log("test");
}

// -------------------- Prototypes -------------------- //
String.prototype.capitalize = function () {
  return this.charAt(0).toUpperCase() + this.slice(1);
}
Number.prototype.clamp = function(min, max) {
  return Math.min(Math.max(this, min), max);
}
Number.prototype.round = function() {
  return Math.round(this);
}




// ----------- Save, Load, HardReset ----------- //
function saveGame() {
  console.log("Saving...");
  var data = {
    Resources: Resources,
    Buildings: Buildings,
    Stats: Stats,
  }
  localStorage.setItem("save1", JSON.stringify(data));
}
function loadGame() {
  console.log("Loading...");
  if (localStorage.getItem("save1") === null) {
    console.log("No File To Load!");
    return;
  }
  var savefile = JSON.parse(localStorage.getItem("save1"));
  Resources = savefile.Resources;
  Buildings = savefile.Buildings;
  Stats = savefile.Stats;
  updateAllText();
}
function hardReset() {
  localStorage.removeItem("save1");
  window.location.reload(false);
  
}
// --------------------------------------------- //