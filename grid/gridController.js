
var Grid = require('./grid').Grid;

module.exports.GridController = (function() {
  function GridController(gridSize) {
    this.grid = new Grid();
    this.gridSize = gridSize || 1;
  }

  GridController.prototype.clear = function() {
    this.grid = new Grid();
  }

  /*
   * Adds an entity to one or more tiles in the grid.
   * Note that entities need not have a width or height.
   * @TODO Ensure entities that are 3 columns wide or tall get added to all tiles (currently only being added to max four tiles).
   */
  GridController.prototype.add = function(entity) {
    var columnX = this.getGridValue(entity.x);
    var rowY = this.getGridValue(entity.y);
    var width = entity.width || 0;
    var height = entity.height || 0;
    var widthColumnX = this.getGridValue(entity.x + width);
    var heightRowY = this.getGridValue(entity.y + height);

    return this.grid.add(entity, columnX, rowY, widthColumnX, heightRowY);
  }

  GridController.prototype.getFromTile = function(x, y) {
    return this.grid.get(x, y);
  }

  /*
   * Return entities in a given area.
   * Must pass a starting (x, y) and the width/height of the area.
   */
  GridController.prototype.getByArea = function(x, y, width, height) {
    width = width || 0;
    height = height || 0;

    return this.getByAreaCorners(x, y, x + width, y + height);
  }

  /*
   * Same as getByArea, but provides only unique values.
   */
  GridController.prototype.getByAreaUnique = function(x, y, width, height) {
    var entities = this.getByArea(x, y, width, height);
    return [...new Set(entities)];
  }

  /*
   * Return entities in a given area.
   * Must pass a minimum (x, y) and a max (x, y) to define the area.
   */
  GridController.prototype.getByAreaCorners = function(trueMinX, trueMinY, trueMaxX, trueMaxY) {
    var minX = this.getGridValue(trueMinX);
    var maxX = this.getGridValue(trueMaxX);
    var minY = this.getGridValue(trueMinY);
    var maxY = this.getGridValue(trueMaxY);

    return this.grid.findEntitiesInArea(minX, minY, maxX, maxY);
  }

  /*
   * Return entities in a given area.
   * Must pass a minimum (x, y) and a max (x, y) to define the area.
   */
  GridController.prototype.getByAreaCornersUnique = function(trueMinX, trueMinY, trueMaxX, trueMaxY) {
    var entities = this.getByAreaCorners(trueMinX, trueMinY, trueMaxX, trueMaxY)
    return [...new Set(entities)];
  }

  GridController.prototype.getGridValue = function(actualX) {
    return Math.floor(actualX / this.gridSize);
  }

  return GridController;
})()
