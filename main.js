var MainRoomController = require('RoomController');

module.exports.loop = function () {
    all_owned_room_names = []
    for (roomName in Game.rooms)
    {
        const room = Game.rooms[roomName];
        owner_name = room.controller.owner.username;
        if(owner_name == 'SoldierDoge')
        {
            var targets = room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_SPAWN);
                    }
            });
            
            if(targets.length == 0)
            {
                var spawn = "null";
                
                MainRoomController.run(room, spawn);
            }
            else
            {
                var spawn = targets[0];
                
                MainRoomController.run(room, spawn);
            }
        }
    }
}
