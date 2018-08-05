
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

  return Column;
})()
