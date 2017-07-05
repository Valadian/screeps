export function commandTowers(){
    for(var name of Object.keys(Game.spawns)){
        var towers = Game.spawns[name].room.find<Tower>(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}});
        for(var tower of towers){
            var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS) as Creep;
            if(closestHostile) {
                tower.attack(closestHostile);
            } else {
                //console.log(tower.id+" Looking for something to repair");
                //var tower = Game.getObjectById('59561fc2aee0ff6dbfec5cb9') as Tower;
                //structure.hits < structure.hitsMax/1000
                //repair critically damaged first!
                var allCriticalRamparts = tower.room.find(FIND_MY_STRUCTURES, {
                    filter: (structure:Structure) => structure.structureType == STRUCTURE_RAMPART && structure.hits<4000
                }) as Structure[];
                //console.log("Critical Ramparts count" +allCriticalRamparts.length);
                allCriticalRamparts.sort((a:Structure,b:Structure) => a.hits - b.hits)
                var closestDamagedStructure = null;
                if(allCriticalRamparts){
                    closestDamagedStructure = allCriticalRamparts[0];
                }
                if(!closestDamagedStructure){
                    // closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                    //     filter: (structure:Structure) => structure.hits<4000 && structure.id != tower.id && structure.hits<structure.hitsMax
                    // }) as Structure;
                    var allStructures = tower.room.find(FIND_STRUCTURES, {
                        filter: (structure:Structure) => structure.id != tower.id && structure.hits<structure.hitsMax
                    }) as Structure[];
                    allStructures.sort((a:Structure,b:Structure)=>a.hits-b.hits);
                    if(allStructures.length>0){
                        closestDamagedStructure = allStructures[0]
                    }
                }
                
                //console.log("Other structures <4000" +closestDamagedStructure);
                if(!closestDamagedStructure){
                    closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                        filter: (structure:Structure) => structure.hits<50000 && structure.hits < structure.hitsMax*0.75 && structure.id != tower.id && structure.hits<structure.hitsMax
                    }) as Structure;
                }
                //console.log("Other structures <50000" +closestDamagedStructure);
                if(closestDamagedStructure!=undefined) {
                    var ret = tower.repair(closestDamagedStructure);
                    if(ret!=0 && ret!=-6){
                        console.log("tower.repair ret = "+ret);
                    }
                }
            }

        }
    }
}