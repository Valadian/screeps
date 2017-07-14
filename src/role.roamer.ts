export default class Roamer{ 
    public static run(creep:Creep) {
        for(var name of Object.keys(Game.flags)){
            var isBuild = name.toLowerCase().startsWith("build")
            if(isBuild){
                //console.log("found claim flag")
                var flag = Game.flags[name];
                if(flag.room == undefined || flag.room!=creep.room){
                    //console.log("moving to claim flag room")
                    creep.travelTo(flag,{useFindRoute:true,allowHostile:true,ensurePath:true,maxRooms:4})
                } else {
                    //console.log("claiming controller")
                    if(flag.room == creep.room){
                        var construction = flag.pos.findClosestByRange<ConstructionSite>(FIND_CONSTRUCTION_SITES);
                        if(construction){
                            if(creep.build(construction)==ERR_NOT_IN_RANGE){
                                creep.travelTo(construction);
                            }
                        } else {
                            flag.remove()
                            creep.say("no constructions remaining in room");
                        }
                    }
                }
                break;
            }
        }
    }
}