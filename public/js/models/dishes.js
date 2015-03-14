var eatz =  eatz || {};

eatz.DishCollection = Backbone.Collection.extend({
    model: eatz.Dish,
    url:"/dishes"
    //localStorage: new Backbone.LocalStorage('eatz')
});