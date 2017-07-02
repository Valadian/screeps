import * as roleHarvester from "role.harvester";
import * as roleUpgrader from "role.upgrader";
import * as roleBuilder from "role.builder";
import * as rolePaver from "role.paver";
import * as traveler from "Traveler";

(Creep.prototype as any).travelTo = function(destination: {pos: RoomPosition}, options?: TravelToOptions) {
    return traveler.Traveler.travelTo(this, destination, options);
};

function loop() {
    
    var tower = Game.getObjectById('59561fc2aee0ff6dbfec5cb9') as Tower;
    if(tower) {
         //structure.hits < structure.hitsMax/1000
        var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure:Structure) => structure.hits<1500 && structure.hits < structure.hitsMax/2
        }) as Structure;
        if(closestDamagedStructure) {
            tower.repair(closestDamagedStructure);
        }

        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS) as Creep;
        if(closestHostile) {
            tower.attack(closestHostile);
        }
    }
    Memory.role_count = {}
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
            Memory.role_count['harvester']+=1;
            roleHarvester.run(creep);
        }
        if(creep.memory.role == 'upgrader') {
            Memory.role_count['upgrader']+=1;
            roleUpgrader.run(creep);
        }
        if(creep.memory.role == 'builder') {
            Memory.role_count['builder']+=1;
            roleBuilder.run(creep);
        }
        if(creep.memory.role == 'paver') {
            Memory.role_count['paver']+=1;
            rolePaver.run(creep);
        }
    }
    var L3_800_Worker = [MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY];
    var L3_800_OFFROAD_Worker = [MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY];
    var L2_550_Worker = [MOVE, MOVE, MOVE, WORK, WORK, CARRY,CARRY,CARRY, CARRY];
    var L2_550_OFFROAD_Work_Carry = [MOVE,MOVE,MOVE,MOVE,MOVE,WORK,WORK,CARRY,CARRY];
    var L1_300_Worker = [MOVE,MOVE,MOVE,MOVE,MOVE,WORK,WORK,CARRY,CARRY];

    var energy = Game.spawns["Home"].room.energyAvailable;
    var level = Game.spawns["Home"].room.controller.level;
    if (level>=3){
        if(!checkThenSpawn('harvester',3,L3_800_Worker,energy)){}
        else if(!checkThenSpawn('upgrader',1,L3_800_Worker,energy)){}
        else if(!checkThenSpawn('harvester',5,L3_800_Worker,energy)){}
        else if(!checkThenSpawn('paver',2,L3_800_OFFROAD_Worker,energy)){}
        else if(!checkThenSpawn('harvester',3,L3_800_Worker,energy)){}
        else if(!checkThenSpawn('upgrader',10,L3_800_Worker,energy)){}
    }
}

var COSTS: {[id:string]:number} = {};
COSTS[MOVE] = 50;
COSTS[WORK] = 100;
COSTS[CARRY] = 50;
function checkThenSpawn(role:string, limit:number, body:string[], energyAvailable:number){
    var cost:number = body.map((part) => COSTS[part]).reduce((sum, next) => sum + next);
    if(Memory.role_count[role]<limit && energyAvailable>=cost){
        Game.spawns["Home"].createCreep(body,role + Game.time.toString(),{role:role});
        return true;
    }
    return false;
}
var module:any;
module.exports.loop = loop;