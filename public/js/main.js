var eatz =  eatz || {};

Backbone.View.prototype.close = function(){
    // We have zombie view before, and this is one part of the solution that Alan suggest to fix the zombie view
    // but seesm like not working properly.
    // 
    this.remove();
    this.unbind();
},

eatz.AppRouter = Backbone.Router.extend({

    routes: {
        "": "home",
        "about":"about",
        "dishes/add":"addDish",
        "dishes/page/:page":"list",
        "dishes":"list",
        "dishes/:id":"dishDetails"
    },

    initialize: function() {
        // initialize the views
        this.about;
        this.home;
        eatz.pubSub = _.extend({}, Backbone.Events);
        this.headerView = new eatz.HeaderView();
        $('#navbar').html(this.headerView.el);
    },

    about:function(){
        if(!this.aboutView){
            this.aboutView = new eatz.AboutView();
        };
        $('#content').html(this.aboutView.render().el);
        this.headerView.selectMenuItem('about-menu');
        document.body.style.background = "url('img/HomeView.jpg')";
    },

    home: function() {
        if (!this.homeView) {
            this.homeView = new eatz.HomeView();
        };
        $('#content').html(this.homeView.el);
        this.headerView.selectMenuItem('home-menu');
        document.body.style.background = "url('img/HomeView.jpg')";
    },
    
    addDish:function(){
        if (!this.dishes) {  // if dish collection not loaded
            this.dishes = new eatz.DishCollection();
        };
        this.dishes.fetch({  // fetch the collection from localStorage or server
            success: function(coll, resp){
                var dishmodel = new eatz.Dish();  // create new Dish
                coll.add(dishmodel); // add to the collection
                var edview = new eatz.EditView({model: dishmodel}); // create the view for that model
                //$("#content").html(edview.render().el);
            }
        });

        this.headerView.selectMenuItem('edit-menu');
        document.body.style.background = "url('img/EditView.png')";
    },

    list:function(page){
        // Thisis for browse view
        var p = page ? parseInt(page, 10) : 1;
        var dishes = new eatz.DishCollection();
        dishes.fetch({success: function(res){ //fecth all the dishes
            var dishView = new eatz.DishesView({model:res, page:p}); // create the browse view  
            $("#content").html(dishView.render().el); //render the view
        },
            error: function(){
                console.log("Error in main.js");
            }
        });
        this.headerView.selectMenuItem('browse-menu');
        document.body.style.background = "url('img/EditView.png')";
    },

    dishDetails:function(id){
         var dishCollection = new eatz.DishCollection();
         dishCollection.fetch({
            success: function(res){
                if (res.error){
                    eatz.utils.showAlert('Fetch Failed.', 'An error occurred.', 'alert-error');
                }
                else{
                    // If fetch success and no error, res is the dishes collection, 
                    // and we extract the dish model base on the id
                    var dish = res.get(id); 
                    // and create the edit view for that model
                    this.editView = new eatz.EditView({model:dish});
                    //$("#content").html(editView.render().el);
                }
            },
            error :function(e){ //server request returned non-200 type response
                eatz.utils.showAlert('Error', e.responseText, 'alert-error');
            }});
        this.headerView.selectMenuItem('edit-menu');
        document.body.style.background = "url('img/EditView.png')";
    }


});

eatz.utils.loadTemplates(['HomeView', 'AboutView','HeaderView', 'EditView', 'DishView', 'MapView'], function() {
    app = new eatz.AppRouter();
    Backbone.history.start();
});
