const fs = require('fs-promise');
const file = __dirname + '/projects.json';
const b2j = (buff) => JSON.parse(buff);
const j2b = (json) => JSON.stringify(json);
const Project = require('./Project.class');
const usage = `Usage: 
node prm ls 
node prm add <project-name> <location> 
node prm rm <project-name>
cd $(node prm <project-name>)`;

var prm = {
  ls: () => { 
    fs.readFile(file, 'utf-8')
    .then((buff) => b2j(buff).map((project) => console.log(project.name, project.location)))
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
        case 'ls': prm.ls(); break;
        case 'add': prm.add(args[3], args[4]); break;
        case 'rm': prm.rm(args[3]); break;
        default: prm.cd(args[2]); break;
      }
    }
  }
};

module.exports = prm;
