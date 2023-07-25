var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleDefender = require('role.defender');
var roleTower = require('role.tower');
var roleScout = require('role.scout');
var ExtensionPlacement = require('constructionManager');

module.exports.loop = function () {
    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
    var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
    var defenders = _.filter(Game.creeps, (creep) => creep.memory.role == 'defender');
    var scouts = _.filter(Game.creeps, (creep) => creep.memory.role == 'scouts');
    var room = Game.spawns['Spawn'].room;
    var sources = room.find(FIND_SOURCES);
    console.log(sources);

    ExtensionPlacement.run(Game.spawns['Spawn'].room)
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }
    
    var all_adjacent_rooms = Game.map.describeExits(room.name);
    var roomNamesArray = Object.values(all_adjacent_rooms);
    
    for (let i = 0; i < roomNamesArray.length; i++)
    {
        var room_name = roomNamesArray[i];
        if(Memory.rooms[room_name])
        {
            sources = Memory.rooms[room_name];
        }
    }
    
    function calculateBodyParts(maxEnergy) {
      const body = [];
    
      CurrentEnergy = maxEnergy;
      numOfWorkingParts = 0;
      numOfMoveParts = 0;
    
      while (true)
      {
          if ((CurrentEnergy - 150) - 100 >= 0)
          {
              CurrentEnergy -= 150 + 100;
              numOfWorkingParts += 1;
              numOfMoveParts += 2;
          }
          else
          {
              break;
          }
      }
      
      for (let i = 0; i < numOfMoveParts; i++) {
        body.push(MOVE);
      }
    
      for (let i = 0; i < numOfWorkingParts; i++) {
        body.push(CARRY);
        body.push(WORK);
      }
    
      return body;
    }
    
    function calculateBodyPartsForDefender(maxEnergy) {
      const body = [];
    
      CurrentEnergy = maxEnergy;
      numOfAttackParts = 0;
      numOfMoveParts = 0;
    
      while (true)
      {
          if ((CurrentEnergy - 230) - 100 >= 0)
          {
              CurrentEnergy -= 230 + 100;
              numOfAttackParts += 1;
              numOfMoveParts += 2;
          }
          else
          {
              break;
          }
      }
      
      for (let i = 0; i < numOfMoveParts; i++) {
        body.push(MOVE);
      }
    
      for (let i = 0; i < numOfAttackParts; i++) {
        body.push(ATTACK);
        body.push(RANGED_ATTACK);
      }
    
      return body;
    }
    
    function calculateBodyPartsForScout(maxEnergy) {
      const body = [TOUGH,TOUGH,TOUGH,TOUGH,TOUGH];
    
      fullEnergy = maxEnergy - 50;
      var numberOfParts = Math.floor(fullEnergy / 50);
      
      for (let i = 0; i < numberOfParts; i++) {
        body.push(MOVE);
      }
    
      return body;
    }
    
    const maxEnergyAvailable = Game.spawns['Spawn'].room.energyCapacityAvailable;
    
    const roles = ['harvester', 'defender', 'builder', 'upgrader', 'scout'];
    const upper_roles = ['Harvester', 'Defender', 'Builder', 'Upgrader', 'Scout'];
    const limits = [4, 3, 4, 3, 1];
    
    for (let i = 0; i < roles.length; i++) {
        const role = roles[i];
        const upper_role = upper_roles[i];
        const limit = limits[i];
        const creepsOfType = _.filter(Game.creeps, (creep) => creep.memory.role == role);
        
        if(creepsOfType.length < limit)
        {
            var newName = upper_role + Game.time;
            if(role == "defender")
            {
                body = calculateBodyPartsForDefender(maxEnergyAvailable);
            }
            else if(role == "scout")
            {
                body = calculateBodyPartsForScout(maxEnergyAvailable);
            }
            else
            {
                body = calculateBodyParts(maxEnergyAvailable);
            }
            Game.spawns['Spawn'].spawnCreep(body, newName, 
            {memory: {role: role, tag:"BMHClan", main_room: Game.spawns['Spawn'].room.name}});
            break;
        }
    }
    
    if(Game.spawns['Spawn'].spawning) { 
        var spawningCreep = Game.creeps[Game.spawns['Spawn'].spawning.name];
        Game.spawns['Spawn'].room.visual.text(
            '🛠️' + spawningCreep.memory.role,
            Game.spawns['Spawn'].pos.x + 1, 
            Game.spawns['Spawn'].pos.y, 
            {align: 'left', opacity: 0.8});
    }
    
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep, 1);
        }else if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep, 0);
        }else if(creep.memory.role == 'builder') {
            roleBuilder.run(creep, 0);
        }else if(creep.memory.role == 'defender') {
            roleDefender.run(creep);
        }else if(creep.memory.role == 'scout') {
            roleScout.run(creep);
        }
    }
    
    for(var hash in Game.structures){
        var tower = Game.structures[hash]
        if(tower.structureType == STRUCTURE_TOWER){
            roleTower.run(tower);
        }
    }
}
