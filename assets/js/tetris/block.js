"use strict";

var Block = (function($) {

  var Block = function Block(options) {
    this.color = 'black';
    this.rotations = [];
    this.rotationIndex = 0;
    this.value = null;
    this.x = 4;
    this.y = 0;
    this._grid = null;

    this.initialize();
  };

  Block.prototype.initialize = function() {};

  Block.prototype.grid = function(grid) {
    if (grid !== undefined) {
      this._grid = grid;
    }
    return this._grid;
  };

  Block.prototype.stop = function() {
    for (var y = 0; y < this.value.length; y++) {
      for (var x = 0; x < this.value[y].length; x++) {
        var blockPiece = this.value[y][x];
        if (blockPiece > 0) {
          this._grid.spaces[this.y + y][this.x + x] = 2;
        }
      }
    }
  };
  
  Block.prototype.width = function() {
    return this.value[0].length;
  };

  Block.prototype.height = function() {
    return this.value.length;
  };
  
  Block.prototype.rotate = function() {
    this.rotationIndex++;
    if (this.rotationIndex >= this.rotations.length) {
      this.rotationIndex = 0;
    }
    this.value = this.rotations[this.rotationIndex];
  };

  Block.prototype.rotateBack = function() {
    this.rotationIndex--;
    if (this.rotationIndex < 0) {
      this.rotationIndex = this.rotations.length - 1;
    }
    this.value = this.rotations[this.rotationIndex];
  };

  Block.prototype.randomRotation = function() {
    var index = this._randomRotationIndex();
    var rotation = this.rotations[index];
    this.value = rotation;
    return rotation;
  };

  Block.prototype._randomRotationIndex = function() {
    return Math.floor(Math.random() * 100) % this.rotations.length;
  };

  return Block;

})($);

