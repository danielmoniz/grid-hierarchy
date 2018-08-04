
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
    var column = this.findColumn(x);

    for (var j = 0; j < column.tiles.length; j++) {
      var tile = column.tiles[j];
      if (tile.y > y) { return [] }
      if (tile.y < y) { continue }
      return tile.data;
    }
    return []
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
    return getNewColumn(x);
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

  // @TODO Have a method that iterates over a column (from one x value to another) and returns the data in all of those tiles
  Grid.prototype.getFromColumn = function(trueY, trueMinX, trueMaxX) {
    var y = getGridValue(trueY, this.gridSize);
    var minX = getGridValue(trueMinX, this.gridSize);
    var maxX = getGridValue(trueMaxX, this.gridSize);

    var column = this.findColumn(y);
  }

  /*
   * Returns a list of all tiles in a given range within a column. Needs to be given a column number, not an actual x value.
   */
  Grid.prototype.getTilesInRange = function(column, minY, maxY) {
    var allTiles = [];
    for (var i = 0; i < column.tiles.length; i++) {
      var tile = column.tiles[i];
      if (tile.y < minY) { continue }
      if (tile.y > maxY) { break }
      allTiles.push(tile);
    }
    return allTiles;
  }

  Grid.prototype.findEntitiesInArea = function(trueMinX, trueMinY, trueMaxX, trueMaxY) {
    var minX = getGridValue(trueMinX, this.gridSize);
    var maxX = getGridValue(trueMaxX, this.gridSize);
    var minY = getGridValue(trueMinY, this.gridSize);
    var maxY = getGridValue(trueMaxY, this.gridSize);

    var columns = this.findColumns(trueMinX, trueMaxX);
    var tiles = [];
    columns.forEach(function(column) {
      var columnTiles = this.getTilesInRange(column, minY, maxY);
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
        addEntity(entity, this.columns, x, y);
      }
    }

    return entity;
  }

  function getGridValue(actualX, gridSize) {
    return Math.floor(actualX / gridSize);
  }

  function addEntity(entity, columns, x, y) {
    var column = findOrAddColumn(columns, x);
    var tile = findOrAddTile(column.tiles, y);
    tile.data.push(entity);
  }

  /*
   * Searches for a column given an x value.
   * If the column is not found, ie. it is passed in the loop,
   * insert it into the collection. Otherwise, return it.
   */
  function findOrAddColumn(columns, x) {
    var newColumn = getNewColumn(x);
    return findOrBuildEntity(columns, newColumn, 'x', x);
  }

  /*
   * Searches for a tile given an y value.
   * If the tile is not found, ie. it is passed in the loop,
   * insert it into the collection. Otherwise, return it.
   */
  function findOrAddTile(tiles, y) {
    var newTile = getNewTile(y);
    return findOrBuildEntity(tiles, newTile, 'y', y);
  }

  function findOrBuildEntity(collection, newEntity, dimension, value) {
    // loop until entity is found or is undefined
    for (var i = 0; i < collection.length + 1; i++) {
      // console.log('searching for tile at', i);
      var entity = collection[i];
      if (entity === undefined || entity[dimension] > value) {
        // add entity as previous item in array
        collection.splice(i, 0, newEntity);
        return newEntity;
      } else if (entity[dimension] === value) {
        return entity;
      }
    }
  }

  function getNewColumn(x) {
    return { x: x, tiles: [] };
  }

  function getNewTile(y) {
    return { y: y, data: [] }
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
