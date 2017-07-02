
export function run(creep:Creep) {

    if(creep.memory.building && creep.carry.energy == 0) {
        creep.memory.building = false;
        creep.say('\uD83D\uDD04 harvest');//🔄
    }
    if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
        creep.memory.building = true;
        creep.say('\uD83D\uDEA7 build'); //🚧
    }

    if(creep.memory.building) {
        // var targets = creep.room.find(FIND_STRUCTURES);
        // if(targets.length){
        //     targets = targets.filter(function(target){
        //         return (target.structureType==STRUCTURE_WALL || target.structureType==STRUCTURE_ROAD) && target.hit<1500;
        //     })
        //     if(targets.length){
        //         targets = targets.sort(function(a,b){
        //             return Math.floor(a.hits/500)-Math.floor(b.hits/500);
        //         });
        //         var target = targets[0];
        //         if(creep.repair(target) == ERR_NOT_IN_RANGE) {
        //             creep.moveTo(target, {visualizePathStyle: {stroke: '#00ff00'}});
        //         }
        //         return;
        //     }
        //     //for(var i in targets){
        //     //    var target = targets[i];
        //         //if(target.structureType==STRUCTURE_WALL && target.hits<1000){
        //         //    if(creep.repair(target) == ERR_NOT_IN_RANGE) {
        //         //        creep.moveTo(target, {visualizePathStyle: {stroke: '#00ff00'}});
        //         //    }
        //         //    return;
        //         //}
        //         //if(target.structureType==STRUCTURE_RAMPART && target.hits<5000){
        //         //    if(creep.repair(target) == ERR_NOT_IN_RANGE) {
        //         //        creep.moveTo(target, {visualizePathStyle: {stroke: '#00ff00'}});
        //             // }
        //             // return;
        //     //     }
        //     // }
        // }
        var targets = creep.room.find(FIND_CONSTRUCTION_SITES) as ConstructionSite[];
        if(targets.length) {
            if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                creep.travelTo(targets[0]);//, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        } else {
            if(creep.pos.look()[0].type!='structure'){ // TODO: Look at all things? Not only first 
                creep.room.createConstructionSite(creep.pos.x, creep.pos.y, STRUCTURE_ROAD);
            }
            var path = creep.pos.findPathTo(creep.room.controller as StructureController); //Game.spawns["Home"].pos); //creep.room.controller
            for(var i in path){
                var target = path[i];
                
                var pos = creep.room.getPositionAt(target.x, target.y);
                if(pos){
                    var things = pos.look()
                    var isroad = false;
                    for(var i in things){
                        var thing = things[i];
                        if(thing.type=='structure'){
                            isroad = true;
                        }
                    }
                    if(!isroad){
                        creep.room.createConstructionSite(target.x, target.y, STRUCTURE_ROAD);
                        break;
                    }
                }
            }
        }
    }
    else {
        var sources = creep.room.find(FIND_SOURCES) as Source[];
        if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
            creep.travelTo(sources[0]);//, {visualizePathStyle: {stroke: '#ffaa00'}});
        }
    }
}