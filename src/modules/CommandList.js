
// Imports
var GameMode = require('../gamemodes');
var Entity = require('../entity');

function Commands() {
    this.list = { }; // Empty
}

module.exports = Commands;

// Utils
var fillChar = function (data, char, fieldLength, rTL) {
    var result = data.toString();
    if (rTL === true) {
        for (var i = result.length; i < fieldLength; i++)
            result = char.concat(result);
    }
    else {
        for (var i = result.length; i < fieldLength; i++)
            result = result.concat(char);
    }
    return result;
};

// Commands

Commands.list = { 
	help: function(gameServer,split) {
        console.log("========================== HELP ============================");
        console.log("[Ogar-Plus] addbot     : add one bot to the server");
		console.log("[Ogar-Plus] addbots    : add more than one bot to the server");
        console.log("[Ogar-Plus] board      : set scoreboard text");
        console.log("[Ogar-Plus] boardreset : reset scoreboard text");
        console.log("[Ogar-Plus] change     : change specified settings");
        console.log("[Ogar-Plus] clear      : clear console output");
        console.log("[Ogar-Plus] color      : set cell(s) color by client ID");
        console.log("[Ogar-Plus] stop       : stop the server");
        console.log("[Ogar-Plus] food       : spawn food at specified Location");
        console.log("[Ogar-Plus] gamemode   : change server gamemode");
        console.log("[Ogar-Plus] kick       : kick player or bot by client ID");
        console.log("[Ogar-Plus] kill       : kill cell(s) by client ID");
        console.log("[Ogar-Plus] killall    : kill everyone");
        console.log("[Ogar-Plus] mass       : set cell(s) mass by client ID");
		console.log("[Ogar-Plus] merge	   : force a player to merge");
        console.log("[Ogar-Plus] name       : change cell(s) name by client ID");
        console.log("[Ogar-Plus] playerlist : get list of players and bots");
        console.log("[Ogar-Plus] pause      : pause game , freeze all cells");
        console.log("[Ogar-Plus] reload     : reload config");
        console.log("[Ogar-Plus] status     : get server status");
        console.log("[Ogar-Plus] tp         : teleport player to specified location");
        console.log("[Ogar-Plus] virus      : spawn virus at a specified Location");
        console.log("[Ogar-Plus] ping       : checks your ping")
		console.log("============================================================");
    },
    merge: function(gameServer,split) {
		// Validation checks
		var id = parseInt(split[1]);
        if (isNaN(id)) {
            console.log("[Ogar-Plus] Please specify a valid player ID!");
            return;
        }

        // Sets merge time
        for (var i in gameServer.clients) {
            if (gameServer.clients[i].playerTracker.pID == id) {
                var client = gameServer.clients[i].playerTracker;
                for (var j in client.cells) {
                    client.cells[j].calcMergeTime(0);
                }

                console.log("[Ogar-Plus] Forced " + client.name + " to merge cells");
                break;
            }
        }
    },
	addbot: function(gameServer,split) {
        var add = parseInt(split[1]);
        if (isNaN(add)) {
            add = 10; // Adds 1 bot if user doesnt specify a number
        }

        for (var i = 0; i < add; i++) {
            gameServer.bots.addBot();
        }
        console.log("[Ogar-Plus] Added "+add+" player bots");
    },
	addbots: function(gameServer,split) {
        var add = parseInt(split[1]);
        if (isNaN(add)) {
            add = 1; // Adds 1 bot if user doesnt specify a number
        }

        for (var i = 0; i < add; i++) {
            gameServer.bots.addBot();
        }
        console.log("[Ogar-Plus] Added "+add+" player bots");
    },
    board: function(gameServer,split) {
        var newLB = [];
        for (var i = 1; i < split.length; i++) {
            newLB[i - 1] = split[i];
        }

        // Clears the update leaderboard function and replaces it with our own
        gameServer.gameMode.packetLB = 48;
        gameServer.gameMode.specByLeaderboard = false;
        gameServer.gameMode.updateLB = function(gameServer) {gameServer.leaderboard = newLB}; 
        console.log("[Ogar-Plus] Successfully changed leaderboard values");
    },
    boardreset: function(gameServer) {
        // Gets the current gamemode
        var gm = GameMode.get(gameServer.gameMode.ID);
        
        // Replace functions
        gameServer.gameMode.packetLB = gm.packetLB;
        gameServer.gameMode.updateLB = gm.updateLB; 
        console.log("[Ogar-Plus] Successfully reset leaderboard");
    },
    change: function(gameServer,split) {
        var key = split[1];
        var value = split[2];

        // Check if int/float
        if (value.indexOf('.') != -1) {
            value = parseFloat(value);
        } else {
            value = parseInt(value);
        }

        if (typeof gameServer.config[key] != 'undefined') {
            gameServer.config[key] = value;
            console.log("[Ogar-Plus] Set " + key + " to " + value);
        } else {
            console.log("[Ogar-Plus] Invalid config value");
        }
    },
    clear: function() {
        process.stdout.write("\u001b[2J\u001b[0;0H");
    },
    color: function(gameServer,split) {
        // Validation checks
        var id = parseInt(split[1]);
        if (isNaN(id)) {
            console.log("[Ogar-Plus] No one has that player ID!");
            return;
        }

        var color = {r: 0, g: 0, b: 0};
        color.r = Math.max(Math.min(parseInt(split[2]), 255), 0);
        color.g = Math.max(Math.min(parseInt(split[3]), 255), 0);
        color.b = Math.max(Math.min(parseInt(split[4]), 255), 0);

        // Sets color to the specified amount
        for (var i in gameServer.clients) {
            if (gameServer.clients[i].playerTracker.pID == id) {
                var client = gameServer.clients[i].playerTracker;
                client.setColor(color); // Set color
                for (var j in client.cells) {
                    client.cells[j].setColor(color);
                }
                break;
            }
        }
    },
    stop: function(gameServer,split) {
		process.stdout.write('\033c');
		process.stdout.write('\2');
		console.log("Bye!\2");
        gameServer.socketServer.close();
        process.exit(1);
		window.close();
	},	
    food: function(gameServer,split) {
        var pos = {x: parseInt(split[1]), y: parseInt(split[2])};
        var mass = parseInt(split[3]);

        // Make sure the input values are numbers
        if (isNaN(pos.x) || isNaN(pos.y)) {
            console.log("[Ogar-Plus] Invalid coordinates");
            return;
        }

        if (isNaN(mass)) {
            mass = gameServer.config.foodStartMass;
        }

        // Spawn
        var f = new Entity.Food(gameServer.getNextNodeId(), null, pos, mass);
        f.setColor(gameServer.getRandomColor());
        gameServer.addNode(f);
        gameServer.currentFood++; 
        console.log("[Ogar-Plus] Spawned 1 food cell at ("+pos.x+" , "+pos.y+")");
    },
    gamemode: function(gameServer,split) {
        try {
            var n = parseInt(split[1]);
            var gm = GameMode.get(n); // If there is an invalid gamemode, the function will exit
            gameServer.gameMode.onChange(gameServer); // Reverts the changes of the old gamemode
            gameServer.gameMode = gm; // Apply new gamemode
            gameServer.gameMode.onServerInit(gameServer); // Resets the server
            console.log("[Ogar-Plus] Changed game mode to " + gameServer.gameMode.name);
        } catch (e) {
            console.log("[Ogar-Plus] Invalid game mode selected");
        }
    },
    kick: function(gameServer,split) {
        var id = parseInt(split[1]);
        if (isNaN(id)) {
            console.log("[Ogar-Plus] Please specify a valid player ID!");
            return;
        }
        
        for (var i in gameServer.clients) {
            if (gameServer.clients[i].playerTracker.pID == id) {
                var client = gameServer.clients[i].playerTracker;
                var len = client.cells.length;
                for (var j = 0; j < len; j++) {
                    gameServer.removeNode(client.cells[0]);
                }
                client.socket.close();
                console.log("[Ogar-Plus] Kicked " + client.name);
                break;
            }
        }
    },
    kill: function(gameServer,split) {
        var id = parseInt(split[1]);
        if (isNaN(id)) {
            console.log("[Ogar-Plus] Please specify a valid player ID!");
            return;
        }

        var count = 0;
        for (var i in gameServer.clients) {
            if (gameServer.clients[i].playerTracker.pID == id) {
                var client = gameServer.clients[i].playerTracker;
                var len = client.cells.length;
                for (var j = 0; j < len; j++) {
                    gameServer.removeNode(client.cells[0]);
                    count++;
                }

                console.log("[Ogar-Plus] Removed " + count + " cells");
                break;
            }
        }
    },
    killall: function(gameServer,split) {
        var count = 0;
        var len = gameServer.nodesPlayer.length;
        for (var i = 0; i < len; i++) {
            gameServer.removeNode(gameServer.nodesPlayer[0]);
            count++;
        }
        console.log("[Ogar-Plus] Removed " + count + " cells");
    },
    mass: function(gameServer,split) {
        // Validation checks
        var id = parseInt(split[1]);
        if (isNaN(id)) {
            console.log("[Ogar-Plus] Please specify a valid player ID!");
            return;
        }
        
        var amount = Math.max(parseInt(split[2]),9);
        if (isNaN(amount)) {
            console.log("[Ogar-Plus] Please specify a valid number");
            return;
        }

        // Sets mass to the specified amount
        for (var i in gameServer.clients) {
            if (gameServer.clients[i].playerTracker.pID == id) {
                var client = gameServer.clients[i].playerTracker;
                for (var j in client.cells) {
                    client.cells[j].mass = amount;
                }

                console.log("[Ogar-Plus] Set mass of "+client.name+" to "+amount);
                break;
            }
        }
    },
    name: function(gameServer,split) {
        // Validation checks
        var id = parseInt(split[1]);
        if (isNaN(id)) {
            console.log("[Ogar-Plus] Please specify a valid player ID!");
            return;
        }
        
        var name = split.slice(2, split.length).join(' ');
        if (typeof name == 'undefined') {
            console.log("[Ogar-Plus] Please type a valid name");
            return;
        }

        // Change name
        for (var i = 0; i < gameServer.clients.length; i++) {
            var client = gameServer.clients[i].playerTracker;

            if (client.pID == id) {
                console.log("[Ogar-Plus] Changing "+client.name+" to "+name);
                client.name = name;
                return;
            }
        }

        // Error
        console.log("[Ogar-Plus] Player "+id+" was not found");
    },
    playerlist: function(gameServer,split) {
        console.log("[Ogar-Plus] Showing " + gameServer.clients.length + " players: ");
        console.log(" ID         | IP              | "+fillChar('NICK', ' ', gameServer.config.playerMaxNickLength)+" | CELLS | SCORE  | POSITION    "); // Fill space
        console.log(fillChar('', '-', ' ID         | IP              |  | CELLS | SCORE  | POSITION    '.length + gameServer.config.playerMaxNickLength));
        for (var i = 0; i < gameServer.clients.length; i++) {
            var client = gameServer.clients[i].playerTracker;

            // ID with 3 digits length
            var id = fillChar((client.pID), ' ', 10, true);

            // Get ip (15 digits length)
            var ip = "BOT";
            if (typeof gameServer.clients[i].remoteAddress != 'undefined' ) {
                ip = gameServer.clients[i].remoteAddress;
            }
            ip = fillChar(ip, ' ', 15);

            // Get name and data
            var nick = '', cells = '', score = '', position = '', data = '';
            if (client.spectate) {
                try { 
                    // Get spectated player
                    if (gameServer.getMode().specByLeaderboard) { // Get spec type
                        nick = gameServer.leaderboard[client.spectatedPlayer].name;
                    } else {
                        nick = gameServer.clients[client.spectatedPlayer].playerTracker.name;
                    }
                } catch (e) { 
                    // Specating nobody
                    nick = "";
                }
                nick = (nick == "") ? "An unnamed cell" : nick;
                data = fillChar("SPECTATING: " + nick, '-', ' | CELLS | SCORE  | POSITION    '.length + gameServer.config.playerMaxNickLength, true);
                console.log(" " + id + " | " + ip + " | " + data);
            } else if (client.cells.length > 0) {
                nick = fillChar((client.name == "") ? "An unnamed cell" : client.name, ' ', gameServer.config.playerMaxNickLength);
                cells = fillChar(client.cells.length, ' ', 5, true);
                score = fillChar(client.getScore(true), ' ', 6, true);
                position = fillChar(client.centerPos.x >> 0, ' ', 5, true) + ', ' + fillChar(client.centerPos.y, ' ', 5, true);
                console.log(" "+id+" | "+ip+" | "+nick+" | "+cells+" | "+score+" | "+position);
            } else { 
                // No cells = dead player or in-menu
                data = fillChar('DEAD OR NOT PLAYING', '-', ' | CELLS | SCORE  | POSITION    '.length + gameServer.config.playerMaxNickLength, true);
                console.log(" " + id + " | " + ip + " | " + data);
            }
        }
    },
    pause: function(gameServer,split) {
        gameServer.run = !gameServer.run; // Switches the pause state
        var s = gameServer.run ? "Unpaused" : "Paused";
        console.log("[Ogar-Plus] " + s + " the game.");
    },
    reload: function(gameServer) {
        gameServer.loadConfig();
        console.log("[Ogar-Plus] Reloaded the config file successfully");
    },
    status: function(gameServer,split) {
        // Get amount of humans/bots
        var humans = 0, bots = 0;
        for (var i = 0; i < gameServer.clients.length; i++) {
            if ('_socket' in gameServer.clients[i]) {
                humans++;
            } else {
                bots++;
            }
        }
        //
        console.log("[Ogar-Plus] Connected players: "+gameServer.clients.length+"/"+gameServer.config.serverMaxConnections);
        console.log("[Ogar-Plus] Players: "+humans+" Bots: "+bots);
        console.log("[Ogar-Plus] Server has been running for "+process.uptime()+" seconds.");
        console.log("[Ogar-Plus] Current memory usage: "+process.memoryUsage().heapUsed/1000+"/"+process.memoryUsage().heapTotal/1000+" kb");
        console.log("[Ogar-Plus] Current game mode: "+gameServer.gameMode.name);
    },
    tp: function(gameServer,split) {
        var id = parseInt(split[1]);
        if (isNaN(id)) {
            console.log("[Ogar-Plus] Please specify a valid player ID!");
            return;
        }

        // Make sure the input values are numbers
        var pos = {x: parseInt(split[2]), y: parseInt(split[3])};      
        if (isNaN(pos.x) || isNaN(pos.y)) {
            console.log("[Ogar-Plus] Invalid coordinates");
            return;
        }
        
        // Spawn
        for (var i in gameServer.clients) {
            if (gameServer.clients[i].playerTracker.pID == id) {
                var client = gameServer.clients[i].playerTracker;
                for (var j in client.cells) {
                    client.cells[j].position.x = pos.x;
                    client.cells[j].position.y = pos.y;
                }

                console.log("[Ogar-Plus] Teleported "+client.name+" to ("+pos.x+" , "+pos.y+")");
                break;
            }
        }
    },
    virus: function(gameServer,split) {
        var pos = {x: parseInt(split[1]), y: parseInt(split[2])};
        var mass = parseInt(split[3]);
         
        // Make sure the input values are numbers
        if (isNaN(pos.x) || isNaN(pos.y)) {
            console.log("[Ogar-Plus] Invalid coordinates");
            return;
        } if (isNaN(mass)) {
            mass = gameServer.config.virusStartMass;
        }
        
        // Spawn
        var v = new Entity.Virus(gameServer.getNextNodeId(), null, pos, mass);
        gameServer.addNode(v);
        console.log("[Ogar-Plus] Spawned 1 virus at ("+pos.x+" , "+pos.y+")");
    },
	ping: function(gameServer,split) {
		console.log("pong!")
	}
};