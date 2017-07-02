/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('util.source');
 * mod.thing == 'a thing'; // true
 */
var DIRS = [{x:0,y:-1},{x:1,y:-1},{x:0,y:1},{x:1,y:1},{x:0,y:1},{x:-1,y:1},{x:-1,y:0},{x:-1,y:-1}]
export function findsource(creep:Creep){
    var sources = creep.room.find(FIND_SOURCES) as Source[];
    for(var i in sources){
        var source = sources[i];
        if(!Memory.source_harvest_slots){
            Memory.source_harvest_slots = {}
        }
        if(!Memory.source_harvest_slots[source.id]){
            var terrain = creep.room.lookForAtArea('terrain',source.pos.y-1,source.pos.x-1,source.pos.y+1,source.pos.x+1,true)
            Memory.source_harvest_slots[source.id]=9-(terrain as LookAtResultWithPos[]).length;
        }
    }
}