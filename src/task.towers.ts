export function commandTowers(){
    for(var name of Object.keys(Game.spawns)){
        var towers = Game.spawns[name].room.find<Tower>(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}});
        for(var tower of towers){
            var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS) as Creep;
            if(closestHostile) {
                tower.attack(closestHostile);
            }
            //var tower = Game.getObjectById('59561fc2aee0ff6dbfec5cb9') as Tower;
            //structure.hits < structure.hitsMax/1000
            //repair critically damaged first!
            var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure:StructureRampart) => structure.structureType == STRUCTURE_RAMPART && structure.hits<4000
            }) as Structure;
            if(!closestDamagedStructure){
                closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (structure:Structure) => structure.hits<4000
                }) as Structure;
            }
            if(!closestDamagedStructure){
                closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (structure:Structure) => structure.hits<50000 && structure.hits < structure.hitsMax*0.75
                }) as Structure;
            }
            if(closestDamagedStructure) {
                tower.repair(closestDamagedStructure);
            }

        }
    }
}