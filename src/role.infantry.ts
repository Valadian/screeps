export default class Infantry{ 
    public static run(creep:Creep) {
        for(var name of Object.keys(Game.flags)){
            var isDestroy = name.toLowerCase().startsWith("destroy")
            if(isDestroy){
                //console.log("found claim flag")
                var flag = Game.flags[name];
                if(flag.room == undefined){
                    //console.log("moving to claim flag room")
                    creep.travelTo(flag,{useFindRoute:true,allowHostile:true,ensurePath:true,maxRooms:4})
                } else {
                    //console.log("claiming controller")
                    if(flag.room == creep.room){
                        var hostileStruct = flag.pos.findClosestByRange<Structure>(FIND_HOSTILE_STRUCTURES);
                        if(hostileStruct){
                            if(creep.attack(hostileStruct)==ERR_NOT_IN_RANGE){
                                creep.travelTo(hostileStruct);
                            }

                        } else {
                            flag.remove()
                            creep.say("no structures remaining in room");
                        }
                    }
                }
            }
        }
    }
}