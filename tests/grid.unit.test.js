
var Grid = require('grid').Grid;

describe('Grid', function() {

  describe('get', function() {
    it('should only return entities if in same region', function() {
      var grid = new Grid(6);
      grid.insert({ name: 'One' }, 0, 0);
      grid.insert({ name: 'Two' }, 0, 0);
      grid.insert({ name: 'Other' }, 1, 0);

      expect(grid.get(0, 0).length).toBe(2);
      expect(grid.get(0, 0)[0].name).toBe('One');
      expect(grid.get(0, 0)[1].name).toBe('Two');
    })

  })

  describe('insert', function() {
    it('should insert the entity to a single tile if max coords equal min coords', function() {
      var grid = new Grid(4);
      grid.insert({ name: 'One' }, 2, 3, 2, 3);

      expect(grid.columns.length).toBe(1);
      expect(grid.columns[0].tiles.length).toBe(1);
      expect(grid.get(2, 3)[0].name).toBe('One');
    })

    it('should add the entity to a single tile if no max coords provided', function() {
      var grid = new Grid(4);
      grid.insert({ name: 'One' }, 2, 3);

      expect(grid.columns.length).toBe(1);
      expect(grid.columns[0].tiles.length).toBe(1);
      expect(grid.get(2, 3)[0].name).toBe('One');
    })

    it('should add a large/overlapping entity to special collection', function() {
      var grid = new Grid(4);
      var item = grid.insert({}, 2, 3, 4, 5);

      expect(grid.columns.length).toBe(0);
      expect(grid.overlap.length).toBe(1);
      expect(grid.overlap).toContain(item);
    })
  })

  describe('findColumns', function() {
    it('should return no columns if none are in range', function() {
      var grid = new Grid(4);
      grid.insert({ name: 'One' }, 4, 0);

      var columns = grid.findColumns(0, 3);
      expect(columns.length).toBe(0);
    })

    it('should return all columns within the given range', function() {
      var grid = new Grid(4);
      grid.insert({ name: 'One' }, 0, 0);
      grid.insert({ name: 'Two' }, 1, 0);
      grid.insert({ name: 'Three' }, 2, 0);
      grid.insert({ name: 'Four' }, 3, 0);

      var columns = grid.findColumns(1, 2);
      expect(columns.length).toBe(2);
      expect(columns[0].x).toBe(1)
      expect(columns[1].x).toBe(2)
    })
  })

  describe('getEntitiesFromTiles', function() {
    it('should return a combined list of all entities within a set of tiles', function() {
      var grid = new Grid(4);
      grid.insert({ name: 'One' }, 1, 0);
      grid.insert({ name: 'Two' }, 1, 1);
      grid.insert({ name: 'Three' }, 1, 1);
      grid.insert({ name: 'Other' }, 2, 1);

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
      grid.insert({ name: 'One' }, 2, 3);
      grid.insert({ name: 'Two' }, 3, 3); // partially inside
      grid.insert({ name: 'Three' }, 3, 4);
      grid.insert({ name: 'Four' }, 4, 4); // outside

      var entities = grid.findEntitiesInArea(2, 3, 3, 4);
      expect(entities.length).toBe(3);
      expect(entities[0].name).toBe('One');
      expect(entities[1].name).toBe('Two');
      expect(entities[2].name).toBe('Three');
    })

    it('should return unique entities even when entities have width/height', function() {
      var grid = new Grid(4);
      grid.insert({ name: 'One' }, 2, 2, 4, 4); // makes a 3x3 square

      var entities = grid.findEntitiesInArea(2, 2, 4, 4);
      expect(entities.length).toBe(1);
    })

    it('should return unique entities with a given area', function() {
      var grid = new Grid(4);
      var item1 = grid.insert({ name: 'One' }, 2, 2);
      var item2 = grid.insert({ name: 'Two' }, 3, 3, 5, 5); // multiple tiles inside
      var item3 = grid.insert({ name: 'Three' }, 3, 3);
      var item4 = grid.insert({ name: 'Four' }, 4, 4); // outside area

      var entities = grid.findEntitiesInArea(2, 2, 3, 4);
      expect(entities.length).toBe(3);
      expect(entities).toContain(item1);
      expect(entities).toContain(item2);
      expect(entities).toContain(item3);
      expect(entities).not.toContain(item4);
    })
  })

  describe('findUniqueEntitiesInArea', function() {
    it('should not return duplicate entities with a given area', function() {
      var grid = new Grid(4);
      grid.insert({}, 2, 3, 4, 5); // in multiple tiles
      grid.insert({}, 3, 3);

      var entities = grid.findUniqueEntitiesInArea(2, 3, 4, 5);
      expect(entities.length).toBe(2);
    })
  })

  describe('findOrAddColumn', function() {
    it('should return a given column if it exists', function() {
      var grid = new Grid(4);
      grid.insert({}, 2, 3);

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
      grid.insert({}, 2, 3);
      grid.insert({}, 4, 3);
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
      grid.insert({}, 2, 3);
      grid.insert({}, 3, 3);
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
