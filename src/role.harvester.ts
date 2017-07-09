import SourceUtil from "util.source" 
import Worker from "caste.worker" 
import Miner from "role.mining" 
export default class Harvester{
    public static run(creep:Creep) {
        Worker.checkEnergy(creep);
        if (creep.memory.mode == undefined || creep.carry.energy==0){
            creep.memory.mode = Worker.HARVEST;
        } else if(creep.carry.energy == creep.carryCapacity || (creep.memory.source!=undefined && creep.carry.energy>0 && Game.getObjectById(creep.memory.source) as Source).energy==0){
            creep.memory.mode = Worker.DELIVER;
        }
        if(creep.memory.mode == Worker.HARVEST) {
            Miner.mineSource(creep)
        }
        else if (creep.memory.mode == Worker.DELIVER){
            Miner.forgetSource(creep)
            Worker.deliverEnergyToTowerExtensionSpawnStorage(creep,true)
        }
    }
}
