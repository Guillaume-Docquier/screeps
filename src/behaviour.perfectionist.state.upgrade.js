var styles = require("path.styles");

const state = {
    name: "upgrade",
    state: {
        update: update,
        action: action,
    },
};

function update(creep) {
    if(creep.carry.energy == 0) {
        creep.memory.state = "getEnergy";
    }
}

function action(creep) {
    if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
        creep.moveTo(creep.room.controller, styles.PERFECTIONIST);
    }
}

module.exports = state;