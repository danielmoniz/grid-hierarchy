
var GridController = require('gridController').GridController;

describe('GridController', function() {
  describe('get', function() {
    it('should return entities in region if passing zero width or height', function() {
      var grid = new GridController(4);
      grid.add({ x: 5, y: 6 });
      grid.add({ x: 7, y: 7 });
      grid.add({ x: 8, y: 9 }); // outside (1, 1)

      expect(grid.get(1, 1, 0, 0).length).toBe(2)
    })

    it('should return entities in region if not passing width or height', function() {
      var grid = new GridController(4);
      grid.add({ x: 5, y: 6 });
      grid.add({ x: 7, y: 7 });
      grid.add({ x: 8, y: 9 }); // outside (1, 1)

      expect(grid.get(1, 1).length).toBe(2)
    })

    it.skip('should return entities in regions if passing positive width or height', function() {
      var grid = new GridController(4);
      grid.add({ x: 5, y: 6 });
      grid.add({ x: 7, y: 7 });
      grid.add({ x: 8, y: 9 });

      expect(grid.get(5, 5, 4, 4).length).toBe(3)
    })
  })

  describe('getFromColumn', function() {
    it.skip('should return entities from one tile if minX equals maxX', function() {
      var grid = new GridController(4);
      grid.add({ x: 5, y: 6 });
      grid.add({ x: 7, y: 7 });
      grid.add({ x: 8, y: 9 }); // outside

      expect(grid.getFromColumn())
    })
  })

})