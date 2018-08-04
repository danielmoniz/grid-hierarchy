
var GridController = require('gridController').GridController;

describe('GridController', function() {
  describe('get/add', function() {
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

})
