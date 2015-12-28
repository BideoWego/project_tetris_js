"use strict";

var Game = (function(Tick, Grid, Block, I, J, L, O, S, T, Z, $) {

  var Game = function Game(options) {
    this.$element = $(options['element']);
    this.$score = $(options['score']);
    this.$level = $(options['level']);
    this.$nextBlock = $(options['nextBlock']);
    this.initialize();
  };

  Game.blocks = [I, J, L, O, S, T, Z];
  Game.START_SPEED = 1500;
  Game.LEVEL_UP_SPEED = 50;
  Game.LINES_PER_LEVEL = 10;

  Game.prototype.initialize = function() {
    this.level = 1;
    this.points = 0;
    this.grid = new Grid();
    this.linesLeft = Game.LINES_PER_LEVEL;
    this.nextBlock = this.randomBlock();
    this.block = null;
    this.$element.append(this.grid.$element);
    this.$score.text('Score: ' + this.points);
    this.$level.text('Level: ' + this.level);
    this.$nextBlock.addClass('clearfix');
    this.lastDelta = null;
    this.spawnBlock();
    this.render();
    this.tick = new Tick();
    this.tick.start();
    this.speed = Game.START_SPEED;
    $(document).on('keydown', $.proxy(this.move, this));
    $(document).bind('tick', $.proxy(this.move, this));
  };

  Game.prototype.randomBlock = function() {
    var index = Math.floor((Math.random() * 1000)) % Game.blocks.length;
    var blockClass = Game.blocks[index];
    return new blockClass();
  };

  Game.prototype.spawnBlock = function() {
    this.block = this.nextBlock;
    this.nextBlock = this.randomBlock();
    this.renderNextBlock();
    this.block.randomRotation();
    this.block.x = 4;
    this.block.y = -4;
    this.grid.block(this.block);
    this.block.grid(this.grid);
  };

  Game.prototype.lose = function() {
    this.tick.stop();
    this.$element.html('<div class="text-center">' +
      '<h1>You Lost</h1>' +
      '<a href="/">Play Again?</a>' +
    '</div>');
  };

  Game.prototype.stopBlock = function() {
    if (this.block.y < 0) {
      this.lose();
    } else {
      this.block.stop();
      var numLines = this.grid.clearLines();
      this.linesLeft -= numLines;
      this.levelUp(numLines);
      this.score(numLines);
      this.spawnBlock();
    }
  };

  Game.prototype.levelUp = function(numLines) {
    if (this.linesLeft < 0) {
      this.linesLeft = Game.LINES_PER_LEVEL - numLines;
      this.level++;
      $(this.$level).text('Level: ' + this.level);
      this.speed -= Game.LEVEL_UP_SPEED;
    }
  };

  Game.prototype.score = function(numLines) {
    var blockValue = this.block.width() * this.block.height();
    var value = blockValue + Math.floor(numLines * (Grid.WIDTH * Grid.HEIGHT)) * this.level;
    this.points += (numLines === 4) ? value * 2 : value;
    this.$score.text('Score: ' + this.points);
  };

  Game.prototype.keyMove = function(e) {
    e.preventDefault();

    if (e.keyCode === 37 &&
        this.canMoveTo(-1, 0)) {
      this.block.x -= 1;
    }

    if (e.keyCode === 39 &&
        this.canMoveTo(1, 0)) {
      this.block.x += 1;
    }

    if (e.keyCode === 40 &&
        this.canMoveTo(0, 1)) {
      this.block.y += 1;
    }

    if (e.keyCode === 32 &&
        this.canRotate()) {
      this.block.rotate();
    }
  };
  
  Game.prototype.tickMove = function(e, data) {
    if (this.lastDelta === null) {
      this.lastDelta = data.delta;
    }

    var elapsed = data.delta - this.lastDelta;

    if (elapsed >= this.speed &&
        this.canMoveTo(0, 1)) {
      this.block.y += 1;
      this.lastDelta = data.delta;
    }
  };

  Game.prototype.move = function(e, data) {
    if (e.type === 'tick') {
      this.tickMove(e, data);
    } else {
      this.keyMove(e);
    }

    this.render();

    return false;
  };

  Game.prototype.canMoveTo = function(x, y, ignoreCollision) {
    ignoreCollision = (ignoreCollision === undefined) ? false : ignoreCollision;

    var lastPosition = {
      x: this.block.x,
      y: this.block.y
    }

    this.block.x += x;
    this.block.y += y;

    var differenceY = this.block.y - lastPosition.y;

    var canMove = true;
    var mustStop = false;

    for (var y = 0; y < this.block.value.length; y++) {
      for (var x = 0; x < this.block.value[y].length; x++) {
        var blockPiece = this.block.value[y][x];
        if (blockPiece > 0) {
          if (this.block.x + x < 0 ||
              this.block.x + x >= Grid.WIDTH) {
            canMove = false;
          }

          if (this.block.y + y >= Grid.HEIGHT) {
            mustStop = true;
            canMove = false;
          }
          
          var row = this.grid.spaces[this.block.y + y];
          var space;
          if (row) {
            space = row[this.block.x + x];
          }
          if (space && space > 0) {
            mustStop = true;
            canMove = false;
          }

          if (!canMove) {
            break;
          }
        }
      }
      if (!canMove) {
        break;
      }
    }

    this.block.x = lastPosition.x;
    this.block.y = lastPosition.y;

    if (!ignoreCollision &&
        mustStop &&
        differenceY > 0) {
      this.stopBlock();
    }

    return canMove;
  };

  Game.prototype.canRotate = function() {
    this.block.rotate();
    var canRotate = this.canMoveTo(0, 0, true);
    this.block.rotateBack();
    return canRotate;
  };

  Game.prototype.render = function() {
    this.grid.render();
  };

  Game.prototype.renderNextBlock = function() {
    this.$nextBlock.css({
      width: 30 * this.nextBlock.width(),
      height: 30 * this.nextBlock.height()
    });
    var html = '';
    for (var y = 0; y < this.nextBlock.value.length; y++) {
      for (var x = 0; x < this.nextBlock.value[y].length; x ++) {
        var color = (this.nextBlock.value[y][x] > 0) ? ' style="background: ' + this.nextBlock.color + '"' : '';
        html += '<div class="space"' + color + '></div>';
      }
    }
    this.$nextBlock.html(html);
  };

  return Game;

})(Tick, Grid, Block, I, J, L, O, S, T, Z, $);

