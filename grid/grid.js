
module.exports.grid = (function() {
  function Grid(gridSize, zeroes) {
    this.gridSize = gridSize || 1
    this.data = {};
    this.zeroesInKey = zeroes || 0;
  }

  /*
   * Return the position in the grid. If it does not exist,
   * return an empty array.
   */
  Grid.prototype.get = function(x, y) {
    if (!this.data[x]) { return [] }
    return this.data[x][y] || []
  }

  // for now assumes that entities have no width/height
  Grid.prototype.add = function(entity) {
    var column = Math.floor(entity.x / this.gridSize);
    var row = Math.floor(entity.y / this.gridSize);

    if (this.data[column] === undefined) {
      this.data[column] = {};
    }
    if (this.data[column][row] === undefined) {
      this.data[column][row] = [];
    }
    this.data[column][row].push(entity);
  }

  return Grid;
})()
