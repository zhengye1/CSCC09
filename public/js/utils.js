var eatz = eatz || {};

eatz.utils = {

    // Asynchronously load templates located in separate .html files
    loadTemplates: function(views, callback) {

        var deferreds = [];

        $.each(views, function(index, view) {
            if (eatz[view]) {
                deferreds.push($.get('tpl/' + view + '.html', function(data) {
                    eatz[view].prototype.template = _.template(data);
                }));
            } else {
                console.log(view + " not found");
            }
        });

        $.when.apply(null, deferreds).done(callback);
    },


    //Source: https://github.com/ccoenraets/backbone-cellar/blob/master/bootstrap/js/utils.js
    uploadFile: function (file, callback) {
        var self = this;
        var data = new FormData();
        data.append('file', file);
        $.ajax({
            url: '/dishes/image',
            type: 'POST',
            data: data,
            processData: false,
            cache: false,
            contentType: false,
            success: function(res) {
                eatz.utils.showAlert('Sucess', res, 'alert-success');
                callback(res);
            },
            error :function(e){
                eatz.utils.showAlert('Error!', 'An error occurred while uploading ' + file.name, 'alert-error');
            }
        });        
    },

    displayValidationErrors: function (messages) {
        for (var key in messages) {
            if (messages.hasOwnProperty(key)) {
                this.addValidationError(key, messages[key]);
            }
        }
        this.showAlert('Warning!', 'Fix validation errors and try again', 'alert-warning');
    },

    addValidationError: function (field, message) {
        var controlGroup = $('#' + field).parent().parent();
        controlGroup.addClass('error');
        $('.help-inline', controlGroup).html(message);
    },

    removeValidationError: function (field) {
        var controlGroup = $('#' + field).parent().parent();
        controlGroup.removeClass('error');
        $('.help-inline', controlGroup).html('');
    },

    showAlert: function(title, text, err_class) {
        $('.alert').removeClass("alert-error alert-warning alert-success alert-info");
        $('.alert').addClass(err_class);
        $('.alert').html('<strong>' + title + '</strong> ' + text);
        $('.alert').show();
    },

    hideAlert: function() {
        $('.alert').hide();
    }
};
