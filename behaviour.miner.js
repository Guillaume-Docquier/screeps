var miningState = require("behaviour.miner.state.mining");
var depositState = require("behaviour.miner.state.deposit");

const states = {
    [miningState.name]: miningState.state,
    [depositState.name]: depositState.state,
}

var behaviour = {
    name: "miner",
    behaviour: function(creep) {
        updateState(creep);
        act(creep);
    },
}

function updateState(creep) {
    if(creep.memory.state == undefined) {
        creep.memory.state = miningState.name;
    }
    
    states[creep.memory.state].update(creep);
}

function act(creep) {
    states[creep.memory.state].action(creep);
}

module.exports = behaviour;