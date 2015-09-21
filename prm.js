const fs = require('fs-promise');
const col = require('cli-color');
const file = __dirname + '/projects.json';
const b2j = (buff) => JSON.parse(buff);
const j2b = (json) => JSON.stringify(json);
const nSpaces = (n) => n === 0 ? '' : (' ' + nSpaces(n - 1));
const Project = require('./Project.class');

const usage = `Usage: 
node prm ls 
node prm add <project-name> <location> 
node prm rm <project-name>
cd $(node prm <project-name>)`;

var prm = {
  ls: () => { 
    fs.readFile(file, 'utf-8')
    .then((buff) => {
      const projects = b2j(buff);
      const maxLength = Math.max.apply(null, projects.map((p) => p.name.length));
      projects.map((project) => console.log(col.red(project.name) + nSpaces(maxLength - project.name.length), '@', col.yellow.bgBlack(project.location)));
    })
    .catch((err) => console.log(err));
  },
  add: (projectName, location) => {
    fs.readFile(file, 'utf-8')
    .then(
      (buff) => {
        fs.writeFile( file, j2b(b2j(buff).concat(new Project(projectName, location).toJSON())))
        .then(prm.ls)
        .catch((err) => console.log(err));
      }
    )
    .catch((err) => console.log(err));
  },
  rm: (projectName) => {
    fs.readFile(file, 'utf-8')
    .then(
      (buff) => {
        fs.writeFile( file, j2b(b2j(buff).filter((project) => project.name !== projectName)))
        .then(prm.ls)
        .catch((err) => console.log(err));
      }
    )
    .catch((err) => console.log(err))
  },
  cd: (projectName) => {
    fs.readFile(file, 'utf-8')
    .then((buff) => {
      const project = b2j(buff).filter((project) => project.name === projectName);
      if(project.length !== 1) {
        console.log(projectName + " project not found.");
        prm.ls();
      } else {
        console.log(project[0].location);
      }
    })
    .catch((err) => console.log(err));
  },
  init: (args) => {
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
  }
};

module.exports = prm;
