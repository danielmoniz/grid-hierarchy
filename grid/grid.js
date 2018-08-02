
// @TODO Use LinkedList instead of array. Splicing items into an array is (surely?) be less efficient than inserting into a LinkedList, especially if iteration is already performed.

module.exports.Grid = (function() {
  function Grid(gridSize, zeroes) {
    this.gridSize = gridSize || 1
    this.data = {};
    this.zeroesInKey = zeroes || 0;
    this.columns = []
  }

  /*
   * Return the items in a tile at a position in the grid.
   * If tile does not exist, return an empty array.
   */
  Grid.prototype.get = function(x, y) {
    for (var i = 0; i < this.columns.length; i++) {
      var column = this.columns[i];
      if (column.x > x) { return [] }
      if (column.x < x) { continue }

      for (var j = 0; j < column.tiles.length; j++) {
        var tile = column.tiles[j];
        if (tile.y > y) { return [] }
        if (tile.y < y) { continue }
        return tile.data;
      }
    }
    return []
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

    addEntity(entity, this.columns, columnX, rowY)

    if (widthColumnX !== columnX) {
      addEntity(entity, this.columns, widthColumnX, rowY)
    }

    if (heightRowY !== rowY) {
      addEntity(entity, this.columns, columnX, heightRowY)
    }

    if (widthColumnX !== columnX && heightRowY !== rowY) {
      addEntity(entity, this.columns, widthColumnX, heightRowY)
    }
  }

  function getGridValue(actualX, gridSize) {
    return Math.floor(actualX / gridSize)
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
    return findOrAddEntity(columns, newColumn, 'x', x)
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
