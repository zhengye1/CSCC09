"use strict";

var eatz =  eatz || {};

eatz.MapView = Backbone.View.extend({
    initialize: function () {
        this.render();
    },
    
    resize: function() {
        google.maps.event.trigger(this.map, 'resize');
    },
	
    setCenter: function(lat, lng){
        var newCenter = new google.maps.LatLng(lat, lng);
        this.model.set({'center': newCenter});
        this.model.get('mapOptions')['center'] = newCenter;
        this.render();
    },

    render: function () {
        $("#test").html(this.template());
        this.map = new google.maps.Map($('#map-canvas')[0], this.model.get('mapOptions'));
        this.marker = new google.maps.Marker({
            position: this.model.get('center'),
            map: this.map
        });
        this.resize();
        console.log(this.model);
        return this;
    }
});