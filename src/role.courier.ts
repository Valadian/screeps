//import * as sourceUtil from "util.source" 
import Worker from "caste.worker" 
export default class Courier extends Worker{
    public static run(creep:Creep) {
        Worker.checkEnergy(creep);
        if (creep.memory.mode == undefined || creep.carry.energy==0){
            creep.memory.mode = Worker.PICKUP;
        } else if(creep.carry.energy == creep.carryCapacity){ // || (creep.memory.source!=undefined && creep.carry.energy>0
            creep.memory.mode = Worker.DELIVER;
        }
        if(creep.memory.mode == Worker.PICKUP) {
            var dropped = creep.room.find(FIND_DROPPED_RESOURCES) as Resource[]
            if(dropped.length>0){
                //console.log("Something dropped")
                if(creep.pickup(dropped[0])==ERR_NOT_IN_RANGE){
                    creep.travelTo(dropped[0].pos);
                }
            } else {
                //console.log("nothing dropped")
                var nonenergy_resource = undefined;
                for(var name in Object.keys(creep.carry)){
                    if(name!=RESOURCE_ENERGY && creep.carry[name]>0){
                        nonenergy_resource=name;
                    }    
                }
                if(nonenergy_resource){
                    //console.log("something to drop off")
                    if(creep.transfer(creep.room.storage,name)==ERR_NOT_IN_RANGE){
                        creep.travelTo(creep.room.storage);
                    }
                } else {
                    //console.log("nothing to drop off")
                    var err = Worker.getFromStorage(creep)
                    if(err==ERR_NOT_ENOUGH_ENERGY){
                        creep.memory.mode = Worker.DELIVER;
                    }
                }
            }
        }
        else if (creep.memory.mode == Worker.DELIVER){
            if(creep.ticksToLive<100){
                var spawns = creep.room.find<Spawn>(FIND_MY_SPAWNS)
                if(spawns.length>0){
                    if(spawns[0].renewCreep(creep)==ERR_NOT_IN_RANGE){
                        creep.travelTo(spawns[0]);
                    }
                }
            }
            Worker.deliverEnergyToTowerExtensionSpawnStorage(creep,false,true);
        }
    }
}