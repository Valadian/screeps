import SourceUtil from "util.source" 
import Worker from "caste.worker" 
export default class Miner{
    public static run(creep:Creep) {
        Worker.checkEnergy(creep);
        if (creep.memory.mode == undefined || creep.carry.energy==0){
            creep.memory.mode = Worker.HARVEST;
        } else if(creep.carryCapacity - creep.carry.energy < creep.getActiveBodyparts(WORK)  || (creep.memory.source!=undefined && creep.carry.energy>0 && Game.getObjectById(creep.memory.source) as Source).energy==0){
            creep.memory.mode = Worker.DELIVER;
            // if(creep.memory.dropoff == undefined){
            //     var filter = (structure:Structure)=>structure.structureType==STRUCTURE_CONTAINER || structure.structureType==STRUCTURE_STORAGE;
            //     creep.memory.dropoff = creep.pos.findClosestByRange<Structure>(FIND_MY_STRUCTURES,{filter:filter}).id;
            // }
        }
        if(creep.memory.mode == Worker.HARVEST) {
            Miner.mineSource(creep)
        }
        else if (creep.memory.mode == Worker.DELIVER){
            Miner.forgetSource(creep)
            // if(creep.memory.dropoff){

            // } else {
                var couriers = creep.room.find(FIND_MY_CREEPS,{filter: {memory:{role:"courier"}}})
                if(couriers.length>0){
                    Worker.deliverToStorage(creep)
                } else {
                    Worker.deliverEnergyToTowerExtensionSpawnStorage(creep,false,false);
                }
            // }
        }
    }
    public static mineSource(creep){
        if(creep.memory.source==undefined){
            creep.memory.source=SourceUtil.findsourceid(creep);
            if(creep.memory.source==undefined){
                return;
            }
            creep.say("Source: "+creep.memory.source.substring(21,24));
        }
        //var sources = creep.room.find(FIND_SOURCES) as Source[];
        var source = Game.getObjectById(creep.memory.source) as Source;
        if(source.energy==0){
            Miner.forgetSource(creep)
        }
        var err = creep.harvest(source);
        if(err == ERR_NOT_IN_RANGE || err == ERR_NOT_ENOUGH_ENERGY) {
            creep.travelTo(source);//, {visualizePathStyle: {stroke: '#ffaa00'}});
        }
    }
    public static forgetSource(creep:Creep){
        delete creep.memory.source;
    }
}