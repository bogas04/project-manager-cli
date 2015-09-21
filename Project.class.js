'use strict';

class Project {
  constructor(name, location) {
    this.name = name;
    this.location = location;
  }
  toJSON() {
    return { name: this.name, location: this.location };
  }
}
module.exports = Project;
