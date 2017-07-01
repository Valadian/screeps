/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('util.source');
 * mod.thing == 'a thing'; // true
 */
DIRS = [[0,-1],[1,-1],[0,1],[1,1],[0,1],[-1,1],[-1,0],[-1,-1]]
module.exports = {
    findsource = function(creep){
        sources = creep.room.find(FIND_SOURCES);
        for(var i in sources){
            var source = sources[i];
            if(!Memory.source_harvest_slots){
                Memory.source_harvest_slots = {}
            }
            if(!Memory.source_harvest_slots[source.id]){
                for(var i in DIRS){
                    var offset = DIRS[i];
                }
            }
        }
        if(!Memory.source_repo){
            Memory.source_repo = {}
        }
        if(!Memory.source_repo[creep.room]){
            // Initialize source information
            for()
        }
    }
};