var roleDefender = {
    run: function (creep) {
        var enemies = creep.room.find(FIND_HOSTILE_CREEPS);
        if(enemies.length > 0)
        {
            closest_enemy = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            if(creep.pos.inRangeTo(closest_enemy, 1))
            {
                creep.attack(closest_enemy);
            }
            else
            {
                console.log("YEAA");
                if(creep.rangedAttack(closest_enemy) == ERR_NOT_IN_RANGE)
                {
                    creep.moveTo(closest_enemy);
                }
            }
        }
        else
        {
            creep.moveTo(22, 24, { visualizePathStyle: { stroke: '#ffffff' } });
        }
    }
};

module.exports = roleDefender;
