"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sourceUtil = require("util.source");
const worker = require("caste.worker");
function run(creep) {
    worker.checkEnergy(creep);
    if (creep.memory.mode == undefined || creep.carry.energy == 0) {
        creep.memory.mode = worker.HARVEST;
    }
    else if (creep.carry.energy == creep.carryCapacity || (creep.memory.source != undefined && creep.carry.energy > 0 && Game.getObjectById(creep.memory.source)).energy == 0) {
        creep.memory.mode = worker.DELIVER;
    }
    if (creep.memory.mode == worker.HARVEST) {
        mineSource(creep);
    }
    else if (creep.memory.mode == worker.DELIVER) {
        forgetSource(creep);
        worker.deliverToStorage(creep);
    }
}
exports.run = run;
function mineSource(creep) {
    if (creep.memory.source == undefined) {
        creep.memory.source = sourceUtil.findsourceid(creep);
        creep.say("Source: " + creep.memory.source.substring(21, 24));
    }
    var source = Game.getObjectById(creep.memory.source);
    if (source.energy == 0) {
        forgetSource(creep);
    }
    var err = creep.harvest(source);
    if (err == ERR_NOT_IN_RANGE || err == ERR_NOT_ENOUGH_ENERGY) {
        creep.travelTo(source);
    }
}
exports.mineSource = mineSource;
function forgetSource(creep) {
    delete creep.memory.source;
}
exports.forgetSource = forgetSource;
