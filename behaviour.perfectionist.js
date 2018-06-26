var upgradeState = require("behaviour.perfectionist.state.upgrade");
var getEnergyState = require("behaviour.perfectionist.state.getEnergy");

const states = {
    [upgradeState.name]: upgradeState.state,
    [getEnergyState.name]: getEnergyState.state,
}

var behaviour = {
    name: "perfectionist",
    behaviour: function(creep) {
        updateState(creep);
        act(creep);
    },
}

function updateState(creep) {
    if(creep.memory.state == undefined) {
        creep.memory.state = getEnergyState.name;
    }
    
    states[creep.memory.state].update(creep);
}

function act(creep) {
    states[creep.memory.state].action(creep);
}

module.exports = behaviour;