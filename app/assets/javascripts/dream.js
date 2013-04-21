var DJ = (function () {
  // change to take params hash and do this.id = params[:id], etc
  function Dream(params) {
    this.id = params.id;
    this.title = params.title;
    this.body = params.body;
  }

  Dream.all = [];
  Dream.callbacks = [];

  Dream.addCallback = function(callback) {
    this.callbacks.push(callback);
  }

  Dream.callCallbacks = function () {
    _(this.callbacks).each(function (callback) {
      callback();
    });
  };

  Dream.refresh = function () {
    console.log("refreshing...");
    $.get("/dreams.json",
      function (data) {
        console.log("dreams received");
        Dream.all = [];

        _(data).each(function (datum) {
          Dream.all.push(datum); // Not pushing an actual dream object into Dream.all? $.get vs $.getJSON?
        });

        // Call all the views that care that the dreams (Dream.all) have been refreshed.
        console.log(Dream.all);
        Dream.callCallbacks();
        // _(Dream.callbacks).each(function (callback) {
        //   callback();
        // });
      }
    );
  };

  Dream.prototype.save = function () {
    var that = this;
    console.log("in save method!");

    $.post("/dreams.json", {
      dream: {
        id: that.id,
        // Forgot to put title in here and was saving dreams to db with null
        // titles.
        title: that.title,
        body: that.body
      }
    }, function (response) {
      that.id = response.id;
      Dream.all.push(that);

      Dream.callCallbacks();
    });
  };

  function DreamIndexView(el, callback) {
    var that = this;
    this.$el = $(el);

    Dream.addCallback(function () {
      that.render();
    });
  }

  DreamIndexView.prototype.render = function () {
    console.log("rendering...");
    var ul = $('<ul></ul>');
    console.log("HI");

    _(Dream.all).each(function (dream) {
      ul.append($('<li></li>').text("[" + dream.title + "]: " + dream.body));
    });

    // Sets html to replace old list with new one
    // this.$el.append(ul);
    this.$el.html(ul);
  }


  // function DreamView(dream, el) {
  //   // $(el).inner(dream.);
  // }

  return {
    Dream: Dream,
    DreamIndexView: DreamIndexView,
    // DreamView: DreamView
  };

})();