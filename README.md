# grid-hierarchy

This is a library to allow for efficient storage and retrieval of location-based information. This is not a collision engine. Returned results are suggestions only for what entities might be in that area.

To install dependencies:

    npm install

To run the tests:

    npm test

Or, to run them continuously:

    npm test:watch


## Purpose

This allows for entities to be stored in a grid-based system (using columns and tiles). Efficient queries can then be made as to which entities are in certain areas. This is perfect for games.

For example, you may wish to determine which enemy units are in range of a specific unit. Iterating through every enemy unit will be extremely inefficient. Instead, use this library and query for enemy units within a certain boundary.

**NOTE**: this library may return entities that are not actually within your query boundaries. This is because it is returning entities that are inside of tiles that *do* intersect with the boundary you queried.


## Performance

To run the speed tests:

    node gridControllerSpeedTest.js

The purpose of the speed test script is to compare:
* iterating over every entity
* using the Grid to find a set of entities
* using the Grid to find a set of *unique* entities

Note that finding unique enemies is vastly less performant, but it's not always necessary. For example, if you simply need to pick the closest entity to a given coordinate, all you need is a list of non-unique entities. On the other hand, if you need to act on a set of nearby enemies, you'll want a unique list.

Each test is run a number of times and averaged for greater accuracy.


>### Test types
>##### Worst cases
Worst cases place some number of entities on every tile on the map. This removes the advantages the Grid has when there are entities in only some of the tiles.
>
>##### Sporatic cases
Here we place some number of entities on only some of the tiles by using random numbers. This accounts for the cases where entities are grouped up into specific tiles and are not evenly distributed.
>
>##### Empty Left Half cases
Entities are placed on only the right half of the map. The testing is performed from a coordinate on the left half. This means that there is an empty space around the coordinate, and the algorithm therefore gets to skip entire columns before return zero (or few) results.
