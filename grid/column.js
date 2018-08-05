
module.exports.Column = (function() {
  function Column(xValue) {
    this.x = xValue;
    this.tiles = [];
  }

  /*
   * Returns a list of all tiles in a given range within a column.
   */
  Column.prototype.getTilesInRange = function(minY, maxY) {
    var allTiles = [];
    for (var i = 0; i < this.tiles.length; i++) {
      var tile = this.tiles[i];
      if (tile.y < minY) { continue }
      if (tile.y > maxY) { break }
      allTiles.push(tile);
    }
    return allTiles;
  }

  Column.prototype.findTile = function(y) {
    for (var j = 0; j < this.tiles.length; j++) {
      var tile = this.tiles[j];
      if (tile.y > y) { return [] }
      if (tile.y < y) { continue }
      return tile.data;
    }
    return [];
  }

  /*
   * Search for a tile with a given y value. If not found, create it.
   */
  Column.prototype.findOrAddTile = function(y) {
    // loop until tile is found or is undefined
    for (var i = 0; i < this.tiles.length + 1; i++) {
      var tile = this.tiles[i];
      if (tile === undefined || tile.y > y) {
        var newTile = getNewTile(y);
        // add tile as previous item in array
        this.tiles.splice(i, 0, newTile);
        return newTile;
      } else if (tile.y === y) {
        return tile;
      }
    }
  }

  function getNewTile(y) {
    return { y: y, data: [] }
  }

  return Column;
})()
