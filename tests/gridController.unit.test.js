
var GridController = require('gridController').GridController;

describe('GridController', function() {
  describe('get', function() {
    it('should return entities in region if passing zero width or height', function() {
      var grid = new GridController(4);
      grid.add({ x: 5, y: 6 });
      grid.add({ x: 7, y: 7 });
      grid.add({ x: 8, y: 9 }); // outside (1, 1)

      expect(grid.get(6, 6, 0, 0).length).toBe(2)
    })

    it('should return entities in region if not passing width or height', function() {
      var grid = new GridController(4);
      grid.add({ x: 5, y: 6 });
      grid.add({ x: 7, y: 7 });
      grid.add({ x: 8, y: 9 }); // outside (1, 1)

      expect(grid.get(6, 6).length).toBe(2)
    })

    it('should return entities in intersecting regions if passing positive width or height', function() {
      var grid = new GridController(4);
      grid.add({ x: 2, y: 3 }); // outside
      grid.add({ x: 5, y: 5 });
      grid.add({ x: 7, y: 7 });
      grid.add({ x: 11, y: 11 });
      grid.add({ x: 12, y: 13 }); // outside

      expect(grid.get(6, 6, 4, 4).length).toBe(3)
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
