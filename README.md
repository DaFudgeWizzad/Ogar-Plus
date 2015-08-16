# Ogar-Plus
Copy of ogar that I heavily modified, and will continue to update. The [OgarProject](https://ogarproject.com) owns Ogar, and I do not claim it as mine! Original Ogar found [here](https://github.com/OgarProject/Ogar)

## Obtaining and Using
As Ogar is written in Node.js, you must have Node.js and its "ws" module installed to use it. Only use this version if you want to use the source. (for editing and modifying ogar to your liking) If you don't have Node.js and the ws module, The server will NOT run!

Windows:
* Download [node.js](https://nodejs.org/download/)
* Open CMD or Terminal (whatever OS you're running) as Administrator/root and type: npm install ws
* Download [VakoNoway](http://ogarproject.com/members/vakonoway.80/)'s fixed node_modules. (now included with Ogar-Plus)
* Open Start.bat in /src/ or in Linux go to src/ and type: nodejs index.js
* If you're running on port 443, make sure Skype is closed, otherwise choose another port by changing gameserver.ini.
* Go to your defaultgateway and forward your port to your local IP. (in Windows open CMD and type: ipconfig and look for IPv4 address)
* Locally connect by http://agar.io/?ip=127.0.0.1:yourport or by typing the JavaScript command: connect("ws://127.0.0.1:yourport")
* Others outside your network will have to connect with your external IP. They will use the same port, but ip found [here](http://cmyip.com/)

Linux Manual:
```sh
~$ git clone git://github.com/OgarProject/Ogar.git Ogar
~$ npm install ws
~$ node Ogar
```
Using the Linux install script:
```sh
~$ sudo ogar-linux-script.sh install /your/preferred/directory
~$ sudo -u ogar -H /bin/sh -c "cd; /bin/node src/index.js"
```
Using ```sudo -u ogar -H /bin/sh -c "cd; /bin/node src/index.js" ``` to launch the server increases security by running the process as an unprivileged, dedicated user with a limited shell and it is recommended to do so.

Currently, Ogar listens on the following addresses and ports:
* *:80 - for the master server
* *:443 - for the game server

Please note that on some systems, you may have to run the process as root or otherwise elevate your privileges to allow the process to listen on the needed ports. **If you are getting an EADDRINUSE error, it means that the port required to run Ogar is being used. Usually, Skype is the culprit. To solve this, either close out skype, or change the serverPort value in gameserver.ini to a different port. You will have to change your connection ip to "127.0.0.1:PORT"**

Once the game server is running, you can connect (locally) by typing `agar.io/?ip=127.0.0.1:PORT` into your browser's address bar, or javascript:connect("ws://IP:PORT","") if you have issues or want the old system back.

## Configuring Ogar
Use "gameserver.ini" to modify Ogar's configurations.

## Custom Game modes
Ogar has support for custom gamemodes. To switch between game modes, change the value of "serverGamemode" in the configurations file to the selected game mode id and restart the server. The current gamemodes are:
GAMEMODES

Id   | Name
-----|--------------
0    | Free For All
1    | Teams
2    | Experimental
3    | Virus Off
10   | Tournament
11   | Hunger Games
12   | Zombie Mode
13   | Team Z
14   | Team X
20   | Rainbow FFA
21   | Debug

## Console Commands
The current available console commands are listed here. Command names are not case sensitive, but player names are.

 - Addbot [Number]
   * Adds [Number] of bots to the server. If an amount is not specified, 1 bot will be added.
 - Board [String 1] [String 2] [String 3] ...
   * Replaces the text on the leaderboard with the string text.
 - Boardreset
   * Resets the leaderboard to display the proper data for the current gamemode
 - Change [Config setting] [Value]
   * Changes a config setting to a value. Ex. "change serverMaxConnections 32" will change the variable serverMaxConnections to 32. Note that some config values (Like serverGamemode) are parsed before the server starts so changing them mid game will have no effect.
 - Clear
   * Clears the console output
 - Color [Player ID] [Red] [Green] [Blue]
   * Replaces the color of the specified player with this color.
 - Food [X position] [Y position] [Mass]
   * Spawns a food cell at those coordinates. If a mass value is not specified, then the server will default to "foodStartMass" in the config.
 - Gamemode [Id]
   * Changes the gamemode of the server. Warning - This can cause problems.
 - Kick [Player ID]
   * Kicks the specified player or bot from the server.
 - Kill [Player ID]
   * Kills all cells belonging to the specified player.
 - Killall
   * Kills all player cells on the map.
 - Mass [Player ID] [Number]
   * Sets the mass of all cells belonging to the specified player to [Number].
 - Merge [Player ID]
   * Forces the specified player to merge.
 - Name [Player ID] [New Name]
   * Changes the name of the player with the specified id with [New Name].
 - Playerlist
   * Shows a list of connected players, their IP, player ID, the amount of cells they have, total mass, and their position. 
 - Pause
   * Pauses/Unpauses the game.
 - Ping
   * Pings you server
 - Reload
   * Reloads the config file used by the server. However, the following values are not affected: serverPort, serverGamemode, serverBots, serverStatsPort, serverStatsUpdate.
 - Status
   * Shows the amount of players currently connected, time elapsed, memory usage (memory used/memory allocated), and the current gamemode.
 - Stop
   * Stops the server and displays bye message
 - Tp [Player ID] [X position] [Y position]
   * Teleports the specified player to the specified coordinates.
 - Virus [X position] [Y position] [Mass]
   * Spawns a virus cell at those coordinates. If a mass value is not specified, then the server will default to "virusStartMass" in the config.

## Known Issues
* Bots are braindead
Found any more? Post them in the issues tab!

## License
Please see [this link](https://github.com/DaFudgeWizzad/Ogar-Plus/blob/master/LICENSE.md)
