
// @TODO Shouldn't need to import Grid
var Grid = require('grid').Grid;
var Column = require('column').Column;

describe('Column', function() {

  describe('getTilesInRange', function() {
    it('should return a list of all tiles in a range within a column', function() {
      var grid = new Grid(4);
      grid.add({ x: 5, y: 6, name: 'One' }); // tile 1, y=1
      grid.add({ x: 5, y: 9, name: 'Two' }); // tile 2, y=2
      grid.add({ x: 5, y: 9, name: 'Three' }); // tile 2, y=2
      grid.add({ x: 5, y: 15, name: 'Other' }); // outside tile, tile 3
      grid.add({ x: 9, y: 6, name: 'Other' }); // different column

      var column = grid.columns[0];
      var tiles = column.getTilesInRange(0, 2);
      expect(tiles.length).toBe(2);
      expect(tiles[0].y).toBe(1);
      expect(tiles[1].y).toBe(2);
    })
  })

})
