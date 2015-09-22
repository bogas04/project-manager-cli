prm
==

Inspired by [eivind88/prm](https://github.com/eivind88/prm), I decided to build it using NodeJS.
Though it doesn't really do anything better, I just wanted something to play with ES2015.

However, the project does benefit from being a NodeJS module, ***multiplatform support***.

Note: Node 4.0.0 or higher needed, as the code is written in ES2015

![Screencast](/assets/screencast.gif)

Installation
==
Make sure you have Node 4.0.0 (at least) installed and npm installed.
```bash
npm i node-prm -g
```

Setup
==
Since a node process can only change working directory of its child process, 
in order to cd into your project, you will need to add an alias to your bash_rc, bash_profile like the following:
```bash
prm-cd () { cd `prm $1`; }
```

Usage
==
List all projects

```bash
prm ls|list
```

Add new project

```bash
prm add <project-name> <location> 
```
Remove existing project

```bash
prm rm|remove <project-name>
```

Open existing project
If you have added an [alias](#setup)
```bash
prm-cd <project-name>
```
Else
```bash
cd `prm <project-name>`
```
or

```bash
cd $(prm <project-name>)
```

Credits
==
Thanks to [eivind88/prm](https://github.com/eivind88/prm) for the idea

License
==
MIT
