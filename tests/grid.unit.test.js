
var Grid = require('grid').Grid;

describe('Grid', function() {
  describe('add/get', function() {
    it('should add an entity to its location in the grid', function() {
      var grid = new Grid();
      var entity = { x: 3, y: 4 };
      grid.add(entity);
      expect(grid.get(3, 4).length).toBe(1);
      expect(grid.get(3, 4)[0]).toBe(entity);
    })

    it('should add an entity to the relevant grid tile', function() {
      var grid = new Grid(4);
      var entity = { x: 5, y: 6 };
      grid.add(entity);
      expect(grid.get(1, 1).length).toBe(1);
      expect(grid.get(1, 1)[0]).toBe(entity);
    })

    it('should add an entity to the relevant grid tile if on edge/corner of new tile', function() {
      var grid = new Grid(4);
      var entity = { x: 4, y: 8 };
      grid.add(entity);
      expect(grid.get(1, 2).length).toBe(1);
      expect(grid.get(1, 2)[0]).toBe(entity);
    })

    it('should add an entity to the relevant grid tile with non-integer x & y', function() {
      var grid = new Grid(4);
      var entity = { x: 3.999, y: 4.0001 };
      grid.add(entity);
      expect(grid.get(0, 1).length).toBe(1);
      expect(grid.get(0, 1)[0]).toBe(entity);
    })

    it('should add an entity to multiple grid tiles if it overlaps with width and height', function() {
      var grid = new Grid(5);
      var entity = { x: 3, y: 3, width: 3, height: 3 };
      grid.add(entity);

      expect(grid.get(0, 0).length).toBe(1);
      expect(grid.get(0, 0)[0]).toBe(entity);

      expect(grid.get(1, 0).length).toBe(1);
      expect(grid.get(1, 0)[0]).toBe(entity);

      expect(grid.get(0, 1).length).toBe(1);
      expect(grid.get(0, 1)[0]).toBe(entity);

      expect(grid.get(1, 1).length).toBe(1);
      expect(grid.get(1, 1)[0]).toBe(entity);
    })

    it('should only return entities if in same region', function() {
      var grid = new Grid(6);
      grid.add({ x: 5, y: 3, name: 'One' });
      grid.add({ x: 4, y: 4, name: 'Two' });
      grid.add({ x: 7, y: 8, name: 'Other' });

      expect(grid.get(0, 0).length).toBe(2);
      expect(grid.get(0, 0)[0].name).toBe('One');
      expect(grid.get(0, 0)[1].name).toBe('Two');
    })

  })

  describe('findColumn', function() {
    it('should return an empty column if no column can be found', function() {
      var grid = new Grid(6);

      var column = grid.findColumn(19);
      expect(column.tiles.length).toBe(0);
    })

    it('should return a column with the relevant tiles', function() {
      var grid = new Grid(4);
      grid.add({ x: 5, y: 2, name: 'One' }); // tile 1
      grid.add({ x: 5, y: 6, name: 'Two' }); // tile 2
      grid.add({ x: 5, y: 6, name: 'Three' }); // tile 2
      grid.add({ x: 9, y: 6, name: 'Other' }); // different column

      var column = grid.findColumn(1);
      expect(column.tiles.length).toBe(2);
      expect(column.tiles[0].data[0].name).toBe('One');
      expect(column.tiles[1].data[0].name).toBe('Two');
    })
  })

  describe('getTilesInRange', function() {
    it('should return a list of all tiles in a range within a column', function() {
      var grid = new Grid(4);
      grid.add({ x: 5, y: 6, name: 'One' }); // tile 1, y=1
      grid.add({ x: 5, y: 9, name: 'Two' }); // tile 2, y=2
      grid.add({ x: 5, y: 9, name: 'Three' }); // tile 2, y=2
      grid.add({ x: 5, y: 15, name: 'Other' }); // outside tile, tile 3
      grid.add({ x: 9, y: 6, name: 'Other' }); // different column

      var column = grid.columns[0];
      var tiles = grid.getTilesInRange(column, 0, 2);
      expect(tiles.length).toBe(2);
      expect(tiles[0].y).toBe(1);
      expect(tiles[1].y).toBe(2);
    })
  })

  describe('getEntitiesFromTiles', function() {
    it('should return a combined list of all entities within a set of tiles', function() {
      var grid = new Grid(4);
      grid.add({ x: 5, y: 2, name: 'One' }); // tile 1
      grid.add({ x: 5, y: 6, name: 'Two' }); // tile 2
      grid.add({ x: 5, y: 6, name: 'Three' }); // tile 2
      grid.add({ x: 9, y: 6, name: 'Other' }); // different column

      var tiles = grid.columns[0].tiles;
      expect(tiles.length).toBe(2);

      var entities = grid.getEntitiesFromTiles(tiles);
      expect(entities.length).toBe(3);
      expect(entities[0].name).toBe('One');
      expect(entities[1].name).toBe('Two');
      expect(entities[2].name).toBe('Three');
    })
  })

})
