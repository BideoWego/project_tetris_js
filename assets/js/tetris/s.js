"use strict";

var S = (function(Block, $) {

  var S = function S(options) {
    Block.call(this, options);

    this.color = 'cyan';
    this.rotations = [
      [
        [0, 0, 0],
        [0, 1, 1],
        [1, 1, 0]
      ],
      [
        [0, 1, 0],
        [0, 1, 1],
        [0, 0, 1]
      ]
    ];

    this.value = this.rotations[this.rotationIndex];
  };

  S.prototype = Object.create(Block.prototype);
  S.prototype.constructor = S;

  return S;

})(Block, $);

