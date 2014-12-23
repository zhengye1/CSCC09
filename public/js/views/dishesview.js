"use strict";
/**
 * Created by vincent on 11/10/14.
 */
var eatz = eatz || {};

eatz.DishesView = Backbone.View.extend({

    initialize: function (options) {
        this.options = options || {};
        this.render();
    },

    render: function () {
        var dishes = this.model.models;
        console.log(this.model);
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