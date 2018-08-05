
var Grid = require('./grid').Grid;

module.exports.GridController = (function() {
  function GridController(gridSize) {
    this.grid = new Grid(gridSize);
    this.gridSize = gridSize;
  }

  GridController.prototype.add = function(entity) {
    return this.grid.add(entity);
  }

  /*
   * Return entities in a given area.
   * Must pass a starting (x, y) and the width/height of the area.
   */
  GridController.prototype.get = function(x, y, width, height) {
    width = width || 0;
    height = height || 0;

    return this.findEntitiesInArea(x, y, x + width, y + height);
  }

  /*
   * Return entities in a given area.
   * Must pass a minimum (x, y) and a max (x, y) to define the area.
   */
  GridController.prototype.findEntitiesInArea = function(trueMinX, trueMinY, trueMaxX, trueMaxY) {
    var minX = this.getGridValue(trueMinX);
    var maxX = this.getGridValue(trueMaxX);
    var minY = this.getGridValue(trueMinY);
    var maxY = this.getGridValue(trueMaxY);

    return this.grid.findEntitiesInArea(minX, minY, maxX, maxY);
  }

  GridController.prototype.getGridValue = function(actualX) {
    return Math.floor(actualX / this.gridSize);
  }

  return GridController;
})()
