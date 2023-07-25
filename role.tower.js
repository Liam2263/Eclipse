var roleTower = {
    run:function(tower){
        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(closestHostile && !(closestHostile.tag == "BMHClan")) {
            tower.attack(closestHostile);
        }
    }
}

module.exports = roleTower;
