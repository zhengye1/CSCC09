/**
 * Created by vincent on 07/10/14.
 */
var eatz =  eatz || {};

eatz.AboutView = Backbone.View.extend({

    initialize: function () {
        this.render();
    },

    render: function () {
        this.$el.html(this.template());  // create DOM content for HomeView
        return this;    // support chaining
    }

});
