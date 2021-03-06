import SourceUtil from "util.source" 
import Worker from "caste.worker" 
import Miner from "role.mining" 
export default class Paver{
    public static run(creep:Creep) {

        if(creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
            creep.memory.mode = "harvest"
            creep.say('\uD83D\uDD04 harvest');//🔄
        }
        if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
            creep.memory.building = true;
            creep.memory.mode = "building"
            creep.say('\uD83D\uDEA7 build'); //🚧
        }

        if(creep.memory.building) {
            delete creep.memory.source;
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
            if(creep.room.controller.ticksToDowngrade<10000){
                if(creep.upgradeController(creep.room.controller as StructureController) == ERR_NOT_IN_RANGE) {
                    creep.travelTo(creep.room.controller as StructureController);
                }
            } else {
                var targets = creep.room.find(FIND_CONSTRUCTION_SITES) as ConstructionSite[];
                if(targets.length) {
                    if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                        creep.travelTo(targets[0]);//, {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                } else {
                    //var found = worker.deliverEnergyToTowerExtensionSpawnStorage(creep,true);
                    //if(!found){
                        if(creep.upgradeController(creep.room.controller as StructureController) == ERR_NOT_IN_RANGE) {
                            creep.travelTo(creep.room.controller as StructureController);//, {visualizePathStyle: {stroke: '#ffffff'}});
                        }
                    //}
                    if(creep.memory.autopave==true && creep.pos.look()[0].type!='structure'){ // TODO: Look at all things? Not only first 
                        creep.room.createConstructionSite(creep.pos.x, creep.pos.y, STRUCTURE_ROAD);
                    }
                }
            }
        }
        else {
            // if(creep.memory.source==undefined){
            //     creep.memory.source=sourceUtil.findsourceid(creep);
            //     creep.say("Source: "+creep.memory.source.substring(21,24));
            // }
            // //var sources = creep.room.find(FIND_SOURCES) as Source[];
            // var source = Game.getObjectById(creep.memory.source) as Source;
            // //var sources = creep.room.find(FIND_SOURCES) as Source[];
            // if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
            //     creep.travelTo(source,{maxRooms:1});//, {visualizePathStyle: {stroke: '#ffaa00'}});
            // }
            if(creep.room.storage == undefined || creep.room.storage.store[RESOURCE_ENERGY]==0 || Worker.getFromStorage(creep)==ERR_NOT_ENOUGH_ENERGY){
                Miner.mineSource(creep)
            }
        }
    }
    //Need to refactor to auto find things to travel between
    private static autoPaving(creep){
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