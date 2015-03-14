'use strict';

var eatz =  eatz || {};

eatz.Map = Backbone.Model.extend({

		initialize: function(lat, lng) {
			var currentLatLng;
			if (lat && lng){
				currentLatLng = new google.maps.LatLng(lat, lng);
			}
			else{
				currentLatLng = new google.maps.LatLng(43.784925, -79.185323);
			}

		this.set('center', currentLatLng);
       	var mapOptions = {
            center: currentLatLng,
            zoom:16,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        this.set('mapOptions', mapOptions);
	},
	

	defaults:
	{
		center:{},
		map:{},
		mapOptions:{ }
	}
});