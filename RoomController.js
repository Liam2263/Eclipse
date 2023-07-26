var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleDefender = require('role.defender');
var roleTower = require('role.tower');
var roleScout = require('role.scout');
var ExtensionPlacement = require('constructionManager');

var RoomController = {

    /** @param {Creep} creep **/
    run: function(room, spawn) {
        var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
        var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
        var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
        var defenders = _.filter(Game.creeps, (creep) => creep.memory.role == 'defender');
        var scouts = _.filter(Game.creeps, (creep) => creep.memory.role == 'scouts');
        var sources = room.find(FIND_SOURCES);
        
        var needs_spawn = false
        if(spawn == "null")
        {
            needs_spawn = true
        }
        
        ExtensionPlacement.run(room, spawn, needs_spawn)
        for(var name in Memory.creeps) {
            if(!Game.creeps[name]) {
                delete Memory.creeps[name];
                console.log('Clearing non-existing creep memory:', name);
            }
        }
        
        if(needs_spawn == true)
        {
            var targets = room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_SPAWN);
                    }
            });
            spawn = targets[0];
        }
        
        all_owned_room_names = []
        totalRoomsLength = 0;
        for (roomName in Game.rooms)
        {
            const room = Game.rooms[roomName];
            if(room.controller.owner)
            {
                owner_name = room.controller.owner.username;
            }
            else
            {
                owner_name = "null"
            }
            
            if(owner_name == 'SoldierDoge')
            {
                totalRoomsLength += 1;
            }
        }
        
        //if(Game.gcl.level > totalRoomsLength)
        //{
        var all_adjacent_rooms = Game.map.describeExits(room.name);
        var roomNamesArray = Object.values(all_adjacent_rooms);
        
        for (let i = 0; i < roomNamesArray.length; i++)
        {
            var room_name = roomNamesArray[i];
            var the_room = Game.rooms[JSON.stringify(room_name)];
            if(Memory.rooms[room_name])
            {
                var status = Game.map.getRoomStatus(room_name).status;
                sources = Memory.rooms[room_name].energySources;
                //if(the_room.controller.owner.username != "SoldierDoge")
                //{
                    
                //}
            }
        }
        //}
        
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
        
        const maxEnergyAvailable = room.energyCapacityAvailable;
        
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
                spawn.spawnCreep(body, newName, 
                {memory: {role: role, tag:"BMHClan", main_room: room.name}});
                break;
            }
        }
        
        if(spawn.spawning) { 
            var spawningCreep = Game.creeps[spawn.spawning.name];
            room.visual.text(
                '🛠️' + spawningCreep.memory.role,
                spawn.pos.x + 1, 
                spawn.pos.y, 
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
};

module.exports = RoomController;
