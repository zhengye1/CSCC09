var eatz =  eatz || {};

eatz.DishCollection = Backbone.Collection.extend({
    model: eatz.Dish,
    url:"/dishes",
    comparator: function(dish){
        return dish.get("name").toLowerCase();
    }
});