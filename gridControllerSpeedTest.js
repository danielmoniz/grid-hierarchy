
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
  console.log("   " + testName + ": " + performance + "ms/run");
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
  console.log('Enemies per tile: 1 ---------');
  var setup = worstCase(gridSize, 1);
  runTestCaseSet(setup);

  console.log('Enemies per tile: 2 ---------');
  var setup = worstCase(gridSize, 2);
  runTestCaseSet(setup);

  console.log('Enemies per tile: 4 ---------');
  var setup = worstCase(gridSize, 4);
  runTestCaseSet(setup);


  console.log('\n\nSPORATIC CASES');
  console.log('Enemies per tile: 4, probability 0.1    ---------');
  var setup = sporaticCase(gridSize, 0.1, 4);
  runTestCaseSet(setup);

  console.log('Enemies per tile: 400, probability 0.01 ---------');
  var setup = sporaticCase(gridSize, 0.01, 400);
  runTestCaseSet(setup);


  console.log('\n\nEMPTY LEFT HALF CASES');
  console.log('Enemies per tile: 10   ---------');
  var setup = emptyLeftHalfCase(gridSize, 10);
  runTestCaseSet(setup);


  console.log('\n\nEMPTY LEFT HALF CASES');
  console.log('Enemies per tile: 100  ---------');
  var setup = emptyLeftHalfCase(gridSize, 100);
  runTestCaseSet(setup);

  console.log('\n\nEMPTY LEFT HALF CASES');
  console.log('Enemies per tile: 1000 ---------');
  var setup = emptyLeftHalfCase(gridSize, 1000);
  runTestCaseSet(setup);
}

runAllTestCases(1);
runAllTestCases(4);
runAllTestCases(8);
runAllTestCases(10);
runAllTestCases(20);
runAllTestCases(40);
runAllTestCases(50);
