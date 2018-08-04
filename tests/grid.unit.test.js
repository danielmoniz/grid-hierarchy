
var Grid = require('grid').Grid;

describe('Grid', function() {
  describe('add', function() {
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

    it('should add an entity to 3+ grid tiles if it is wide enough', function() {
      var grid = new Grid(4);
      var entity = { x: 3, y: 2, width: 6, height: 1 };
      grid.add(entity);

      expect(grid.get(0, 0).length).toBe(1);
      expect(grid.get(0, 0)[0]).toBe(entity);

      expect(grid.get(1, 0).length).toBe(1);
      expect(grid.get(1, 0)[0]).toBe(entity);

      expect(grid.get(2, 0).length).toBe(1);
      expect(grid.get(2, 0)[0]).toBe(entity);
    })
  })

  describe('get', function() {
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

  describe('findColumns', function() {
    it('should return no columns if none are in range', function() {
      var grid = new Grid(4);
      grid.add({ x: 17, y: 2, name: 'One' });

      var columns = grid.findColumns(0, 15);
      expect(columns.length).toBe(0);
    })

    it('should return all columns within the given range', function() {
      var grid = new Grid(4);
      grid.add({ x: 2, y: 2, name: 'One' }); // x = 0
      grid.add({ x: 5, y: 2, name: 'Two' }); // x = 1
      grid.add({ x: 10, y: 2, name: 'Three' }); // x = 2
      grid.add({ x: 13, y: 2, name: 'Four' }); // x = 3

      var columns = grid.findColumns(5, 11);
      expect(columns.length).toBe(2);
      expect(columns[0].x).toBe(1)
      expect(columns[1].x).toBe(2)
    })

    it('should return columns that partially intersect given range', function() {
      var grid = new Grid(4);
      grid.add({ x: 0, y: 2, name: 'One' }); // x = 0
      grid.add({ x: 7, y: 2, name: 'Two' }); // x = 1

      var columns = grid.findColumns(3, 4);
      expect(columns.length).toBe(2);
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

  describe('findEntitiesInArea', function() {
    it('should return no entities if none are in area', function() {
      var grid = new Grid(4);
      grid.add({ x: 0, y: 0 });
      grid.add({ x: 13, y: 13 });
      grid.add({ x: 13, y: 0 });
      grid.add({ x: 0, y: 13 });

      var entities = grid.findEntitiesInArea(5, 5, 10, 10);
      expect(entities.length).toBe(0);
    })

    it('should return entities if inside area', function() {
      var grid = new Grid(4);
      grid.add({ x: 0, y: 0 }); // outside area
      grid.add({ x: 13, y: 5 });
      grid.add({ x: 7, y: 10 });
      grid.add({ x: 13, y: 5 });
      grid.add({ x: 13, y: 13 }); // outside area

      var entities = grid.findEntitiesInArea(5, 5, 13, 10);
      expect(entities.length).toBe(3);
    })

    it('should return entities if area intersects with their column', function() {
      var grid = new Grid(4);
      grid.add({ x: 0, y: 0 }); // intersects
      grid.add({ x: 13, y: 5 });
      grid.add({ x: 7, y: 10 });
      grid.add({ x: 13, y: 5 });
      grid.add({ x: 14, y: 14 }); // intersects
      grid.add({ x: 16, y: 17 }); // outside area

      var entities = grid.findEntitiesInArea(3, 3, 13, 13);
      expect(entities.length).toBe(5);
    })

    it('should avoid returning duplicate entities from multiple tiles', function() {
      var grid = new Grid(4);
      grid.add({ x: 0, y: 0, width: 5 }); // in 2 columns
      grid.add({ x: 3, y: 0, width: 6 }); // in 3 columns
      grid.add({ x: 6, y: 0, width: 3 }); // in 2 columns

      expect(grid.columns.length).toBe(3);
      expect(grid.columns[0].tiles[0].data.length).toBe(2);
      expect(grid.columns[1].tiles[0].data.length).toBe(3);
      expect(grid.columns[2].tiles[0].data.length).toBe(2);

      var entities = grid.findEntitiesInArea(2, 3, 8, 9);
      expect(entities.length).toBe(3);
    })
  })

})
