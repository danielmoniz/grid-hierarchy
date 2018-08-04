
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

  // @TODO Have a method that iterates over a column (from one x value to another) and returns the data in all of those tiles
  Grid.prototype.getFromColumn = function(trueY, trueMinX, trueMaxX) {
    var y = getGridValue(trueY, this.gridSize);
    var minX = getGridValue(trueMinX, this.gridSize);
    var maxX = getGridValue(trueMaxX, this.gridSize);

    var column = this.findColumn(y);
  }

  /*
   * Returns a column given an x value. If no column found, returns a new one.
   */
  Grid.prototype.findColumn = function(x) {
    for (var i = 0; i < this.columns.length; i++) {
      var column = this.columns[i];
      if (column.x > x) { break }
      if (column.x < x) { continue }
      return column
    }
    return getNewColumn(x)
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

  /*
   * Returns the combined data from a set of tiles.
   */
  Grid.prototype.getEntitiesFromTiles = function(tiles) {
    var allEntities = [];
    tiles.forEach(function(tile) {
      allEntities = allEntities.concat(tile.data)
    });
    return allEntities;
  }

  /*
   * Adds an entity to one or more tiles in the grid.
   * Note that entities need not have a width or height.
   */
  Grid.prototype.add = function(entity) {
    var columnX = getGridValue(entity.x, this.gridSize);
    var rowY = getGridValue(entity.y, this.gridSize);
    var width = entity.width || 0;
    var height = entity.height || 0;
    var widthColumnX = getGridValue(entity.x + width, this.gridSize);
    var heightRowY = getGridValue(entity.y + height, this.gridSize);

    addEntity(entity, this.columns, columnX, rowY);

    if (widthColumnX !== columnX) {
      addEntity(entity, this.columns, widthColumnX, rowY);
    }

    if (heightRowY !== rowY) {
      addEntity(entity, this.columns, columnX, heightRowY);
    }

    if (widthColumnX !== columnX && heightRowY !== rowY) {
      addEntity(entity, this.columns, widthColumnX, heightRowY);
    }
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
    return findOrAddEntity(columns, newColumn, 'x', x);
  }

  /*
   * Searches for a tile given an y value.
   * If the tile is not found, ie. it is passed in the loop,
   * insert it into the collection. Otherwise, return it.
   */
  function findOrAddTile(tiles, y) {
    var newTile = getNewTile(y);
    return findOrAddEntity(tiles, newTile, 'y', y);
  }

  function findOrAddEntity(collection, newEntity, dimension, value) {
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

  return Grid;
})()
