"use strict";

var Tick = (function($) {

  var Tick = function Tick(options) {
    this.selector = document;
    this.interval = 30;

    this._id = null;

    if (options) {
      this.interval = options['internval'] || this.interval;
    }

    this.initialize();
  };

  Tick.prototype.initialize = function() {};

  Tick.prototype.start = function() {
    this._id = setInterval($.proxy(this.fire, this), this.interval);
  };

  Tick.prototype.stop = function() {
    clearInterval(this._id);
  };

  Tick.prototype.fire = function(e) {
    var delta = (window.performance) ? window.performance.now() : Date.now();
    $(this.selector).trigger('tick', {delta: delta});
  };

  return Tick;

})($);

