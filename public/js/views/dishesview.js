"use strict";
/**
 * Created by vincent on 11/10/14.
 */
var eatz = eatz || {};

eatz.DishesView = Backbone.View.extend({

    initialize: function (options) {
        var self = this;
        this.options = options || {};
        var order = '';
        eatz.pubSub.on('order', function(msg){
            self.order = msg;
            console.log(self.order);
            self.render();
        });
        //this.render();
    },

    render: function () {
        var dishCollection = this.model;
        var dishes = dishCollection.models;
        dishCollection.option = this.order;
        var len = dishes.length;
        var startPos = (this.options.page - 1) * 8;
        var endPos = Math.min(startPos + 8, len);

        $(this.el).html('<ul class="thumbnails"></ul>');

        for (var i = startPos; i < endPos; i++) {
            $('.thumbnails', this.el).append(new eatz.DishView({model: dishes[i]}).render().el);
        }

        $(this.el).append(new eatz.Paginator({model: this.model, page: this.options.page}).render().el);

        return this;
    }
});