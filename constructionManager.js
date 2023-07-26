/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.builder');
 * mod.thing == 'a thing'; // true
 */

var ExtensionPlacement = {

    /** @param {Creep} creep **/
    run: function(room, spawn, needs_spawn) {
        if(needs_spawn)
        {
            var sources = room.find(FIND_SOURCES);
            const positions = room.lookAtArea(0,0,49,49,true);
            var made_it = false;
            for (const position in positions)
            {
                const object = positions[position];
                if(object.terrain == "plain")
                {
                    if(sources[0].pos.inRangeTo(object.x, object.y, 5))
                    {
                        room.createConstructionSite(object.x, object.y, STRUCTURE_SPAWN);
                    }
                }
            }
        }
        
	    let availableExtensions = CONTROLLER_STRUCTURES[STRUCTURE_EXTENSION][room.controller.level];
	    let extensions = room.find(FIND_MY_STRUCTURES, {filter: (s) => s.structureType == STRUCTURE_EXTENSION}).length;
	    let availableTowers = CONTROLLER_STRUCTURES[STRUCTURE_TOWER][room.controller.level];
	    let towers = room.find(FIND_MY_STRUCTURES, {filter: (s) => s.structureType == STRUCTURE_TOWER}).length;
	    
	    if(extensions < availableExtensions)
	    {
	        const positions = room.lookAtArea(0,0,49,49,true);
	        
	        for (const position in positions) {
	            const object = positions[position];
                if(object.terrain == "plain")
                {
                    if(spawn.pos.inRangeTo(object.x, object.y, 3))
                    {
                        if((object.x + object.y) % 2 === 0)
                        {
                            if(room.createConstructionSite(object.x, object.y, STRUCTURE_EXTENSION) == -7)
                            {
                                console.log('x: ' + object.x + ' y: ' + object.y)
                            }
                        }
                    }
                }
	        }
	    }
	    
	    if(towers < availableTowers)
	    {
	        const positions = room.lookAtArea(0,0,49,49,true);
	        
	        for (const position in positions) {
	            const object = positions[position];
                if(object.terrain == "plain")
                {
                    if(towers == 1)
                    {
                        controller = room.controller;
                        if(controller.pos.inRangeTo(object.x, object.y, 3))
                        {
                            if(room.createConstructionSite(object.x, object.y, STRUCTURE_TOWER) == -7)
                            {
                                console.log('x: ' + object.x + ' y: ' + object.y)
                            }
                        }
                    }
                    else
                    {
                        if(spawn.pos.inRangeTo(object.x, object.y, 3))
                        {
                            if(room.createConstructionSite(object.x, object.y, STRUCTURE_TOWER) == -7)
                            {
                                console.log('x: ' + object.x + ' y: ' + object.y)
                            }
                        }
                    }
                }
	        }
	    }
	}
};

module.exports = ExtensionPlacement;
