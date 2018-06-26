var roles = require("roles");
var minerManager = require("manager.miner");

Creep.prototype.work = function() {
    roles.behaviours[this.memory.behaviour](this);
}

const loop = function() {
    readTheNews();
    goToWork();
    makeBabies();
}

function readTheNews() {
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
        }
    }
}

function makeBabies()
{
    makeBabyMiners(8);
    makeBabyPerfectionists(2);
}

function makeBabyMiners(max)
{
    var behaviour = roles.names.MINER;
    var miners = findCreeps(behaviour);
    var spawn = Game.spawns['Home'];
    if(miners.length < max) {
        spawn.spawnCreep([WORK, CARRY, MOVE, MOVE], behaviour + Game.time, { memory: { behaviour: behaviour, assignedRoom: spawn.room.name } });
    }
}

function makeBabyPerfectionists(max)
{
    var behaviour = roles.names.PERFECTIONIST;
    var perfectionists = findCreeps(behaviour);
    var spawn = Game.spawns['Home'];
    if(perfectionists.length < max) {
        spawn.spawnCreep([WORK, CARRY, MOVE, MOVE], behaviour + Game.time, { memory: { behaviour: behaviour, assignedRoom: spawn.room.name } });
    }
}

function goToWork()
{
    minerManager.scanSources();
    for(var name in Game.creeps) {
        if(Game.creeps[name].memory.assignedRoom == undefined) {
            Game.creeps[name].memory.assignedRoom = Game.spawns['Home'].room.name;
        }
        
        Game.creeps[name].work();
    }
}

function findCreeps(behaviour)
{
    return _.filter(Game.creeps, (creep) => creep.memory.behaviour == behaviour);
}

module.exports = { loop: loop };
