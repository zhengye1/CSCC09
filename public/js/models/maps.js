var eatz =  eatz || {};

eatz.MapCollection = Backbone.Collection.extend({
    model: eatz.Map,
    url:"/dishes"
    //localStorage: new Backbone.LocalStorage('eatz')
});