# the-dashboard

For this project we need to install MongoDB and NodeJS

To download NodeJS:
https://nodejs.org/es/download/

To download MongoDB:
https://www.mongodb.com/try/download/community

After installing MongoDB, we will need to add it to the environment variables:

1. Find the path to the mongodb folder in your program files
2. Then go to the bin folder If you’re not sure where it is, it’s probably in C:\Program Files\MongoDB\Server\4.0\
3. Copy the path of the bin folder, this should be C:\Program Files\MongoDB\Server\4.0\bin
4. Press the Windows key and then type “env”. (If you don't have a Windows key you can press ctrl and esc or navigate to the start window.) Windows will suggest “Edit the system environment variables”, click it
5. In the Advanced tab, click “Environment Variables”
6. With the Path variable highlighted in “System Variables”, click “Edit”
7. Click “New”
8. Paste your path of the copied bin folder from earlier. Make sure it ends with a \
9. click “OK” until you are out of the system properties

Start mongod Processes
By default, MongoDB listens for connections from clients on port 27017, and stores data in the /data/db directory. On Windows, this path is on the drive from which you start MongoDB. For example, if you do not specify a --dbpath, starting a MongoDB server on the C:\ drive stores all data files in C:\data\db. To start MongoDB using all defaults, issue the following command at the system shell: 

```
mongod
```

To install the modules used in the project:
```
npm install
```
npm install (in a package directory, no arguments):
Install the dependencies in the local node_modules folder.
In global mode (ie, with -g or --global appended to the command), it installs the current package context (ie, the current working directory) as a global package.
By default, npm install will install all modules listed as dependencies in package.json.

To run the project in your terminal:
```
npm start 
```
You are good to go!
