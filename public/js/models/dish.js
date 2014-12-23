var eatz =  eatz || {};

eatz.Dish = Backbone.Model.extend({

    idAttribute: "_id",
    urlRoot: "/dishes",

    initialize: function () {
        this.validators = {};
        this.patt;
        this.validators.name = function (value) {
            return value.length > 0 ? {isValid: true} : {isValid: false, message: "You must enter a name"};
        };

        this.validators.venue = function (value) {
            return value.length > 0 ? {isValid: true} : {isValid: false, message: "You must enter a serving venue name"};
        };

        this.validators.info = function (value) {
            this.patt = /(([a-z])+(\s))*([a-z])+/i;
            return (value.length > 0 || this.patt.test(value)) ? {isValid: true} : {isValid: false, message: "You must enter a Dish/Venue Info"};
        };

        this.validators.url = function(value){
            this.patt = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
            return (value.length == 0 || this.patt.test(value))? {isValid: true} : {isValid: false, message: "You must enter a URL"};
        };

        this.validators.numbr = function(value) {
            this.patt = /\d+\w{0,}/;
            return (value.length > 0 || this.patt.test(value))? {isValid: true} : {isValid: false, message: "You must enter a Buiding Number"};
        };

        this.validators.street = function(value) {
            this.patt = /(([a-z])+(\s))*([a-z])+/i;
            return (value.length > 0 || this.patt.test(value)) ? {isValid: true} : {isValid: false, message: "You must enter a Street Name"};
        };

        this.validators.city = function(value) {
            this.patt = /(([a-z])+(\s)+)*([a-z])+/i;
            return (value.length > 0 || this.patt.test(value)) ? {isValid: true} : {isValid: false, message: "You must enter a City"};
        };

        this.validators.province = function(value) {
            return value.length == 2 ? {isValid: true} : {isValid: false, message: "You must enter a Province"};
        };
    },

    validateItem: function (key) {
        return (this.validators[key]) ? this.validators[key](this.get(key)) : {isValid: true};
    },

    // TODO: Implement Backbone's standard validate() method instead.
    validateAll: function () {

        var messages = {};
	if (this.validators.name(this.get("name")).isValid === false) {
		messages.name = this.validators.name(this.get("name")).message;
	}
	if (this.validators.venue(this.get("venue")).isValid === false) {
		messages.venue = this.validators.venue(this.get("venue")).message;
	}
	if (this.validators.info(this.get("info")).isValid === false) {
		messages.info = this.validators.info(this.get("info")).message;
	}
        if (this.validators.url(this.get("url")).isValid === false) {
                messages.url = this.validators.url(this.get("url")).message;
        }
	if (this.validators.numbr(this.get("numbr")).isValid === false) {
		messages.numbr = this.validators.numbr(this.get("numbr")).message;
	}
	if (this.validators.street(this.get("street")).isValid === false) {
		messages.street = this.validators.street(this.get("street")).message;
	}
	if (this.validators.city(this.get("city")).isValid === false) {
		messages.city = this.validators.city(this.get("city")).message;
	}
	if (this.validators.province(this.get("province")).isValid === false) {
		messages.province = this.validators.province(this.get("province")).message;
	}
/*        for (var key in this.validators) {
console.log(this.validators.street);
console.log(this.validators[key](this.get(key)));
            if(this.validators.hasOwnProperty(key)) {
                var check = this.validators[key](this.get(key));
                if (check.isValid === false) {
                    messages[key] = check.message;

                }
            }
        }
*/
        return _.size(messages) > 0 ? {isValid: false, messages: messages} : {isValid: true};
    },

    defaults:{
            name: "",  // dish name, which will headline it's display in browse view
            venue: "",  // establishment where the dish was prepared/sampled/ordered
            info: "",   // string of descriptive terms, such as: takeout, burgers, etc
            numbr: "1265",  // venue's street-address number - defaults to "1265"
            street: "Military Trail",  // venue's street name - defaults to "Military Trail"
            city: "Scarborough",   // venue's city name - defaults to "Scarborough"
            province: "ON",  // venue's 2-letter province abbreviation - defaults to ON
            url: "",  // venue's Web-page address
            lat:0,
            lng:0, 
            image:null    
    }

});


