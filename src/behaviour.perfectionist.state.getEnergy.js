var styles = require("path.styles");

const state = {
    name: "getEnergy",
    state: {
        update: update,
        action: action,
    },
};

function update(creep) {
    if(creep.carry.energy == creep.carryCapacity) {
        creep.memory.state = "upgrade";
    }
}

function action(creep) {
    var sources = creep.room.find(FIND_SOURCES);
    var structures = creep.room.find(FIND_STRUCTURES, { filter: (structure) => { return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) && structure.energy >= creep.carryCapacity; } });
    if(creep.withdraw(structures[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        creep.moveTo(structures[0], styles.PERFECTIONIST);
    } else if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
        creep.moveTo(sources[0], styles.PERFECTIONIST);
    }
}

module.exports = state;