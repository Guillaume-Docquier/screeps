const manager = {
    scanSources: function() {
        initializeStateIfNotSet();
        scanForNewSources();
        ensureConsistentState();
    },
    getAssignment: function(minerCreep) {
        unassign(minerCreep);
        assign(minerCreep);
    },
}

function initializeStateIfNotSet() {
    if(Memory.sourceCapabilities == undefined) {
        Memory.sourceCapabilities = {};
    }
}

function scanForNewSources() {
    for (roomName in Game.rooms) {
        if(Memory.sourceCapabilities[roomName] == undefined) {
            Memory.sourceCapabilities[roomName] = {};
            var sources = Game.rooms[roomName].find(FIND_SOURCES);
            for (sourceIndex in sources) {
                var source = sources[sourceIndex];
                var sourceAccessPoints = computeSourceAccessPoints(source);
                Memory.sourceCapabilities[roomName][source.id] = { accessPoints: sourceAccessPoints, miners: 0 };
            }
        }
    }
}

function computeSourceAccessPoints(source) {
    var pos = source.pos;
    var sourceAccessPoints = 0;
    for(var x = pos.x - 1; x <= pos.x + 1; x++) {
        for(var y = pos.y - 1; y <= pos.y + 1; y++) {
            if(Game.map.getTerrainAt(x, y, pos.roomName) == "plain")
            {
                sourceAccessPoints++;
            }
        }
    }
    
    return sourceAccessPoints;
}

function ensureConsistentState() {
    var sourceCapabilities = Memory.sourceCapabilities;
    for (roomName in sourceCapabilities) {
        var roomCapabilities = sourceCapabilities[roomName];
        for (sourceId in roomCapabilities) {
            roomCapabilities[sourceId].miners = _.filter(Game.creeps, (creep) => creep.memory.assignedSource == sourceId).length;
        }
    }
}

function unassign(minerCreep) {
    if(minerCreep.memory.assignedSource == undefined) {
        return;
    }
    
    var roomName = minerCreep.room.name;
    var sourceId = minerCreep.memory.assignedSource;
    Memory.sourceCapabilities[roomName][sourceId].miners -= 1;
    minerCreep.memory.assignedSource = undefined;
}

function assign(minerCreep) {
    if(minerCreep.memory.assignedSource != undefined) {
        return;
    }
    
    if(!assignToSourceWithMissingWorkforce(minerCreep)) {
        assignToSourceWithLeastLoad(minerCreep);
    }
}

function assignToSourceWithMissingWorkforce(minerCreep) {
    var roomName = minerCreep.room.name;
    var sourceCapabilities = Memory.sourceCapabilities[roomName];
    for (sourceId in sourceCapabilities) {
        var sourceCapability = sourceCapabilities[sourceId];
        if(sourceCapability.miners < sourceCapability.accessPoints) {
            minerCreep.memory.assignedSource = sourceId;
            Memory.sourceCapabilities[roomName][sourceId].miners += 1;
            return true;
        }
    }
    
    return false;
}

function assignToSourceWithLeastLoad(minerCreep) {
    var roomName = minerCreep.room.name;
    var sourceCapabilities = Memory.sourceCapabilities[roomName];
    var loads = [];
    for (sourceId in sourceCapabilities) {
        var sourceCapability = sourceCapabilities[sourceId];
        loads.push({ sourceId: sourceId, load: sourceCapability.miners / sourceCapability.accessPoints });
    }
    
    loads.sort(function(a, b) { return a.load - b.load });
    var sourceId = loads[0].sourceId;
    minerCreep.memory.assignedSource = sourceId;
    Memory.sourceCapabilities[roomName][sourceId].miners += 1;
}

module.exports = manager