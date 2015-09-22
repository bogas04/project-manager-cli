/************
  IO stuff  
 ************/
const fs = require('fs');
const readJSON = require('load-json-file');
const writeJSON = require('write-json-file');

/*************
  CLI stuff  
 *************/
const col = require('cli-color');
const userHome = process.env.HOME || process.env.USERPROFILE;
const file = userHome + '/' + (process.env.USERPROFILE ? '_' : '.') + 'prm.projects.json';

/********************
  Functional stuff  
 ********************/
const keepDoing = (This, For, nTimes, AndDoThisAtLast) => nTimes > 0 ? This(For, keepDoing(This, For, nTimes - 1, AndDoThisAtLast)) : AndDoThisAtLast;
const nSpaces = (n) => keepDoing((a, b) => a + b, ' ', n, ''); // Crazy as it sounds, this returns n spaces, functionally

/************
  PRM stuff 
 ************/
var prm = {};
const Project = require('./Project.class');
const printError = (err) => console.log(err);
const p2s = (p, m) => console.log(col.red(p.name) + nSpaces(m - p.name.length) + ' @ ' + col.yellow.bgBlack(p.location));
const usage = 'Usage:\n prm ls|list\n prm rm|remove <project-name>\n prm add <project-name> <location>\n cd $(prm <project-name>)|`prm <project-name>`';

prm.ls = () => readJSON(file)
.then((projects) => {
  const maxLen = Math.max.apply(null, projects.map((p) => p.name.length));
  projects.map((project) => p2s(project, maxLen))
})
.catch(printError);

prm.add = (projectName, location) => readJSON(file)
.then(
  (projects) => writeJSON(file, projects.concat(new Project(projectName, location).toJSON()))
  .then(prm.ls).catch(printError)
)
.catch(printError);

prm.rm = (projectName) => readJSON(file)
.then(
  (projects) => writeJSON(file, projects.filter((p) => p.name !== projectName))
  .then(prm.ls).catch(printError)
)
.catch(printError);

prm.cd = (projectName) => readJSON(file)
.then((projects) => {
  const project = projects.filter((p) => p.name === projectName);
  if(project.length !== 1) {
    console.log(projectName + " project not found." + '\n' + usage);
    prm.ls();
  } else {
    console.log(project[0].location);
  }
})
.catch(printError);

prm.init = (args) => {
  if (args.length < 3 || (args.length === 4 && args[2] === 'add')) {
    console.log(usage);
    process.exit(0);
  } else {
    try {
      fs.accessSync(file, fs.W_OK | fs.R_OK)
    } catch(e) {
      fs.writeFileSync(file, '[]');
    }
    switch(args[2]) {
      case 'list': case 'ls': prm.ls(); break;
      case 'add': prm.add(args[3], args[4]); break;
      case 'remove': case 'rm': prm.rm(args[3]); break;
      default: prm.cd(args[2]); break;
    }
  }
};

module.exports = prm;
