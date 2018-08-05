
var GridController = require('gridController').GridController;

describe('GridController', function() {
  describe('add', function() {
    it('should add an entity to its location in the grid', function() {
      var grid = new GridController();
      var entity = { x: 3, y: 4 };
      grid.add(entity);
      expect(grid.get(3, 4).length).toBe(1);
      expect(grid.get(3, 4)[0]).toBe(entity);
    })

    it('should add an entity to the relevant grid tile based on passed grid size', function() {
      var grid = new GridController(4);
      var entity = { x: 5, y: 6 };
      grid.add(entity);
      expect(grid.get(1, 1).length).toBe(1);
      expect(grid.get(1, 1)[0]).toBe(entity);
    })

    it('should add an entity to the relevant grid tile if on edge/corner of new tile', function() {
      var grid = new GridController(4);
      var entity = { x: 4, y: 8 };
      grid.add(entity);
      expect(grid.get(1, 2).length).toBe(1);
      expect(grid.get(1, 2)[0]).toBe(entity);
    })

    it('should add an entity to the relevant grid tile with non-integer x & y', function() {
      var grid = new GridController(4);
      var entity = { x: 3.999, y: 4.0001 };
      grid.add(entity);
      expect(grid.get(0, 1).length).toBe(1);
      expect(grid.get(0, 1)[0]).toBe(entity);
    })

    it('should add an entity to multiple grid tiles if it overlaps with width and height', function() {
      var grid = new GridController(5);
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
      var grid = new GridController(4);
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

  describe('findEntitiesBySize', function() {
    it('should return entities in region if passing zero width or height', function() {
      var grid = new GridController(4);
      grid.add({ x: 5, y: 6 });
      grid.add({ x: 7, y: 7 });
      grid.add({ x: 8, y: 9 }); // outside (1, 1)

      expect(grid.findEntitiesBySize(6, 6, 0, 0).length).toBe(2)
    })

    it('should return entities in region if not passing width or height', function() {
      var grid = new GridController(4);
      grid.add({ x: 5, y: 6 });
      grid.add({ x: 7, y: 7 });
      grid.add({ x: 8, y: 9 }); // outside (1, 1)

      expect(grid.findEntitiesBySize(6, 6).length).toBe(2)
    })

    it('should return entities in intersecting regions if passing positive width or height', function() {
      var grid = new GridController(4);
      grid.add({ x: 2, y: 3 }); // outside
      grid.add({ x: 5, y: 5 });
      grid.add({ x: 7, y: 7 });
      grid.add({ x: 11, y: 11 });
      grid.add({ x: 12, y: 13 }); // outside

      expect(grid.findEntitiesBySize(6, 6, 4, 4).length).toBe(3)
    })
  })

  describe('findEntitiesInArea', function() {
    it('should return no entities if none are in area', function() {
      var grid = new GridController(4);
      grid.add({ x: 0, y: 0 });
      grid.add({ x: 13, y: 13 });
      grid.add({ x: 13, y: 0 });
      grid.add({ x: 0, y: 13 });

      var entities = grid.findEntitiesInArea(5, 5, 10, 10);
      expect(entities.length).toBe(0);
    })

    it('should return entities if inside area', function() {
      var grid = new GridController(4);
      grid.add({ x: 0, y: 0 }); // outside area
      grid.add({ x: 13, y: 5 });
      grid.add({ x: 7, y: 10 });
      grid.add({ x: 13, y: 5 });
      grid.add({ x: 13, y: 13 }); // outside area

      var entities = grid.findEntitiesInArea(5, 5, 13, 10);
      expect(entities.length).toBe(3);
    })

    it('should return entities if area intersects with their column', function() {
      var grid = new GridController(4);
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
      var grid = new GridController(4);
      grid.add({ x: 0, y: 0, width: 5 }); // in 2 columns
      grid.add({ x: 3, y: 0, width: 6 }); // in 3 columns
      grid.add({ x: 6, y: 0, width: 3 }); // in 2 columns

      var columns = grid.grid.columns;
      expect(columns.length).toBe(3);
      expect(columns[0].tiles[0].data.length).toBe(2);
      expect(columns[1].tiles[0].data.length).toBe(3);
      expect(columns[2].tiles[0].data.length).toBe(2);

      var entities = grid.findEntitiesInArea(2, 3, 8, 9);
      expect(entities.length).toBe(3);
    })
  })

})
