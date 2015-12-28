"use strict";

var I = (function(Block, $) {

  var I = function I(options) {
    Block.call(this, options);

    this.color = 'red';
    this.rotations = [
      [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0]
      ],
      [
        [0, 0, 1, 0],
        [0, 0, 1, 0],
        [0, 0, 1, 0],
        [0, 0, 1, 0]
      ]
    ];

    this.value = this.rotations[this.rotationIndex];
  };

  I.prototype = Object.create(Block.prototype);
  I.prototype.constructor = I;

  return I;

})(Block, $);

