
module.exports.Grid = (function() {
  function Grid(gridSize, zeroes) {
    this.gridSize = gridSize || 1
    this.data = {};
    this.zeroesInKey = zeroes || 0;
    this.columns = []
  }

  /*
   * Return the tile at a position in the grid.
   * If it does not exist, return an empty array.
   */
  Grid.prototype.get = function(x, y) {
    for (var i = 0; i < this.columns.length; i++) {
      var column = this.columns[i];
      if (column.x > x) { return [] }
      if (column.x < x) { continue }

      for (var j = 0; j < column.length; j++) {
        var tile = column[j];
        if (tile.y > y) { return [] }
        if (tile.y < y) { continue }
        return tile;
      }
    }
  }

  // for now assumes that entities have no width/height
  Grid.prototype.add = function(entity) {
    var columnX = Math.floor(entity.x / this.gridSize);
    var rowY = Math.floor(entity.y / this.gridSize);

    var correctColumn;
    for (var i = 0; i < this.columns.length + 1; i++) {
      console.log('searching for column at', i);
      var column = this.columns[i];
      if (column === undefined || column.x > columnX) {
        // add column as previous item in array
        correctColumn = getNewColumn(columnX);
        this.columns.splice(i, 0, correctColumn);
        break;
      } else if (column.x === columnX) {
        correctColumn = column;
        break;
      }
    }

    var correctTile;
    for (var j = 0; j < correctColumn.length + 1; j++) {
      console.log('searching for tile at', j);
      var tile = correctColumn[j];
      if (tile === undefined || tile.y > rowY) {
        // add new tile before this point
        correctTile = getNewTile(rowY);
        correctColumn.splice(j, 0, correctTile);
        break;
      } else if (tile.y === rowY) {
        correctTile = tile;
        break;
      }
    }

    correctTile.push(entity);
  }

  function getNewColumn(x) {
    var column = [];
    column.x = x;
    return column;
  }

  function getNewTile(y) {
    var tile = [];
    tile.y = y;
    return tile;
  }

  return Grid;
})()
