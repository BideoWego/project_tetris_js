"use strict";

var Grid = (function(Block, $) {

  var Grid = function Grid(options) {
    this.$element = $('<div class="grid clearfix"></div>');
    this.spaces = [];
    this._block = null;

    this.initialize();
  };

  Grid.WIDTH = 10;
  Grid.HEIGHT = 20;

  Grid.prototype.initialize = function() {
    for (var y = 0; y < Grid.HEIGHT; y++) {
      this.spaces[y] = [];
      for (var x = 0; x < Grid.WIDTH; x++) {
        var $space = $('<div class="space" ' +
        'data-x="' + x + '" ' +
        'data-y="' + y + '" ' +
        '></div>');
        this.$element.append($space);
        
        var value = 0;
        this.spaces[y].push(value);
      }
    }
  };

  Grid.prototype.block = function(block) {
    if (block !== undefined) {
      this._block = block;
    }
    return this._block;
  };

  Grid.prototype.clearLines = function() {
    var numClearedLines = 0;
    for (var y = 0; y < Grid.HEIGHT; y++) {
      var allSpacesFull = true;
      for (var x = 0; x < Grid.WIDTH; x++) {
        var value = this.spaces[y][x];
        if (value === 0) {
          allSpacesFull = false;
          break;
        }
      }
      if (allSpacesFull) {
        numClearedLines++;
        this.clearLine(y);
      }
    }
    return numClearedLines;
  };

  Grid.prototype.clearLine = function(index) {
    this.spaces.splice(index, 1);
    this.prependEmptyLine();
  };

  Grid.prototype.prependEmptyLine = function() {
    var line = [];
    for (var x = 0; x < Grid.WIDTH; x++) {
      var value = 0;
      line.push(value);
    }
    this.spaces.unshift(line);
  };

  Grid.prototype.render = function() {
    for (var y = 0; y < Grid.HEIGHT; y++) {
      for (var x = 0; x < Grid.WIDTH; x++) {
        
        var $space = $('div.space[data-x="' + x + '"][data-y="' + y + '"]');

        if (this.spaces[y][x] === 0) {
          $space.css('background', 'transparent');
        }

        if (y >= this._block.y &&
            x >= this._block.x &&
            y < this._block.y + this._block.height() &&
            x < this._block.x + this._block.width()) {

          var normalized = {
            x: x - this._block.x,
            y: y - this._block.y
          };

          var value = this._block.value[normalized.y][normalized.x];
          if (value > 0) {
            $space.css('background', this._block.color);
          }
        }
      }
    }
  };

  return Grid;

})(Block, $);

