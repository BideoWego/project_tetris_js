"use strict";

var L = (function(Block, $) {

  var L = function L(options) {
    Block.call(this, options);

    this.color = 'magenta';
    this.rotations = [
      [
        [0, 0, 0],
        [1, 1, 1],
        [1, 0, 0]
      ],
      [
        [1, 1, 0],
        [0, 1, 0],
        [0, 1, 0]
      ],
      [
        [0, 0, 1],
        [1, 1, 1],
        [0, 0, 0]
      ],
      [
        [0, 1, 0],
        [0, 1, 0],
        [0, 1, 1]
      ]
    ];

    this.value = this.rotations[this.rotationIndex];
  };

  L.prototype = Object.create(Block.prototype);
  L.prototype.constructor = L;

  return L;

})(Block, $);

