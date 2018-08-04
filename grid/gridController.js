
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

  /*
   * NOTE: This runs in O(m * n) and could very well be a future bottleneck.
   * If ES6 were being used in this library, it could likely be done with a Map to reduce it to O(m + n).
   */
  function union(array1, array2) {
    var newArray = array1.concat(array2);
    return newArray.filter(function(element, index) {
      return index === newArray.indexOf(element)
    });
  }

  return GridController;
})()
