'use strict';

var eatz =  eatz || {};

eatz.Users = Backbone.Collection.extend({
    model:eatz.User,

    url:'/auth'  // to interact with the model via the server API
});
