
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

    it('should add an entity to the relevant grid tile based on passed grid size', function() {
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

  describe('findColumns', function() {
    it('should return no columns if none are in range', function() {
      var grid = new Grid(4);
      grid.add({ x: 17, y: 2, name: 'One' }); // column 4

      var columns = grid.findColumns(0, 3);
      expect(columns.length).toBe(0);
    })

    it('should return all columns within the given range', function() {
      var grid = new Grid(4);
      grid.add({ x: 2, y: 2, name: 'One' }); // x = 0
      grid.add({ x: 5, y: 2, name: 'Two' }); // x = 1
      grid.add({ x: 10, y: 2, name: 'Three' }); // x = 2
      grid.add({ x: 13, y: 2, name: 'Four' }); // x = 3

      var columns = grid.findColumns(1, 2);
      expect(columns.length).toBe(2);
      expect(columns[0].x).toBe(1)
      expect(columns[1].x).toBe(2)
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
