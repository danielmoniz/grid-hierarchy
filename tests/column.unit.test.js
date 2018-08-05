
// @TODO Shouldn't need to import Grid
var Grid = require('grid').Grid;
var Column = require('column').Column;

describe('Column', function() {

  describe('getTilesInRange', function() {
    it('should return a list of all tiles in a range within a column', function() {
      var grid = new Grid(4);
      var column = new Column(0);
      column.addEntity({}, 1);
      column.addEntity({}, 2);
      column.addEntity({}, 2);
      column.addEntity({}, 3);

      var tiles = column.getTilesInRange(0, 2);
      expect(tiles.length).toBe(2);
      expect(tiles[0].y).toBe(1);
      expect(tiles[1].y).toBe(2);
    })
  })

})
