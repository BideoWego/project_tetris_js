"use strict";

var J = (function(Block, $) {

  var J = function J(options) {
    Block.call(this, options);

    this.color = 'yellow';
    this.rotations = [
      [
        [0, 0, 0],
        [1, 1, 1],
        [0, 0, 1]
      ],
      [
        [0, 1, 0],
        [0, 1, 0],
        [1, 1, 0]
      ],
      [
        [1, 0, 0],
        [1, 1, 1],
        [0, 0, 0]
      ],
      [
        [0, 1, 1],
        [0, 1, 0],
        [0, 1, 0]
      ]
    ];

    this.value = this.rotations[this.rotationIndex];
  };

  J.prototype = Object.create(Block.prototype);
  J.prototype.constructor = J;

  return J;

})(Block, $);

