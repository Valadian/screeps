
var start = Game.cpu.getUsed()
var profiling = {}
import Harvester from "role.harvester";
var prev = start;var now = Game.cpu.getUsed(); profiling["harvester_import"] = now-prev;
//import Upgrader from "role.upgrader";
//prev = now;now = Game.cpu.getUsed(); profiling["upgrder_import"] = now-prev;
//import Builder from "role.builder";
//prev = now;now = Game.cpu.getUsed(); profiling["builder_import"] = now-prev;
import Paver from "role.paver";
prev = now;now = Game.cpu.getUsed(); profiling["paver_import"] = now-prev;
// import Claim from "role.spawn";
// prev = now;now = Game.cpu.getUsed(); profiling["spawn_import"] = now-prev;
import Courier from "role.courier";
prev = now;now = Game.cpu.getUsed(); profiling["courier_import"] = now-prev;
import Miner from "role.mining";
prev = now;now = Game.cpu.getUsed(); profiling["mining_import"] = now-prev;
import * as traveler from "Traveler";
prev = now;now = Game.cpu.getUsed(); profiling["traveler_import"] = now-prev;
import Spawning from "task.spawning";
prev = now;now = Game.cpu.getUsed(); profiling["spawning_import"] = now-prev;
import Towers from "task.towers";
prev = now;now = Game.cpu.getUsed(); profiling["towers_import"] = now-prev;
//import Infantry from "role.infantry";
//import Roamer from "role.roamer";
import Sentinel from "role.sentinel";

(Creep.prototype as any).travelTo = function(destination: {pos: RoomPosition}, options?: TravelToOptions) {
    return traveler.Traveler.travelTo(this, destination, options);
};

function runCreeps(){
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if (creep.my){
            if(creep.memory.role == Spawning.ROLE_HARVESTER) {
                Harvester.run(creep);
            }
            // if(creep.memory.role == Spawning.ROLE_UPGRADER) {
            //     Upgrader.run(creep);
            // }
            // if(creep.memory.role == Spawning.ROLE_BUILDER) {
            //     Builder.run(creep);
            // }
            if(creep.memory.role == Spawning.ROLE_PAVER) {
                Paver.run(creep);
            }
            // if(creep.memory.role == Spawning.ROLE_CLAIM) {
            //     Claim.run(creep);
            // }
            if(creep.memory.role == Spawning.ROLE_COURIER) {
                Courier.run(creep);
            }
            if(creep.memory.role == Spawning.ROLE_MINER) {
                Miner.run(creep);
            }
            // if(creep.memory.role == Spawning.ROLE_INFANTRY) {
            //     Infantry.run(creep);
            // }
            // if(creep.memory.role == Spawning.ROLE_ROAMER) {
            //     Roamer.run(creep);
            // }
            if(creep.memory.role == Spawning.ROLE_SENTINEL) {
                Sentinel.run(creep);
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
    // var log_str = "";
    // for(var name in profiling){
    //     var time = profiling[name];
    //     log_str+=" "+name+":"+profiling[name].toFixed(2)
    // }
    // console.log(log_str);
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
        Spawning.spawnNewCreeps();
    }
    if((Game.time & 63) == 0){ //every 64 ticks
        handleRoomRecovery();
    }
    var periodic = Game.cpu.getUsed()
    Towers.commandTowers();
    var tower = Game.cpu.getUsed()
    // console.log("Start: "+start+" imports: "+(update-start)+" needs: "+(needs-update)+" creeps: "+(run-needs)+" periodic: "+(periodic-run)+" towers: "+(tower-periodic))
}
function lateUpdate(){

}

var module:any;
module.exports.loop = loop;
