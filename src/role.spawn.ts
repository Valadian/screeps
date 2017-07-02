export function run(creep:Creep) {
    var flag = creep.pos.findClosestByPath(FIND_FLAGS) as Flag;
    if(creep.claimController(flag.room.controller) == ERR_NOT_IN_RANGE){
        creep.travelTo(flag.room.controller)
    }
}