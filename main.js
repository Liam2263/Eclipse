var MainRoomController = require('main');

module.exports.loop = function () {
    all_owned_room_names = []
    console.log('test');
    for (roomName in Game.rooms)
    {
        const room = Game.rooms[roomName];
        owner_name = room.controller.owner;
        console.log('test');
        if(owner_name == 'SoldierDoge')
        {
            var targets = room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_SPAWN;
                    }
            });
            var spawn = targets[0];
            
            MainRoomController.run(room, spawn);
        }
    }
}
