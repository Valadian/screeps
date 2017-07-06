/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('util.source');
 * mod.thing == 'a thing'; // true
 */
var DIRS = [{x:0,y:-1},{x:1,y:-1},{x:0,y:1},{x:1,y:1},{x:0,y:1},{x:-1,y:1},{x:-1,y:0},{x:-1,y:-1}]
export function findsourceid(creep:Creep): string{
    var sources = creep.room.find(FIND_SOURCES) as Source[];
    // sources.sort((a,b)=> b.energy - a.energy);
    // return sources[0].id;
    var source_ratios = {}
    for(var source of sources){
        if(!Memory.source_harvest_slots){
            Memory.source_harvest_slots = {}
        }
        if(!Memory.source_harvest_slots[source.id]){
            var terrain = creep.room.lookForAtArea(LOOK_TERRAIN,source.pos.y-1,source.pos.x-1,source.pos.y+1,source.pos.x+1,true) as LookAtResultWithPos[];
            terrain = terrain.filter((t)=>t.terrain=="wall")
            Memory.source_harvest_slots[source.id]=9-terrain.length;
        }
        if(source.energy>0){
            //look in 5x5 area for waiting creeps (can catch passerbys)
            var results = creep.room.lookForAtArea(LOOK_CREEPS,source.pos.y-2,source.pos.x-2,source.pos.y+2,source.pos.x+2,true) as LookAtResultWithPos[];
            var num_harvesting = results.map((result) => result.creep).filter((creep:Creep) => creep.memory!=undefined && creep.memory.mode=="harvest").length;
            source_ratios[source.id] = num_harvesting/Memory.source_harvest_slots[source.id];
        }
    }
    var items = Object.keys(source_ratios).map(function(key) {
        return [key, source_ratios[key]];
    });
    items.sort(function(first, second) {
        var first_pos = (Game.getObjectById(first[0]) as Source).pos;
        var second_pos = (Game.getObjectById(second[0]) as Source).pos
        var first_dist = Math.sqrt(Math.pow(first_pos.x-creep.pos.x,2))+Math.sqrt(Math.pow(first_pos.y-creep.pos.y,2));
        var second_dist = Math.sqrt(Math.pow(second_pos.x-creep.pos.x,2))+Math.sqrt(Math.pow(second_pos.y-creep.pos.y,2));
        return first_dist - second_dist;
    });
    items.sort(function(first, second) {
        return first[1] - second[1];
    });
    if(items){
        return items[0][0];
    } else {
        return undefined;
    }
}
