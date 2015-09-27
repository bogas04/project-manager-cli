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
const file = userHome + '/' + (process.env.USERPROFILE ? '_' : '.') + 'pmc.projects.json';

/********************
  Functional stuff  
 ********************/
const keepDoing = (This, For, nTimes, DoThisAtLast) => nTimes <= 0 ? DoThisAtLast : (For + keepDoing(This, For, nTimes - 1, DoThisAtLast));
const nSpaces = (n) => keepDoing((a, b) => a + b, ' ', n, ''); // Crazy as it sounds, this returns n spaces, functionally

/************
  PRM stuff 
 ************/
var pmc = {};
const Project = require('./Project.class');
const printError = err => console.log(col.white.bgLightRed(err));
const p2s = (p, m) => console.log(col.red(p.name), nSpaces(m - p.name.length), '@', col.yellow.bgBlack(p.location.toLowerCase()));
const usage = 'Usage:\n pmc ls|list\n pmc rm|remove <project-name>\n pmc add <project-name> <location>\n cd $(pmc <project-name>)|`pmc <project-name>';
const projectNotFound = p => { console.log(col.red(p), col.blue('project not found.'), '\n', usage); pmc.ls(); }

pmc.ls = () => readJSON(file)
.then(projects => {
  const maxLen = projects.reduce((max, p) => max = Math.max(max, p.name.length), 0);
  projects
  .sort((p, q) => p.name.length > q.name.length)
  .map(p => p2s(p, maxLen))
})
.catch(printError);

pmc.add = (projectName, location) => readJSON(file)
.then(
  projects => writeJSON(file, projects.concat(new Project(projectName, location).toJSON()))
  .then(pmc.ls).catch(printError)
)
.catch(printError);

pmc.rm = projectName => readJSON(file)
.then(
  projects => writeJSON(file, projects.filter(p => p.name !== projectName))
  .then(pmc.ls).catch(printError)
)
.catch(printError);

pmc.cd = projectName => readJSON(file)
.then(projects => {
  const project = projects.find(p => p.name === projectName);
  project ? console.log(project.location) : projectNotFound(projectName);
})
.catch(printError);

pmc.addStart = (projectName, start) => readJSON(file)
.then(projects => writeJSON(file, projects.map(p => p.name === projectName ? Object.assign(p, { start : start }) : p)).then(pmc.ls).catch(printError))
.catch(printError);

pmc.removeStart = (projectName, start) => readJSON(file)
.then(projects => writeJSON(file, projects.map(p => p.name === projectName ? { "name" : p.name, "location" : p.location } : p)).then(pmc.ls).catch(printError))
.catch(printError);

pmc.start = projectName => readJSON(file)
.then(projects => {
  const project = projects.find(p => p.name === projectName);
  project ? console.log(project.start || ('No start config found for ' + col.red(project.name) + '.')): projectNotFound(projectName);
})
.catch(printError);

pmc.init = args => {
  args = args.map(e => e.toLowerCase());
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
      case 'list': case 'ls': pmc.ls(); break;
      case 'start': case 's': pmc.start(args[3]); break;
      case 'add': pmc.add(args[3], args[4]); break;
      case 'add-start': pmc.addStart(args[3], args[4]); break;
      case 'remove': case 'rm': pmc.rm(args[3]); break;
      default: pmc.cd(args[2]); break;
    }
  }
};

module.exports = pmc;
