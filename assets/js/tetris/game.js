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
    // If true, the collision will be ignored
    // and the block will not be stopped
    ignoreCollision = (ignoreCollision === undefined) ? false : ignoreCollision;

    // Cache the blocks last
    // position in case
    // there is a collision
    var lastPosition = {
      x: this.block.x,
      y: this.block.y
    };

    // Move the block in the
    // desired direction
    this.block.x += x;
    this.block.y += y;

    // Get the y difference to know if
    // we're moving downward
    var differenceY = this.block.y - lastPosition.y;

    // Set flags for if we
    // can move and
    // if we have to stop the block
    var canMove = true;
    var mustStop = false;

    // For each x,y value in the block's 2D array
    for (var y = 0; y < this.block.value.length; y++) {
      for (var x = 0; x < this.block.value[y].length; x++) {

        // Get the x,y value
        var blockPiece = this.block.value[y][x];

        // If it is occupied
        if (blockPiece > 0) {

          // If trying to move outside x
          // bounds it cannot move
          if (this.block.x + x < 0 ||
              this.block.x + x >= Grid.WIDTH) {
            canMove = false;
          }

          // If trying to move past the bottom of the grid
          // it has hit the floor and must stop
          if (this.block.y + y >= Grid.HEIGHT) {
            mustStop = true;
            canMove = false;
          }
          
          // Get the row we're at
          var row = this.grid.spaces[this.block.y + y];
          var space;
          if (row) {
            // If we have a row
            // get the space we're at
            space = row[this.block.x + x];
          }
          // If we have both and they are
          // above 0 we've hit a placed block
          // stop the block
          if (space && space > 0) {
            mustStop = true;
            canMove = false;
          }

          // If we can't move no need to iterate further
          if (!canMove) {
            break;
          }
        }
      }
      // If we can't move no need to iterate further
      if (!canMove) {
        break;
      }
    }

    // Move the block back to the original position
    this.block.x = lastPosition.x;
    this.block.y = lastPosition.y;

    // If we're not ignorigin collsion for a rotation
    // and we're moving down
    // and we have to stop
    if (!ignoreCollision &&
        mustStop &&
        differenceY > 0) {

      // Stop the block!
      this.stopBlock();
    }

    // Return a boolean
    // as this is a boolean function
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

