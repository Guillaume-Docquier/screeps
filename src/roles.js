var minerBehaviour = require('behaviour.miner');
var perfectionistBehaviour = require('behaviour.perfectionist');

const roles = {
    names: {
        MINER: minerBehaviour.name,
        PERFECTIONIST: perfectionistBehaviour.name,
    },
    behaviours: {
        [minerBehaviour.name]: minerBehaviour.behaviour,
        [perfectionistBehaviour.name]: perfectionistBehaviour.behaviour,
    },
};

module.exports = roles;