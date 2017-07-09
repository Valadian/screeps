
var start = Game.cpu.getUsed()
import * as roleHarvester from "role.harvester";
import * as roleUpgrader from "role.upgrader";
import * as roleBuilder from "role.builder";
import * as rolePaver from "role.paver";
import * as roleClaim from "role.spawn";
import * as roleCourier from "role.courier";
import * as roleMiner from "role.mining";
// import * as traveler from "Traveler";
import * as creeps from "task.spawning";
import * as towers from "task.towers";

// (Creep.prototype as any).travelTo = function(destination: {pos: RoomPosition}, options?: TravelToOptions) {
//     return traveler.Traveler.travelTo(this, destination, options);
// };

function runCreeps(){
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if (creep.my){
            if(creep.memory.role == creeps.ROLE_HARVESTER) {
                roleHarvester.run(creep);
            }
            if(creep.memory.role == creeps.ROLE_UPGRADER) {
                roleUpgrader.run(creep);
            }
            if(creep.memory.role == creeps.ROLE_BUILDER) {
                roleBuilder.run(creep);
            }
            if(creep.memory.role == creeps.ROLE_PAVER) {
                rolePaver.run(creep);
            }
            if(creep.memory.role == creeps.ROLE_CLAIM) {
                roleClaim.run(creep);
            }
            if(creep.memory.role == creeps.ROLE_COURIER) {
                roleCourier.run(creep);
            }
            if(creep.memory.role == creeps.ROLE_MINER) {
                roleMiner.run(creep);
            }
        }
    }
}

var MAX_CREEPS = 9;
function calculateNeeds(){
    for(var name of Object.keys(Game.spawns)){
        var spawn = Game.spawns[name];
        spawn.memory.needsHarvester = spawn.energy<spawn.energyCapacity;
        spawn.memory.needsPavers = spawn.room.find<ConstructionSite>(FIND_CONSTRUCTION_SITES).length > 0;
    }
}
function handleRoomRecovery(){
    for(var name of Object.keys(Game.spawns)){
        var spawn = Game.spawns[name];
        if (spawn.room.energyAvailable>200 && spawn.room.find(FIND_MY_CREEPS).length == 0 && spawn.room.find(FIND_HOSTILE_CREEPS).length==0){
            //console.log("Everyone is dead")
            //You all dead?
            var size = Math.floor(spawn.room.energyAvailable/200);
            var body = [];
            //console.log("Spawning "+size+" worker")
            for (var i = 0; i<size; i++){
                body.push(WORK);
                body.push(MOVE);
                body.push(CARRY);
            }
            var workername = spawn.createCreep(body,"worker"+Game.time.toString(),{role:"harvester",caste:"worker"});
            //console.log("Named: "+workername);
        }
    }
}
function loop() {
    preUpdate();
    update();
    lateUpdate();
}
function preUpdate(){
    for(var name in Memory.creeps){

    }
}
function update(){
    var update = Game.cpu.getUsed()
    calculateNeeds();
    var needs = Game.cpu.getUsed()
    runCreeps();
    var run = Game.cpu.getUsed()
    if((Game.time & 7) == 0){

    }
    if((Game.time & 15) == 0){ //every 16 ticks
        creeps.spawnNewCreeps();
    }
    if((Game.time & 63) == 0){ //every 64 ticks
        handleRoomRecovery();
    }
    var periodic = Game.cpu.getUsed()
    towers.commandTowers();
    var tower = Game.cpu.getUsed()
    console.log("Start: "+start+" imports: "+(update-start)+" needs: "+(needs-update)+" creeps: "+(run-needs)+" periodic: "+(periodic-run)+" towers: "+(tower-periodic))
}
function lateUpdate(){

}

var module:any;
module.exports.loop = loop;
