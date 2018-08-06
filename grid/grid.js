
var Column = require('./column').Column;

// @TODO Use LinkedList instead of array. Splicing items into an array is (surely?) be less efficient than inserting into a LinkedList, especially if iteration is already performed.

module.exports.Grid = (function() {
  function Grid() {
    this.columns = [];
  }

  /*
   * Return the items in a tile at a position in the grid.
   * If tile does not exist, return an empty array.
   * @NOTE: This method is largely for testing purposes.
   */
  Grid.prototype.get = function(x, y) {
    var column = this.findColumns(x, x)[0];
    if (!column) { return [] }
    return column.getFromTile(y);
  }

  /*
   * Returns all columns that intersect with a range of true x values.
   * NOTE: This means that it may return a column that contains an entity outside the provided range. This is because the column intersects partially with the given range.
   */
  Grid.prototype.findColumns = function(minX, maxX) {
    var allColumns = [];

    for (var i = 0; i < this.columns.length; i++) {
      var column = this.columns[i];
      if (column.x > maxX) { break }
      if (column.x < minX) { continue }
      allColumns.push(column);
    }
    return allColumns;
  }

  /*
   * Returns a list of entities in an area.
   * NOTE: Does not guarantee uniqueness
   * NOTE: Does not guarantee that the enemies even intersect with the area.
   *   It will, however, return only enemies from tiles that intersect.
   */
  Grid.prototype.findEntitiesInArea = function(minX, minY, maxX, maxY) {
    var columns = this.findColumns(minX, maxX);
    var tiles = [];
    columns.forEach(function(column) {
      var columnTiles = column.getTilesInRange(minY, maxY);
      tiles = tiles.concat(columnTiles);
    }.bind(this));

    return this.getEntitiesFromTiles(tiles);
  }

  /*
   * Same as findEntitiesInArea, but ensures unique values.
   * This will be a significantly slower operation.
   * NOTE: This uses ES2015. The goal was to build a library on ES5.
   */
  Grid.prototype.findUniqueEntitiesInArea = function(minX, minY, maxX, maxY) {
    var entities = this.findEntitiesInArea(minX, minY, maxX, maxY);
    return [...new Set(entities)];
    return entities;
  }

  /*
   * Returns the combined data from a set of tiles.
   */
  Grid.prototype.getEntitiesFromTiles = function(tiles) {
    var allEntities = [];
    tiles.forEach(function(tile) {
      allEntities = allEntities.concat(tile.data);
    });
    return allEntities;
  }

  /*
   * Adds an entity to one or more tiles in the grid.
   * Note that entities need not have a width or height.
   * @TODO Ensure entities that are 3 columns wide or tall get added to all tiles (currently only being added to max four tiles).
   */
  Grid.prototype.add = function(entity, minX, minY, maxX, maxY) {
    if (maxX === undefined) { maxX = minX }
    if (maxY === undefined) { maxY = minY }
    // add entity to every intersecting tile
    for (var x = minX; x <= maxX; x++) {
      for (var y = minY; y <= maxY; y++) {
        this.addEntity(entity, x, y);
      }
    }

    return entity;
  }

  Grid.prototype.addEntity = function(entity, x, y) {
    var column = this.findOrAddColumn(x);
    column.addEntity(entity, y);
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

  return Grid;
})()
