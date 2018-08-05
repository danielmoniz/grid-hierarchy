
var Grid = require('grid').Grid;

describe('Grid', function() {

  describe('get', function() {
    it('should only return entities if in same region', function() {
      var grid = new Grid(6);
      grid.add({ name: 'One' }, 0, 0);
      grid.add({ name: 'Two' }, 0, 0);
      grid.add({ name: 'Other' }, 1, 0);

      expect(grid.get(0, 0).length).toBe(2);
      expect(grid.get(0, 0)[0].name).toBe('One');
      expect(grid.get(0, 0)[1].name).toBe('Two');
    })

  })

  describe('add', function() {
    it('should add the entity to a single tile if max coords equal min coords', function() {
      var grid = new Grid(4);
      grid.add({ name: 'One' }, 2, 3, 2, 3);

      expect(grid.columns.length).toBe(1);
      expect(grid.columns[0].tiles.length).toBe(1);
      expect(grid.get(2, 3)[0].name).toBe('One');
    })

    it('should add the entity to a single tile if no max coords provided', function() {
      var grid = new Grid(4);
      grid.add({ name: 'One' }, 2, 3);

      expect(grid.columns.length).toBe(1);
      expect(grid.columns[0].tiles.length).toBe(1);
      expect(grid.get(2, 3)[0].name).toBe('One');
    })

    it('should add the entity to multiple tiles based on min-max coordinates', function() {
      var grid = new Grid(4);
      grid.add({}, 2, 3, 4, 5);

      expect(grid.columns.length).toBe(3);
      for (var x = 2; x <= 4; x++) {
        for (var y = 3; y <= 5; y++) {
          expect(grid.get(x, y).length).toBe(1);
        }
      }
    })
  })

  describe('findColumns', function() {
    it('should return no columns if none are in range', function() {
      var grid = new Grid(4);
      grid.add({ name: 'One' }, 4, 0);

      var columns = grid.findColumns(0, 3);
      expect(columns.length).toBe(0);
    })

    it('should return all columns within the given range', function() {
      var grid = new Grid(4);
      grid.add({ name: 'One' }, 0, 0);
      grid.add({ name: 'Two' }, 1, 0);
      grid.add({ name: 'Three' }, 2, 0);
      grid.add({ name: 'Four' }, 3, 0);

      var columns = grid.findColumns(1, 2);
      expect(columns.length).toBe(2);
      expect(columns[0].x).toBe(1)
      expect(columns[1].x).toBe(2)
    })
  })

  describe('getEntitiesFromTiles', function() {
    it('should return a combined list of all entities within a set of tiles', function() {
      var grid = new Grid(4);
      grid.add({ name: 'One' }, 1, 0);
      grid.add({ name: 'Two' }, 1, 1);
      grid.add({ name: 'Three' }, 1, 1);
      grid.add({ name: 'Other' }, 2, 1);

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
    it('should return only entities with a given area', function() {
      var grid = new Grid(4);
      grid.add({ name: 'One' }, 2, 3);
      grid.add({ name: 'Two' }, 3, 3, 5, 5); // partially inside
      grid.add({ name: 'Three' }, 3, 4);
      grid.add({ name: 'Four' }, 4, 4); // outside

      var entities = grid.findEntitiesInArea(2, 3, 3, 4);
      expect(entities.length).toBe(3);
      expect(entities[0].name).toBe('One');
      expect(entities[1].name).toBe('Two');
      expect(entities[2].name).toBe('Three');
    })

    it('should not return duplicate entities with a given area', function() {
      var grid = new Grid(4);
      grid.add({}, 2, 3, 4, 5); // in multiple tiles
      grid.add({}, 3, 3);

      var entities = grid.findEntitiesInArea(2, 3, 4, 5);
      expect(entities.length).toBe(2);
    })
  })

  describe('findOrAddColumn', function() {
    it('should return a given column if it exists', function() {
      var grid = new Grid(4);
      grid.add({}, 2, 3);

      var column = grid.findOrAddColumn(2);
      expect(column.tiles.length).toBe(1);
    })

    it('should add a column if none exist', function() {
      var grid = new Grid(4);
      expect(grid.columns.length).toBe(0);

      var column = grid.findOrAddColumn(3);
      expect(column.x).toBe(3);
      expect(grid.columns.length).toBe(1);

      expect(grid.columns[0].x).toBe(3);
    })

    it('should add a column among existing columns if one cannot be found', function() {
      var grid = new Grid(4);
      grid.add({}, 2, 3);
      grid.add({}, 4, 3);
      expect(grid.columns.length).toBe(2);

      var column = grid.findOrAddColumn(3);
      expect(column.x).toBe(3);
      expect(grid.columns.length).toBe(3);

      expect(grid.columns[0].x).toBe(2);
      expect(grid.columns[1].x).toBe(3);
      expect(grid.columns[2].x).toBe(4);
    })

    it('should add a column after existing columns if one cannot be found', function() {
      var grid = new Grid(4);
      grid.add({}, 2, 3);
      grid.add({}, 3, 3);
      expect(grid.columns.length).toBe(2);

      var column = grid.findOrAddColumn(4);
      expect(column.x).toBe(4);
      expect(grid.columns.length).toBe(3);

      expect(grid.columns[0].x).toBe(2);
      expect(grid.columns[1].x).toBe(3);
      expect(grid.columns[2].x).toBe(4);
    })
  })

})
