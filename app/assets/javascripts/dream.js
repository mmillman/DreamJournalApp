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

  Dream.prototype.save = function (dreamFormView) {
    console.log("saving!");
    var that = this;

    $.ajax("/dreams.json", {
      type: 'POST',
      dataType: 'json',
      data: {
        dream: {
          id: that.id,
          title: that.title,
          body: that.body
        }
      },
      success: function (response) {
        that.id = response.id;
        Dream.all.push(that);

        dreamFormView.clear();
        dreamFormView.bindSubmit();

        // Dream.callCallbacks();
      },
      error: function () {
        console.log("fail!");
        dreamFormView.bindSubmit();
      }
    });
  };

  function DreamIndexView(listEl, refreshEl, onSelect) {
    var that = this;

    this.selectHandler = onSelect;

    this.$listEl = $(listEl);
    this.$refreshEl = $(refreshEl);

    this.bindRefresh(that.$refreshEl[0]);

    Dream.addCallback(function () {
      that.render();
    });

    // $('#my-unordered-list').on( 'click', function( event ) {
    //   console.log( event.target ); // logs the element that initiated the event
    // });

    // Dream.refresh();
  }

  DreamIndexView.prototype.bindRefresh = function (refreshEl, onClick) {
    var that = this;
    // console.log("refresh button:", refreshEl);

    $(refreshEl).on('click', function () {
      Dream.refresh();
    });
  };

  DreamIndexView.prototype.render = function () {
    var that = this;

    console.log("rendering...");
    var ul = $('<ul></ul>');

    // _(Dream.all).each(function (dream) {
    //   new DreamView(dream, $('<li></li>'));
    // });

    _(Dream.all).each(function (dream) {
      ul.append($('<li></li>').text("[" + dream.title + "]: " + dream.body));
    });

    that.$listEl.html(ul);
  };

  function DreamView(dream, el) {
    this.dream = dream;
    this.$el = $(el);

    this.$el.html("[" + dream.title + "]: " + dream.body);

    this.$el.on('click', function () {
      console.log(dream);
    });
  }


  function DreamFormView(formEl, newDream) {
    this.$formEl = $(formEl);
    this.$titleEl = $('<input>')
      .attr('id', 'dream-title')
      .attr('name', 'dream[title]');

    this.$bodyEl = $('<textarea></textarea>')
      .attr('id', 'dream-body')
      .attr('name', 'dream[body]');

    this.$submitBtn = $('<button></button>')
      .attr('id', 'dream-submit')
      .attr('name', 'my_button')
      .attr('value', 'my_value')
      .html('Save dream');

    this.newDream = newDream;

    this.$formEl.append(this.$titleEl);
    this.$formEl.append(this.$bodyEl);
    this.$formEl.append(this.$submitBtn);

    this.bindSubmit();
  }

  DreamFormView.prototype.bindSubmit = function () {
    var that = this;
    console.log("Submit button:", that.$submitBtn);

    that.buttonClickHandler = function () {
      that.submit();
    };

    $(that.$submitBtn[0]).on('click', that.buttonClickHandler);
  }

  DreamFormView.prototype.unbindSubmit = function () {
    var that = this;

    that.$submitBtn.off('click');
    delete that.buttonClickHandler;
  }

  DreamFormView.prototype.submit = function () {
    var that = this;

    that.unbindSubmit();
    that.newDream.title = $(that.$titleEl).val();
    that.newDream.body = $(that.$bodyEl).val();

    console.log("submitting new dream:", that.newDream);
    that.newDream.save(that);
  }

  DreamFormView.prototype.render = function() {
    var that = this;

    Dream.addCallback(function () {
      that.render();
    })
  }

  DreamFormView.prototype.clear = function() {
    this.$titleEl.val("");
    this.$bodyEl.val("");
  }

  return {
    Dream: Dream,
    DreamIndexView: DreamIndexView,
    DreamView: DreamView,
    DreamFormView: DreamFormView
  };

})();