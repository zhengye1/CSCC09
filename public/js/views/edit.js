"use strict";
/**
 * Created by vincent on 07/10/14.
 */
var eatz =  eatz || {};

eatz.EditView = Backbone.View.extend({

    initialize: function () {
        // intializing, if the user passing the model, extract the lat & lng to make the map model
        var lat = this.model.get('lat');
        var lng = this.model.get('lng');
        if (lat && lng){
                this.map = new eatz.Map(lat, lng);
        }
        else{
            // otherwise use the default lat & lng
            this.map = new eatz.Map();  
        }
        this.render();
    },

    render: function () {
        this.$el.html(this.template(this.model.toJSON()));
        $("#content").empty().append(this.$el);
        this.mapRender(this.map);
        return this;
    },
	mapRender: function(map) {
        this.mapView = new eatz.MapView({model: map});
	},

    events: {
        "change .control-group"        : "change",
        "click .save"   : "beforeSave",
        "click .delete" : "deleteDish",
        "drop #image" : "dropHandler",
        "click .currentLocation":"currentLocation",
        "change #image": "imageBrowse"
    },

    close:function(){
        this.stopListening();
    },

    change: function (event) {
        // Remove any existing alert message
        eatz.utils.hideAlert();

        // Apply the change to the model
        var target = event.target;
        var change = {};
        change[target.name] = _.escape(target.value);
        this.model.set(change);

        // Run validation rule (if any) on changed item
        var check = this.model.validateItem(target.id);
        if (check.isValid === false) {
            eatz.utils.addValidationError(target.id, check.message);
        } else {
            eatz.utils.removeValidationError(target.id);
        }
    },

    beforeSave: function () {
        var self = this;
        var check = this.model.validateAll();
        // A2 Remediation: Checking auth before save the dish
        $.getJSON('/auth', function(res){
            if(!res.auth){
                    eatz.utils.showAlert('Please login to save the dish', 'An error occurred.', 'alert-error');
            }
            else{
                if (check.isValid === false) {
                    eatz.utils.displayValidationErrors(check.messages);
                    return false;
                }
                // Image uploading
                if (this.pictureFile) {
                    eatz.utils.uploadFile(this.pictureFile, function (res) {
                        self.model.set("image", res);
                        self.saveDish();
                    });
                } 
                else if (this.input) {
                    eatz.utils.uploadFile(this.input, function (res) {
                        self.model.set("image", res);
                        self.saveDish();
                    });
                } 
                else {
                    self.saveDish();
                }
            }
        });
        return false;
    },

    saveDish: function () {
        var self = this;
        self.model.set({'lat':self.map.get('center')['k'], 'lng':self.map.get('center')['D']});
        // A2 Remediation: This part will do either save a new dish or update the exist dish
        // First check existance of the id, if id exits, then the action is update the dish
        // Otherwise is save a new dish
        if(self.model.id){
            $.ajax({
                url:'/dishes/' + self.model.id,
                type:'PUT', //PUT for update
                contentType:'application/json',
                dataType:'json',
                data:JSON.stringify(self.model),
                success:function(res){
                    if (res.error){
                        eatz.utils.showAlert('Dish failed to add.', 'An error occurred.', 'alert-error');
                    }
                    else{
                        self.render();
                        app.navigate('dishes/' + res._id, false);
                        eatz.utils.showAlert('Dish added successfully!', 'Database has been updated.', 'alert-success');
                    }                
                },
                error:function(e){
                    //console.log(e);
                    eatz.utils.showAlert('Error', e.responseText, 'alert-error');                    
                }
            });
        }
        else{
            $.ajax({
                url: '/dishes',
                type:'POST', // POST method
                contentType: 'application/json', //HTTP request-header
                dataType: 'json',
                data: JSON.stringify(self.model), //map object to JSON format
                success: function(res){
                    //console.log(res);
                    if (res.error){
                        eatz.utils.showAlert('Dish failed to updated.', 'An error occurred.', 'alert-error');
                    }
                    else{
                        self.render();
                        app.navigate('dishes/' + res._id, false);
                        eatz.utils.showAlert('Dish updated successfully!', 'Database has been updated.', 'alert-success');
                    }
                },
                error :function(e){ //server request returned non-200 type response
                    eatz.utils.showAlert('Error', e.responseText, 'alert-error');
                }
            });
        }},

    deleteDish: function (id) {
        var self = this;
        // A2 Remediation: Check authentication before delete the dish
        $.ajax({
            url:'/auth',
            type:'GET',           
            success: function(res){
                if(!res.auth){
                    eatz.utils.showAlert('Please login to delete the dish', 'An error occurred.', 'alert-error');
                }
                else{
                    $.ajax({
                        url: '/dishes/' + self.model.id,
                        type:'DELETE', // POST method
                        contentType: 'application/json', //HTTP request-header
                        data: JSON.stringify(self.model), //map object to JSON format
                        success: function(res){
                        if (res.error){
                            eatz.utils.showAlert('Dish failed to Delete.', 'An error occurred.', 'alert-error');
                        } else {
                            self.render();
                            app.navigate('dishes', {replace: true, trigger: true});
                            eatz.utils.showAlert('Dish deleted successfully!', 'Database has been updated.', 'alert-success');
                        }
                    },
                        error :function(e){ //server request returned non-200 type response
                            eatz.utils.showAlert('Error', e.responseText, 'alert-error');
                        }
                    });
                }
            },
            error:function(e){
                eatz.utils.showAlert('Error', e.responseText, 'alert-error');
            }
        });
        return false;
    },
	
	/*Event handler for picture drag and drop to render user selected image for upload*/
    dropHandler: function (event) {
        event.stopPropagation();
        event.preventDefault();
        var e = event.originalEvent;
        e.dataTransfer.dropEffect = 'copy';
        this.pictureFile = e.dataTransfer.files[0];
        // Read the image file from the local file system and display it in the img tag
        var reader = new FileReader();
        reader.onloadend = function () {
            $('#thumbnail').attr('src', reader.result);
            
        };
        reader.readAsDataURL(this.pictureFile);
    },
    
	/*Event handler for picture upload via file browser to render user selected image for upload*/
    imageBrowse: function (event) {
        this.input = document.querySelector('input[type=file]').files[0]; //retrieve img file
        if (this.input){
            var reader = new FileReader();
            reader.onload = function () {
                $('#thumbnail').attr('src', reader.result);
                
            };
            reader.readAsDataURL(this.input);
        }
    },

    currentLocation:function(event){
        var self = this;    
        if (navigator.geolocation) {
            // Get current Position
            navigator.geolocation.getCurrentPosition(function(position){
                // Once it get it, set the lat and lng
                var location = {'lat': position.coords.latitude , 'lng':position.coords.longitude};
                self.model.set(location);
                var formdata = {'latt':location['lat'], 'longt':location['lng'], 'reverse':'Reverse'};
                $.ajax({
                    url:'https://geocoder.ca?latt=' + location['lat'] + "&longt=" + location['lng'] + "&reverse=Reverse&geoit=xml",
                    type:'get',
                    success:function(result){
                        var stnumber = result.getElementsByTagName("stnumber")[0].childNodes[0].nodeValue;
                        var street = result.getElementsByTagName("staddress")[0].childNodes[0].nodeValue;
                        var city = result.getElementsByTagName("city")[0].childNodes[0].nodeValue;
                        var prov = result.getElementsByTagName("prov")[0].childNodes[0].nodeValue;
                        document.getElementById('numbr').value = stnumber;
                        document.getElementById('street').value = street;
                        document.getElementById('city').value = city;
                        document.getElementById('province').value = prov;
                        self.model.set({'numbr':stnumber, 'street':street, 'city':city, 'province':prov});
                        self.mapView.setCenter(location['lat'], location['lng']);
                    },
                    error:function(e){
                        console.log(e);
                    }
                });
            });
        }
        else{
            alert("Geolocation is not supported by this browser");
        }
    }

});
