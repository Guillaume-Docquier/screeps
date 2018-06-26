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
    if(miners.length < max) {
        Game.spawns['Home'].spawnCreep([WORK, CARRY, MOVE, MOVE], behaviour + Game.time, { memory: { behaviour: behaviour } });
    }
}

function makeBabyPerfectionists(max)
{
    var behaviour = roles.names.PERFECTIONIST;
    var perfectionists = findCreeps(behaviour);
    if(perfectionists.length < max) {
        Game.spawns['Home'].spawnCreep([WORK, CARRY, MOVE, MOVE], behaviour + Game.time, { memory: { behaviour: behaviour } });
    }
}

function goToWork()
{
    minerManager.scanSources();
    for(var name in Game.creeps) {
        Game.creeps[name].work();
    }
}

function findCreeps(behaviour)
{
    return _.filter(Game.creeps, (creep) => creep.memory.behaviour == behaviour);
}

module.exports = { loop: loop };