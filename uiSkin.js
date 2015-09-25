/*var NavView = Backbone.View.extend({
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
    }).text("toDo ||");;

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
*/

$(document).ready(function(){

$("#app").addClass("container");

  //$(".jumbotron").css("margin-top","120px");
  //$("#login").css("margin-top","20px");
  //$("#login").css("margin-bottom","120px");

  //$("#login_view").addClass("jumbotron");

  //var nav = new NavView();

});
