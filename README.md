prm
==

Inspired by [eivind88/prm](https://github.com/eivind88/prm), I decided to build it using NodeJS.
Though it doesn't really do anything better, I just wanted something to play with ES2015.

However, the project does benefit from being a NodeJS module, ***multiplatform support***.

Note: Node 4.0.0 or higher needed, as the code is written in ES2015

Installation
==
Make sure you have Node 4.0.0 (at least) installed and npm installed.
```bash
npm i node-prm -g
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
