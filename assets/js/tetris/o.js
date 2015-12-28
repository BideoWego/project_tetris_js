"use strict";

var O = (function(Block, $) {

  var O = function O(options) {
    Block.call(this, options);

    this.color = 'blue';
    this.rotations = [
      [
        [0, 0, 0, 0],
        [0, 1, 1, 0],
        [0, 1, 1, 0],
        [0, 0, 0, 0]
      ]
    ];

    this.value = this.rotations[this.rotationIndex];
  };

  O.prototype = Object.create(Block.prototype);
  O.prototype.constructor = O;

  return O;

})(Block, $);

