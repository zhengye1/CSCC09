"use strict"

var eatz =  eatz || {};

// note View-name (HomeView) matches name of template HomeView.html
eatz.HeaderView = Backbone.View.extend({

    initialize: function () {
        this.render();
    },

    events: {
        "change": "change",
        "click .signup": "signup",
        "click .login": "login",
        "click .logout": "logout"
    },

    render: function () {
        this.$el.html(this.template());  // create DOM content for HomeView

        // This call is update the header view with username
        // If the user already login and the session still valid
        // when user refresh the page, username will still displayed in the header
        $.ajax({
            url:'/auth',
            type:'GET',
            success:function(res){
                if (res.auth){
                    //update UI to show username, show/hide logout form
                    $('#greet').html(res.username);
                    $('#logoutUser').html('<b>'+res.username+'</b>');
                    $('.btn.login').css("display", "none");
                    $('.logintext').css("display", "none");
                    $('.btn.logout').css("display", "block");
                    $('#login_form')[0].reset(); //clear login form
                    $('#signupdrop').removeClass('open');
                    document.getElementById('edit-menu').hidden = false;
                }
            }
        });
        return this;    // support chaining
    },

    change: function(event){
        if(event.target.name === "order"){
            eatz.order = event.target.value;
            eatz.pubSub.trigger("order", eatz.order);
        }
        eatz.utils.hideAlert(); //Remove any existing alert message

        if (!this.model){
            this.model = new eatz.User();
        }
        var change = {}; //object to hold input changes

            // change event is triggered once for each change field value
            change[event.target.name] = _.escape(event.target.value);

            // reflect changes in the model
            this.model.set(change);

            // validation rule on change item
            var check = this.model.validateItem(event.target.name);

            check.isValid?
                eatz.utils.removeValidationError(event.target.id):
                eatz.utils.addValidationError(event.target.id, check.message);
    }, 

    // process signup form when user click "Sign Up" button
    signup: function(e){
        e.preventDefault();
        $('#signupdrop').removeClass('open'); // close signup dropdown menu

        var formdata = {'username': this.$('#signup_username').val(),
                        'email': this.$('#email').val(),
                        'password': this.$('#signup_password').val()};

        // create User model instance with input data
        var user = new eatz.User(formdata);
        var target = e.target;

        // initiate Ajax request to check user-credentials and create DB entry for user
        $.ajax({
            url: '/auth',
            type:'POST', // POST method
            contentType: 'application/json', //HTTP request-header
            dataType: 'json',
            data: JSON.stringify(formdata), //map object to JSON format
            success: function(res){
                if (res.error){
                    eatz.utils.showAlert('Signup Failed', 'Failed to create account', 'alert-error');
                }
                else{
                    eatz.utils.showAlert('Signup Successful!', 'Welcome ' + res.username, 'alert-success');
                    //update UI to show username, show/hide logout form
                    $('#greet').html(res.username);
                    $('#logoutUser').html('<b>'+res.username+'</b>');
                    $('.btn.login').css("display", "none");
                    $('.logintext').css("display", "none");
                    $('.btn.logout').css("display", "block");
                    $('#login_form')[0].reset(); //clear login form
                    $('#signupdrop').removeClass('open');
                    document.getElementById('edit-menu').hidden = false;
                }
            },
            error :function(e){ //server request returned non-200 type response
                eatz.utils.showAlert('Error', e.responseText, 'alert-error');
            }
        });
    },

    //process sign in
    login: function(e) {
        e.preventDefault();
    // get value of "remember me" checkbox
        var remember = (this.$('#remember').is(':checked')) ? 1 : 0;
        var self = this;
        $.ajax({
            url: '/auth',
            type: 'PUT',
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify({'username': self.$('#username').val(),
                                  'password': self.$('#password').val(),
                                  'login':1,
                                  'remember':remember}),
            success: function(res) {
              if (res.username) {
                eatz.utils.showAlert('Signin Successful!', 'Welcome back ' + res.username, 'alert-success');
                //update UI to show username, show/hide logout form
                $('#greet').html(res.username);
                $('#logoutUser').html('<b>'+res.username+'</b>');
                $('.btn.login').css("display", "none");
                $('.logintext').css("display", "none");
                $('.btn.logout').css("display", "block");
                $('#login_form')[0].reset(); //clear login form
                document.getElementById('edit-menu').hidden = false;
              } else {
                eatz.utils.showAlert('Error', res.error, 'alert-error');
              }
            },
            error: function (err) {
                eatz.utils.showAlert('Error', err.responseText, 'alert-error');
            }
        });
    },

    logout:function(e){
        $.ajax({
            url: '/auth',
            type: 'PUT',
            success:function(err){
                eatz.utils.showAlert('Success','You are logged out', 'alert-success');
                $('#greet').html("Sign In" + '<strong class="caret"></strong>');
                $('#logoutUser').html('');
                $('.btn.login').css("display", "block");
                $('.logintext').css("display", "block");
                $('.btn.logout').css("display", "none");
                $('#login_form')[0].reset(); //clear login form
                $('#logindrop').removeClass('open');
                document.getElementById('edit-menu').hidden = true;
            }
        });
    },

    selectMenuItem: function(menuItem) {
        $(".nav li").removeClass('active');
        if (menuItem) {
            $('.' + menuItem).addClass('active');
        }
    }

});