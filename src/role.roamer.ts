//Game.spawns["Home"].createCreep([MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,WORK,WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY],"roamer"+Game.time.toString(),{role:"roamer"})
import Worker from "caste.worker" 
import Miner from "role.mining" 
export default class Roamer{ 
    public static run(creep:Creep) {
        if(!creep.memory.building && creep.room.storage!=undefined && creep.room.storage.store.energy>0 && creep.carry.energy<creep.carryCapacity){
            Worker.getFromStorage(creep);
        } else {
            for(var name of Object.keys(Game.flags)){
                var isBuild = name.toLowerCase().startsWith("build")
                if(isBuild){
                    console.log("found build flag")
                    var flag = Game.flags[name];
                    if(flag.room == undefined || flag.room!=creep.room){
                        console.log("moving to build flag room")
                        creep.travelTo(flag,{useFindRoute:true,allowHostile:true,ensurePath:true,maxRooms:4})
                    } else {
                        console.log("building")
                        if(flag.room == creep.room){
                            Roamer.DoBuild(creep,flag)
                        }
                    }
                    break;
                }
            }
        }
    }
    private static DoBuild(creep:Creep, flag:Flag){
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
            var construction = flag.pos.findClosestByRange<ConstructionSite>(FIND_CONSTRUCTION_SITES);
            if(construction){
                if(creep.build(construction)==ERR_NOT_IN_RANGE){
                    creep.travelTo(construction);
                }
            } else {
                //flag.remove()
                creep.say("no constructions remaining in room");
            }
        } else {
            if(creep.room.storage == undefined || creep.room.storage.store[RESOURCE_ENERGY]==0 || Worker.getFromStorage(creep)==ERR_NOT_ENOUGH_ENERGY){
                Miner.mineSource(creep)
            }
        }
    }
}