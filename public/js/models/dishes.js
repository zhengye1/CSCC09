var eatz =  eatz || {};

eatz.DishCollection = Backbone.Collection.extend({
    model: eatz.Dish,
    url:"/dishes",
    initialize:function(option){
        if (option){
            this.option = option;
        }
        else{
            this.option = 'name';
        }
    },
    comparator: function(dish){
        return dish.get(this.option).toLowerCase();
    }
});