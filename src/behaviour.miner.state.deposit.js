var styles = require("path.styles");

const state = {
    name: "deposit",
    state: {
        update: update,
        action: action,
    },
};

function update(creep) {
    if(creep.carry.energy == 0) {
        creep.memory.state = "mining";
    }
}

function action(creep) {
    var depositTargets = creep.room.find(FIND_STRUCTURES, { filter: (structure) => { return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) && structure.energy < structure.energyCapacity; } });
    
    if(depositTargets.length > 0) {
        if(creep.transfer(depositTargets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(depositTargets[0], styles.MINER);
        }
    } else if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
        creep.moveTo(creep.room.controller, styles.MINER);
    }
}

module.exports = state;