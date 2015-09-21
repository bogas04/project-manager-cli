prm
==

Inspired by [eivind88/prm](https://github.com/eivind88/prm), I decided to build it using NodeJS.
Though it doesn't really do anything better, I just wanted something to play with ES2015.

However, the project does benefit from being a NodeJS module, ***multiplatform support***.

Setup
==
Currently the dev isn't cool enough to know how to do symlinks via npm, but for now you can put this in your .bashrc / .bash_profile
```bash
alias prm='node ~/path/to/prm/index.js'
```

Usage
==
List all projects

```bash
prm ls 
```

Add new project

```bash
prm add <project-name> <location> 
```
Remove existing project

```bash
prm rm <project-name>
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
