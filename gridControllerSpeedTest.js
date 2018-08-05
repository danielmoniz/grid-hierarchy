
var GridController = require('./grid/gridController').GridController;

var mapSize = {
  width: 100,
  height: 100,
};

function runTests(testName, testCallback) {
  var numTests = 10;
  var startTime = new Date();
  for (var i = 0; i < numTests; i++) {
    var time =
    testCallback();
  }
  var endTime = new Date();
  var performance = (endTime - startTime) / numTests;
  console.log(testName + ": " + performance + "ms/run");
  return performance
}

function targetingTest(grid, entities) {
  runTests('targetingTest full_iteration', function() {
    for (var i = 0; i < entities.length; i++) {
      // perform check on entities
    }
  })

  runTests('targetingTest grid', function() {
    testGrid(grid, { x: 0, y: 0 }, 20);
  })
}

function testGrid(grid, location, width) {
  // runTests('targetingTest grid', function() {
  grid.getByArea(location.x, location.y, width, width);
  // })
}

function worstCase(gridSize, entitiesPerTile) {
  var grid = new GridController(gridSize);
  var entities = [];

  for (var x = 0; x < mapSize.width; x++) {
    for (var y = 0; y < mapSize.height; y++) {
      for (var i = 0; i < entitiesPerTile; i++) {
        var entity = grid.add({ x: x, y: y });
        entities.push(entity);
      }
    }
  }

  return { grid: grid, entities: entities };
}

function sporaticCase(gridSize, probability, entitiesPerTile) {
  var grid = new GridController(gridSize);
  var entities = [];

  for (var x = 0; x < mapSize.width; x++) {
    for (var y = 0; y < mapSize.height; y++) {
      for (var i = 0; i < entitiesPerTile; i++) {
        if (Math.random() >= probability) { continue }
        var entity = grid.add({ x: x, y: y });
        entities.push(entity);
      }
    }
  }

  return { grid: grid, entities: entities };
}

function emptyLeftHalfCase(gridSize, entitiesPerTile) {
  var grid = new GridController(gridSize);
  var entities = [];

  for (var x = mapSize.width / 2; x < mapSize.width; x++) {
    for (var y = 0; y < mapSize.height; y++) {
      for (var i = 0; i < entitiesPerTile; i++) {
        var entity = grid.add({ x: x, y: y });
        entities.push(entity);
      }
    }
  }

  return { grid: grid, entities: entities };
}

function runAllTestCases(gridSize) {
  console.log('Grid size: ' + gridSize + ' =========================================');
  console.log('\n\nWORST CASES');
  console.log('Worse case: 1 enemy per tile ---------');
  var setup = worstCase(gridSize, 1);
  targetingTest(setup.grid, setup.entities);

  console.log('Worse case: 2 enemies per tile ---------');
  var setup = worstCase(gridSize, 2);
  targetingTest(setup.grid, setup.entities);

  console.log('Worse case: 4 enemies per tile ---------');
  var setup = worstCase(gridSize, 4);
  targetingTest(setup.grid, setup.entities);


  console.log('\n\nSPORATIC CASES');
  console.log('Sporatic case: 0.1 probability, 1 enemy per tile ---------');
  var setup = sporaticCase(gridSize, 0.1, 1);
  targetingTest(setup.grid, setup.entities);

  console.log('Sporatic case: 0.1 probability, 4 enemies per tile ---------');
  var setup = sporaticCase(gridSize, 0.1, 4);
  targetingTest(setup.grid, setup.entities);

  console.log('Sporatic case: 0.01 probability, 4 enemies per tile ---------');
  var setup = sporaticCase(gridSize, 0.01, 4);
  targetingTest(setup.grid, setup.entities);

  console.log('Sporatic case: 0.01 probability, 40 enemies per tile ---------');
  var setup = sporaticCase(gridSize, 0.01, 40);
  targetingTest(setup.grid, setup.entities);

  console.log('\n\nEMPTY LEFT HALF CASES');
  console.log('Empty left half case: 1000 enemies per tile ---------');
  var setup = emptyLeftHalfCase(gridSize, 1000);
  targetingTest(setup.grid, setup.entities);
}

runAllTestCases(1);
runAllTestCases(4);
runAllTestCases(20);
runAllTestCases(80);
