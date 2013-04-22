var DJ = (function () {
  // change to take params hash and do this.id = params[:id], etc
  function Dream(params) {
    this.id = params.id;
    this.title = params.title;
    this.body = params.body;
    this.themes = params.themes ? params.themes : [];
  }

  Dream.all = [];
  Dream.callbacks = [];

  Dream.addCallback = function(callback) {
    this.callbacks.push(callback);
  };

  Dream.callCallbacks = function () {
    _(this.callbacks).each(function (callback) {
      callback();
    });
  };

  Dream.refresh = function () {
    console.log("refreshing...");
    $.get("/dreams.json",
      function (dreamData) {
        console.log("dreams received");
        Dream.all = [];

        _(dreamData).each(function (dreamDatum) {
          Dream.all.push(new Dream(dreamDatum));
        });

        // Call all the views that care that the dreams (Dream.all) have been refreshed.
        console.log(Dream.all);
        Dream.callCallbacks();
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
        dream: dreamFormView.newDream
      },
      success: function (dreamParams) {
        that.id = dreamParams.id;
        Dream.all.push(that);

        dreamFormView.clear();
        dreamFormView.bindSubmit();

        Theme.refresh();
        // Dream.callCallbacks(); // Just commented out to test refresh button
      },
      error: function () {
        console.log("fail!");
        dreamFormView.bindSubmit();
      }
    });
  };

  function Theme(params) {
    this.id = params.id;
    this.name = params.name;
  }

  Theme.all = [];

  Theme.refresh = function () {
    $.get('/themes.json',
      function (themeData) {
        Theme.all = [];
        _(themeData).each(function (themeDatum) {
          Theme.all.push(new Theme(themeDatum));
        });
      }
    );
  };

  function DreamIndexView(listEl, refreshEl, createDreamView, onSelect) {
    var that = this;

    this.selectHandler = onSelect;

    this.$listEl = $(listEl);
    this.$refreshEl = $(refreshEl);

    this.createDreamView = createDreamView;

    this.bindRefresh(that.$refreshEl[0]);

    Dream.addCallback(function () {
      that.render();
    });

    // Dream.refresh();
  }

  DreamIndexView.prototype.bindRefresh = function (refreshEl, onClick) {
    var that = this;

    $(refreshEl).on('click', function () {
      Dream.refresh();
      Theme.refresh();
    });
  };

  DreamIndexView.prototype.render = function () {
    var that = this;

    console.log("rendering...");
    var $ul = $('<ul></ul>');

    // _(Dream.all).each(function (dream) {
    //   new DreamView(dream, $('<li></li>'));
    // });

    _(Dream.all).each(function (dream) {
      // var newDreamView = that.createDreamView(dream);

      $ul.append($('<li></li>').text(/*"[" +*/ dream.title /*+ "]: " + dream.body*/));

      var $themeList = $('<ul></ul>');

      _(dream.themes).each(function (theme) {
        $themeList.append($('<li></li>').text(theme.name));
      });

      $ul.append($themeList);
    });

    that.$listEl.html($ul);
  };

  function DreamView(dream, el) {
    this.dream = dream;
    this.$el = $(el);

    this.$el.on('click', function () {
      this.$el.html("[" + dream.title + "]: " + dream.body);
      console.log("selected dream:", dream);
    });

    this.$el.on('')
  }


  function DreamFormView(formEl, newDream) {
    var that = this;

    this.newDream = newDream;

    this.$formEl = $(formEl);
    this.$formEl.css('width', '40%');

    this.$themeSearchEl = $('<div></div>')
      .attr('id', 'theme-search')
      .css('float', 'right');
    this.$themeSearchResultsEl = $('<ul></ul>');
    this.$themeSearchEl.append(this.$themeSearchResultsEl);

    this.$titleEl = $('<input>')
      .attr('id', 'dream-title')
      .attr('name', 'dream[title]');
    this.$titleLabel = $('<label></label>')
      .attr('for', $(this.$titleEl).attr('id'))
      .text("Title");

    this.$bodyEl = $('<textarea></textarea>')
      .attr('id', 'dream-body')
      .attr('name', 'dream[body]');
    this.$bodyLabel = $('<label></label>')
      .attr('for', $(this.$bodyEl).attr('id'))
      .text("Body");

    this.$themeCheckboxes = $('<div></div>')
      .attr('id', 'theme-checkboxes');

    // _(Theme.all).each(function (theme) {
    //   var $themeCheckbox = ($('<input>'))
    //     .attr('id', 'dream_theme_ids_' + theme.id)
    //     .attr('name', 'dream[theme_ids][]');
    //     .attr('value', theme.id)
    //     .text(theme.name);
    //
    //   that.$themeCheckBoxes.append($option);
    // });

    this.$submitBtn = $('<button></button>')
      .attr('id', 'dream-submit')
      .attr('name', 'my_button')
      .attr('value', 'my_value')
      .html('Save dream');

    this.$themeTypeAheadEl = $('<input>')
      .attr('id', 'theme-type-ahead');
    this.$themeTypeAheadLabel = $('<label></label>')
      .attr('id', $(this.$themeTypeAheadEl.attr('id')))
      .text("Add theme:");

    // Build form
    this.$formEl.append(this.$titleLabel);
    this.$formEl.append($('<br>'));
    this.$formEl.append(this.$titleEl);
    this.$formEl.append($('<br>'));
    this.$formEl.append(this.$bodyLabel);
    this.$formEl.append($('<br>'));
    this.$formEl.append(this.$bodyEl);
    this.$formEl.append($('<br>'));
    this.$formEl.append(this.$themeTypeAheadLabel);
    this.$formEl.append($('<br>'));
    this.$formEl.append(this.$themeTypeAheadEl);
    this.$formEl.append($('<br>'));
    this.$formEl.append(this.$themeCheckboxes);
    this.$formEl.append($('<br>'));
    this.$formEl.append(this.$submitBtn);
    this.$formEl.prepend(this.$themeSearchEl);

    this.bindSubmit();
    this.bindThemeTypeAhead();
  }

  // DreamFormView.allThemes = ['flying', 'drowning', 'airplanes', 'fun'];
  DreamFormView.allThemes = [];

  DreamFormView.prototype.bindThemeTypeAhead = function () {
    var that = this;

    that.themeTypeAheadKeyupHandler = function (event) {
      if (event.which == 13) {
        return;
      }
      that.themeTypeAhead();
    };

    that.themeTypeAheadFocusoutHandler = function () {
      that.$themeSearchResultsEl.empty();
    };

    that.themeTypeAheadKeydownHandler = function (event) {
      if (event.which == 13) {
        if (!that.$themeTypeAheadEl.val()) {
          console.log("Can't create empty theme!")
          return;
        }

        newTheme = new Theme({name: that.$themeTypeAheadEl.val()});
        that.newDream.themes.push(newTheme);
        console.log("new theme: ", newTheme);
        console.log("new dream: ", that.newDream);
        that.$themeTypeAheadEl.val("");
      }
    }

    $(that.$themeTypeAheadEl[0]).on('focus', that.themeTypeAheadKeyupHandler);
    $(that.$themeTypeAheadEl[0]).on('keyup', that.themeTypeAheadKeyupHandler);
    $(that.$themeTypeAheadEl[0]).on('blur', that.themeTypeAheadFocusoutHandler);
    $(that.$themeTypeAheadEl[0]).on('keydown', that.themeTypeAheadKeydownHandler);
  };

  DreamFormView.prototype.themeTypeAhead = function () {
    var that = this;
    this.$themeSearchResultsEl.empty();

    _(this.matchingThemes()).each(function (theme) {
      that.$themeSearchResultsEl.append($('<li></li>').text(theme.name));
    });
  };

  DreamFormView.prototype.matchingThemes = function () {
    var themePrefix = this.$themeTypeAheadEl.val();

    if (!themePrefix) {
      return;
    }
    console.log("keyup! searching for:", themePrefix);

    var regExp = new RegExp("^" + themePrefix + ".*$");

    return _(Theme.all).filter(function (theme) {
      return regExp.exec(theme.name);
    });
  };

  DreamFormView.prototype.bindSubmit = function () {
    var that = this;
    console.log("Submit button:", that.$submitBtn);

    that.buttonClickHandler = function () {
      that.submit();
    };

    $(that.$submitBtn[0]).on('click', that.buttonClickHandler);
  };

  DreamFormView.prototype.unbindSubmit = function () {
    var that = this;

    that.$submitBtn.off('click');
    delete that.buttonClickHandler;
  };

  DreamFormView.prototype.submit = function () {
    var that = this;

    that.unbindSubmit();
    that.newDream.title = $(that.$titleEl).val();
    that.newDream.body = $(that.$bodyEl).val();

    console.log("submitting new dream:", that.newDream);
    that.newDream.save(that);
  };

  DreamFormView.prototype.render = function() {
    var that = this;

    Dream.addCallback(function () {
      that.render();
    })
  };

  DreamFormView.prototype.clear = function() {
    this.$titleEl.val("");
    this.$bodyEl.val("");
  };

  return {
    Dream: Dream,
    Theme: Theme,
    DreamIndexView: DreamIndexView,
    DreamView: DreamView,
    DreamFormView: DreamFormView
  };

})();