var styles = require("path.styles");
var minerManager = require("manager.miner");

const state = {
    name: "mining",
    state: {
        update: update,
        action: action,
    },
};

function update(creep) {
    if(creep.carry.energy == creep.carryCapacity) {
        creep.memory.state = "deposit";
    }
}

function action(creep) {
    minerManager.getAssignment(creep);
    var source = Game.getObjectById(creep.memory.assignedSource);
    if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
        creep.moveTo(source, styles.MINER);
    }
}

module.exports = state;