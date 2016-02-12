var SkiView = function (game, ctx) {
  this.game = game;
  this.ctx = ctx;
}

SkiView.prototype.start = function () {
  this.bindKeyHandlers();
  this.bindSettingsHandler();
  var callback = function () {
    this.game.draw(this.ctx);
    this.game.step();
  }
  setInterval(callback.bind(this), 50);
}

SkiView.prototype.bindKeyHandlers = function () {
  var key;
  $(document).on('keydown', function (e) {
    this.unbindSettingsHandler();
    key = e.keyCode;
    if (key > 36 && key < 41) {
      e.preventDefault();
      this.game.changeDirection(e.keyCode);
    }
  }.bind(this));
}

SkiView.prototype.bindSettingsHandler = function () {
  $('.speed').on('click', function (e) {
    var s = parseInt(e.target.id.substring(5,6));
    $('.speed').children().each(function (i, el) {
      $(el).removeClass();
    });
    $(e.target).addClass('selected');
    debugger;
    this.game.setSpeed(s);
  }.bind(this));
  $('.density').on('click', function (e) {
    var d = parseInt(e.target.id.substring(3,4));
    $('.density').children().each(function (i, el) {
      $(el).removeClass();
    });
    $(e.target).addClass('selected');
    debugger;
    this.game.setDensity(d);
  }.bind(this));
}

SkiView.prototype.unbindSettingsHandler = function () {
  $('.speed').off('click');
  $('.density').off('click');
}
module.exports = SkiView;
