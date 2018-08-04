
var Grid = require('./grid').Grid;

module.exports.GridController = (function() {
  function GridController(gridSize) {
    this.grid = new Grid(gridSize);
  }

  GridController.prototype.get = function(x, y, width, height) {
    width = width || 0;
    height = height || 0;
    return this.grid.findEntitiesInArea(x, y, x + width, y + height);
  }

  GridController.prototype.add = function(entity) {
    return this.grid.add(entity);
  }

  return GridController;
})()
