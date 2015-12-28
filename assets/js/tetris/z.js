"use strict";

var Z = (function(Block, $) {

  var Z = function Z(options) {
    Block.call(this, options);

    this.color = 'orange';
    this.rotations = [
      [
        [0, 0, 0],
        [1, 1, 0],
        [0, 1, 1]
      ],
      [
        [0, 0, 1],
        [0, 1, 1],
        [0, 1, 0]
      ]
    ];

    this.value = this.rotations[this.rotationIndex];
  };

  Z.prototype = Object.create(Block.prototype);
  Z.prototype.constructor = Z;

  return Z;

})(Block, $);

