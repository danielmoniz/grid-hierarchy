
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

function testCaseSet(grid, entities) {
  runTests('full_iteration', function() {
    blindLoop(entities);
  })

  runTests('targetingTest grid', function() {
    testGridTargeting(grid, { x: 20, y: 20 }, 20);
  })

  runTests('hitTest grid', function() {
    testGridHitting(grid, { x: 20, y: 20 }, 20);
  })
}

function runTestCaseSet(setup) {
  testCaseSet(setup.grid, setup.entities);
}

// a simple way to measure a bunch of checks against some entities
function blindLoop(entities) {
  var someNumber = 20;
  for (var i = 0; i < entities.length; i++) {
    if (entities[i].x < someNumber && entities[i].y < someNumber) {
      // do something, eg. add to array
    }
  }
}

// Does not require unique entities (unlike hitting)
function testGridTargeting(grid, location, width) {
  var entities = grid.getByArea(location.x, location.y, width, width);
  blindLoop(entities);
}

// Requires unique entities (unlike targeting)
function testGridHitting(grid, location, width) {
  var entities = grid.getByAreaUnique(location.x, location.y, width, width);
  blindLoop(entities);
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

  // console.log('-------');
  // console.log(grid);
  // console.log(grid.grid.columns.length);
  // console.log(grid.grid.columns[0].tiles.length);
  // console.log(grid.grid.columns[0].tiles[0].data.length);
  // console.log(grid.grid.columns[0].tiles[1].data.length);
  // console.log('-------');

  return { grid: grid, entities: entities };
}

function runAllTestCases(gridSize) {
  console.log('\n\nGrid size: ' + gridSize + ' =========================================');
  console.log('\nWORST CASES');
  console.log('Worse case: 1 enemy per tile ---------');
  var setup = worstCase(gridSize, 1);
  runTestCaseSet(setup);

  console.log('Worse case: 2 enemies per tile ---------');
  var setup = worstCase(gridSize, 2);
  runTestCaseSet(setup);

  console.log('Worse case: 4 enemies per tile ---------');
  var setup = worstCase(gridSize, 4);
  runTestCaseSet(setup);


  console.log('\n\nSPORATIC CASES');
  console.log('Sporatic case: 0.1 probability, 4 enemy per tile ---------');
  var setup = sporaticCase(gridSize, 0.1, 4);
  runTestCaseSet(setup);

  console.log('Sporatic case: 0.01 probability, 400 enemies per tile ---------');
  var setup = sporaticCase(gridSize, 0.01, 400);
  runTestCaseSet(setup);


  console.log('\n\nEMPTY LEFT HALF CASES');
  console.log('Empty left half case: 10 enemies per tile ---------');
  var setup = emptyLeftHalfCase(gridSize, 10);
  runTestCaseSet(setup);


  console.log('\n\nEMPTY LEFT HALF CASES');
  console.log('Empty left half case: 100 enemies per tile ---------');
  var setup = emptyLeftHalfCase(gridSize, 100);
  runTestCaseSet(setup);

  console.log('\n\nEMPTY LEFT HALF CASES');
  console.log('Empty left half case: 1000 enemies per tile ---------');
  var setup = emptyLeftHalfCase(gridSize, 1000);
  runTestCaseSet(setup);
}

runAllTestCases(1);
runAllTestCases(4);
runAllTestCases(20);
runAllTestCases(40);
// runAllTestCases(49);
// runAllTestCases(50);
// runAllTestCases(51);
// runAllTestCases(100);
// runAllTestCases(101);
// runAllTestCases(52);
// runAllTestCases(53);
// runAllTestCases(54);
// runAllTestCases(55);
runAllTestCases(80);
runAllTestCases(160);
// runAllTestCases(1);
// runAllTestCases(2);
// runAllTestCases(3);
// runAllTestCases(4);
// runAllTestCases(5);
// runAllTestCases(6);
