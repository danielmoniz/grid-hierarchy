
var Column = require('./column').Column;

// @TODO Use LinkedList instead of array. Splicing items into an array is (surely?) be less efficient than inserting into a LinkedList, especially if iteration is already performed.

module.exports.Grid = (function() {
  function Grid(gridSize) {
    this.gridSize = gridSize || 1;
    this.columns = [];
  }

  /*
   * Return the items in a tile at a position in the grid.
   * If tile does not exist, return an empty array.
   */
  Grid.prototype.get = function(x, y) {
    return this.findColumn(x).findTile(y);
  }

  /*
   * Returns a column given a column x value (not a true x).
   * If no column found, returns a new one.
   */
  Grid.prototype.findColumn = function(x) {
    for (var i = 0; i < this.columns.length; i++) {
      var column = this.columns[i];
      if (column.x > x) { break }
      if (column.x < x) { continue }
      return column
    }
    return new Column(x);
  }

  /*
   * Returns all columns that intersect with a range of true x values.
   * NOTE: This means that it may return a column that contains an entity outside the provided range. This is because the column intersects partially with the given range.
   */
  Grid.prototype.findColumns = function(trueMinX, trueMaxX) {
    var minX = getGridValue(trueMinX, this.gridSize);
    var maxX = getGridValue(trueMaxX, this.gridSize);
    var allColumns = [];

    for (var i = 0; i < this.columns.length; i++) {
      var column = this.columns[i];
      if (column.x > maxX) { break }
      if (column.x < minX) { continue }
      allColumns.push(column);
    }
    return allColumns;
  }

  Grid.prototype.findEntitiesInArea = function(trueMinX, trueMinY, trueMaxX, trueMaxY) {
    var minX = getGridValue(trueMinX, this.gridSize);
    var maxX = getGridValue(trueMaxX, this.gridSize);
    var minY = getGridValue(trueMinY, this.gridSize);
    var maxY = getGridValue(trueMaxY, this.gridSize);

    var columns = this.findColumns(trueMinX, trueMaxX);
    var tiles = [];
    columns.forEach(function(column) {
      var columnTiles = column.getTilesInRange(minY, maxY);
      tiles = tiles.concat(columnTiles);
    }.bind(this));

    return this.getEntitiesFromTiles(tiles);
  }

  /*
   * Returns the combined data from a set of tiles.
   */
  Grid.prototype.getEntitiesFromTiles = function(tiles) {
    var allEntities = [];
    tiles.forEach(function(tile) {
      allEntities = union(allEntities, tile.data);
    });
    return allEntities;
  }

  /*
   * Adds an entity to one or more tiles in the grid.
   * Note that entities need not have a width or height.
   * @TODO Ensure entities that are 3 columns wide or tall get added to all tiles (currently only being added to max four tiles).
   */
  Grid.prototype.add = function(entity) {
    var columnX = getGridValue(entity.x, this.gridSize);
    var rowY = getGridValue(entity.y, this.gridSize);
    var width = entity.width || 0;
    var height = entity.height || 0;
    var widthColumnX = getGridValue(entity.x + width, this.gridSize);
    var heightRowY = getGridValue(entity.y + height, this.gridSize);

    // add entity to every intersecting tile
    for (var x = columnX; x <= widthColumnX; x++) {
      for (var y = rowY; y <= heightRowY; y++) {
        this.addEntity(entity, x, y);
      }
    }

    return entity;
  }

  function getGridValue(actualX, gridSize) {
    return Math.floor(actualX / gridSize);
  }

  Grid.prototype.addEntity = function(entity, x, y) {
    var column = this.findOrAddColumn(x);
    var tile = column.findOrAddTile(y);
    tile.data.push(entity);
  }

  /*
   * Search for a column with a given x value. If not found, create it.
   * @NOTE: This code is essentially duplicated in Column.
   */
   Grid.prototype.findOrAddColumn = function(x) {
    // loop until column is found or is undefined
    for (var i = 0; i < this.columns.length + 1; i++) {
      var column = this.columns[i];
      if (column === undefined || column.x > x) {
        var newColumn = new Column(x);
        // add column as previous item in array
        this.columns.splice(i, 0, newColumn);
        return newColumn;
      } else if (column.x === x) {
        return column;
      }
    }
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

  return Grid;
})()
