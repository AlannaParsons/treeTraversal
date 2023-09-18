class Vampire {
  constructor(name, yearConverted) {
    this.name = name;
    this.yearConverted = yearConverted;
    this.offspring = [];
    this.creator = null;
  }

  /** Simple tree methods **/

  // Adds the vampire as an offspring of this vampire
  addOffspring(vampire) {
    this.offspring.push(vampire);
    vampire.creator = this;
  }

  // Returns the total number of vampires created by that vampire
  get numberOfOffspring() {
    return this.offspring.length;
  }

  // Returns the number of vampires away from the original vampire this vampire is
  get numberOfVampiresFromOriginal() {
    let count = 0;
    let currentVamp = this;

    while (currentVamp.creator) {
      currentVamp = currentVamp.creator;
      count++;
    }

    return count;
  }

  // Returns true if this vampire is more senior than the other vampire. (Who is closer to the original vampire)
  isMoreSeniorThan(vampire) {
    return (
      this.numberOfVampiresFromOriginal < vampire.numberOfVampiresFromOriginal
    );
  }

  /** Tree traversal methods **/

  // Returns the vampire object with that name, or null if no vampire exists with that name
  vampireWithName(name) {
    if (this.name === name) {
      return this;
    }

    for (const offspringNode of this.offspring) {
      if (offspringNode && offspringNode.name === name) {
        return offspringNode;
      } else {
        const found = offspringNode.vampireWithName(name);
        if (found) return found;
      }
    }

    return null;
  }

  // Returns the total number of vampires that exist
  get totalDescendents() {
    let total = 0;
    total += this.offspring.length;

    for (const offspringNode of this.offspring) {
      total += offspringNode.totalDescendents;
    }

    return total;
  }

  // Returns an array of all the vampires that were converted after 1980
  get allMillennialVampires() {
    let vamps = [];
    let millennialCutoff = 1980;

    if (this.yearConverted >= millennialCutoff) {
      vamps.push(this);
    }

    for (const offspring of this.offspring) {
      const millennialOffspring = offspring.allMillennialVampires;
      vamps = vamps.concat(millennialOffspring);
    }

    return vamps;
  }

  /** Stretch **/

  // Returns the closest common ancestor of two vampires.
  // The closest common anscestor should be the more senior vampire if a direct ancestor is used.
  // For example:
  // * when comparing Ansel and Sarah, Ansel is the closest common anscestor.
  // * when comparing Ansel and Andrew, Ansel is the closest common anscestor.
  // will not handle unrelated trees
  closestCommonAncestor(vampire) {

    let vampireA = vampire;
    let vampireB = this;
    let found = null;

    //if closest common ancestor found, break loop (also used to traverse vampireA lineage)
    while (!found) {

      while (vampireB) {

        //catchall. should return root vampire if none else found or same vampire used
        if (vampireA.name === vampireB.name) {
          found = vampireA;
        }

        //if not root vampire
        if (vampireB.creator && vampireA.creator && !found) {
          if (vampireA.name === vampireB.creator.name) {
            found = vampireA;
          } else if (vampireB.name === vampireA.creator.name) {
            found = vampireB;
          } else if (vampireA.creator.name === vampireB.creator.name) {
            found = vampireA.creator;
          }
        }

        // vampireB lineage traversal
        vampireB = vampireB.creator;
      }

      // vampireA lineage traversal. reset vampireB
      vampireA = vampireA.creator;
      vampireB = this;

    }

    return found;
  }
}

module.exports = Vampire;
