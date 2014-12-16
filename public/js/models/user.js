'use strict';

var eatz =  eatz || {};

eatz.User = Backbone.Model.extend({

    urlRoot: "/auth", 

    idAttribute: "_id",   // to match Mongo, which uses _id rather than id

    initialize: function() {

	self = this;

        this.validators = {};
		this.patt;
		
        this.validators.username = function (value) {
            return value.length > 0 ? {isValid: true} :
		{isValid: false, message: "You must enter a non-empty username"};
        };

        this.validators.email = function (value) {
            this.patt = /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
            return (value.length > 0 && this.patt.test(value)) ? {isValid: true} :
		{isValid: false, message: "You must enter a valid email"};
        };

        this.validators.password = function (value) {
			this.patt = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s).{8,}/
            return (value.length > 0 && this.patt.test(value)) ? {isValid: true} :
		{isValid: false, message: "Password must be at least 8 characters long, including 1 uppercase, 1 lower case and 1 digits"};
        };

        this.validators.password2 = function (value) {
            return ((value.length > 0) && (value == self.model.get("password"))) ?
		{isValid: true} : {isValid: false, message: "Password values must match"};
        };
    },

    validateItem: function (key) {
        return (this.validators[key]) ? this.validators[key](this.get(key)) : {isValid: true};
    }

});
