var roleScout = {
    run: function (creep) {
        if(creep.room.name == creep.memory.main_room)
        {
            var all_adjacent_rooms = Game.map.describeExits(creep.room.name);
            var roomNamesArray = Object.values(all_adjacent_rooms);
            var ScoutTried = false;
            for (let i = 0; i < roomNamesArray.length; i++)
            {
                var room_name = roomNamesArray[i];
                if(!Memory.rooms[room_name])
                {
                    ScoutTried = true;
                    creep.memory.scouting_room = room_name;
                    exitDir = creep.room.findExitTo(room_name);
                    const exit = creep.pos.findClosestByRange(exitDir);
                    creep.moveTo(exit);
                }
            }
            
            if(ScoutTried == false)
            {
                creep.moveTo(22, 24, { visualizePathStyle: { stroke: '#ffffff' } });
            }
        }
        else
        {
            var sources = creep.room.find(FIND_SOURCES).length;
            Memory.rooms[creep.room.name] = {name: room_name, energySources: JSON.stringify(sources)}
            exitDir = creep.room.findExitTo(creep.memory.main_room);
            const exit = creep.pos.findClosestByRange(exitDir);
            creep.moveTo(exit);
        }
    }
};

module.exports = roleScout;
