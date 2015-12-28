"use strict";

var T = (function(Block, $) {

  var T = function T(options) {
    Block.call(this, options);

    this.color = 'lime';
    this.rotations = [
      [
        [0, 0, 0],
        [1, 1, 1],
        [0, 1, 0]
      ],
      [
        [0, 1, 0],
        [1, 1, 0],
        [0, 1, 0]
      ],
      [
        [0, 1, 0],
        [1, 1, 1],
        [0, 0, 0]
      ],
      [
        [0, 1, 0],
        [0, 1, 1],
        [0, 1, 0]
      ]
    ];

    this.value = this.rotations[this.rotationIndex];
  };

  T.prototype = Object.create(Block.prototype);
  T.prototype.constructor = T;

  return T;

})(Block, $);

