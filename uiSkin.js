var NavView = Backbone.View.extend({
  tagName:"nav",
  className: "navbar navbar-inverse",
  id: "navbar",
  render: function() {
    //Create DOM elements
    var $container = $('<div class="container-fluid">');
    var $navbarHeader = $('<div class="navbar-header">');
    var $logo = $("<a>").attr({
      href: "#",
      class:"navbar-brand"
    }).text("to do ||");;

    //Attach DOM elements to their respective parent elements
    $container.append($logo);
    $navbarHeader.append($navbarHeader);
    this.$el.append($container);
    $('body').prepend(this.$el);

    return this
  },
  initialize: function(opts){
    this.render();
  }
});


$(document).ready(function(){

  $("#app").addClass("container");

  $("#login_view").addClass("jumbotron");

  var nav = new NavView();

});
