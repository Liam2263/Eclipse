var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep, source_index) {
        
        if(creep.memory.upgrading && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.upgrading = false;
            creep.say('🔄 harvest');
	    }
	    if(!creep.memory.upgrading && creep.store.getFreeCapacity() == 0) {
	        creep.memory.upgrading = true;
	        creep.say('⚡ upgrade');
	    }

	    if(creep.memory.upgrading) {
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
        else {
            var sources = creep.room.find(FIND_SOURCES);
            if(creep.harvest(sources[source_index]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[source_index], {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
	}
};

module.exports = roleUpgrader;
