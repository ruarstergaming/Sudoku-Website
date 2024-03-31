# ABOUT THE SYSTEM
- this system is a JavaScript-based web app, **Fantastic Puzzles Fife**.
- it is a site for solving sudoku puzzles
- more info can be found in the supplied report

# INSTALLATION AND RUNNING

## A brief comment
- the system has been developed and designed to be installed and ran on the CS host servers
- essential components such as our database must run on this
- extensive configuration would be required to change this or any other functionality, so that it may work outwith the host server
- therefore these instructions assume you are using the host server *trenco*
- they assume you are logged into the assigned pseudo-user *cs3099user06* 
- we recommmend you perform the steps in the order they appear

## Starting the database
- the db is a MongoDB database running on *trenco*
- to run the database, run the command `$HOME/mongodb/bin/mongod --dbpath $HOME/Documents/mongodb_data --fork --logpath=$HOME/mongodb/mongodb.log --auth --port 24031` 
- it is recommended that this is done inside a tmux session (see https://systems.wiki.cs.st-andrews.ac.uk/index.php/Using_tmux)
- you should receive a short acknowledgement that the database has started

## Starting the backend server
- the backend server runs in the Node.js environment, so this must be installed!
- within the top-level of the directory (containing 'package.json') run the command `npm install`
- this will install all dependencies for the system (provided you have npm)
- to start the server **from the same directory** run `node src/backend/server`
- the server provides a confirmation message on connection to the database or will terminate if it cannot connect
- so make sure to start the database first!

### Starting the frontend
- all dependencies for the frontend have been installed via the previously ran `npm install`
- so to run the frontend use the command `npm start`

## Once run
- the frontend is accessible at https://cs3099user06.host.cs.st-andrews.ac.uk/fpf06
- the backend server is mapped to https://cs3099user06.host.cs.st-andrews.ac.uk