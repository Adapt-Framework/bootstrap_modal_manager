(function($){
    
    $.widget("adf.modal_manager", {
        active_modals: [],
        callbacks: [],
        counter: 0,
        
        _create: function(){
            
        },
        
        self: function(){
            return this;
        },
        
        modal: function(options){
            //console.log(this.active_modals);
            var $this = this.element;
            
            var defaults = {
                title: null,
                icon: null,
                content: "",
                content_url: null,
                buttons: [
                    {
                        label: "OK",
                        icon: null,
                        primary: true,
                        warning: false,
                        close_modal: true,
                        callback: null
                    },
                    {
                        label: "Cancel",
                        icon: null,
                        primary: true,
                        warning: false,
                        close_modal: true,
                        callback: null
                    }
                ],
                size: 'medium',
                header: true,
                footer: true,
                close: true,
                show: true,
                on_content_loaded: null
            };
            
            options = $.extend({}, defaults, options || {});
            
            var id = this.generate_id();
            var title_id = this.generate_id();
            
            var $wrapper = $('<div class="bootstrap-modal-manager modal fade" id="' + id + '" tabindex="-1" role="dialog" aria-labelledby="' + title_id + '" aria-hidden="true"><div class="modal-dialog"></div></div>');
            var $content = $('<div class="modal-content"></div>');
            var $body = $('<div class="modal-body"></div>');
            
            
            if (options.header){
                var $header = $('<div class="modal-header"></div>');
                
                if (options.close) {
                    $header.append('<button type="button" class="close" data-dismiss="modal"></button>');
                    $header.find('button').append('<span aria-hidden="true">&times;</span>');
                    $header.find('button').append('<span class="sr-only">Close</span>');
                }
                
                if (options.title) {
                    $header.append('<h4 class="modal-title" id="' + title_id + '">' + options.title + '</h4>');
                    if (options.icon) {
                        $header.find('.modal-title').prepend('&nbsp;');
                        $header.find('.modal-title').prepend(options.icon);
                    }
                    
                    $content.append($header);
                }
            }
            
            if (options.content) {
                $body.append(options.content);
            }
            
            $content.append($body);
            
            if (options.footer){
                var $footer = $('<div class="modal-footer"></div>');
                
                for(var i = 0; i < options.buttons.length; i++){
                    var $button = $('<button type="button" class="modal-control btn">' + options.buttons[i].label + '</button>');
                    if (options.buttons[i].close_modal){
                        $button.attr('data-dismiss', 'modal');
                    }
                    
                    if (options.buttons[i].primary){
                        $button.addClass('btn-primary');
                    }else if (options.buttons[i].warning){
                        $button.addClass('btn-danger');
                    }else{
                        $button.addClass('btn-default');
                    }
                    
                    if (options.buttons[i].icon){
                        $button.prepend('&nbsp;');
                        $button.prepend(options.buttons[i].icon);
                    }
                    
                    console.log(options.buttons[i]);
                    
                    if (options.buttons[i].callback){
                        this.callbacks.push({
                            id: id,
                            label: options.buttons[i].label,
                            callback: options.buttons[i].callback
                        });
                        //this.callbacks[id][options.buttons[i].label] = options.buttons[i].callback;
                    }
                    
                    
                    $footer.append($button);
                }
                
                
                $content.append($footer);
            }
            
            $wrapper.find('.modal-dialog').append($content);
            
            /* Append it to the body */
            $this.append($wrapper);
            
            /* Bind events to the buttons */
            $this.find('#' + id + ' .modal-footer button.modal-control').on(
                'click',
                {
                    modal_manager: this
                },
                function(event){
                    var $button = $(this);
                    var $modal = $button.parents('.modal');
                    var id = $modal.attr('id');
                    var $label = $button.clone();
                    $label.find('.view.icon').detach();
                    var label = $label.text();
                    label = label.replace(/^\s/, '');
                    
                    var modal_manager = event.data.modal_manager;
                    
                    
                    for(var i = 0; i < modal_manager.callbacks.length; i++){
                        if (modal_manager.callbacks[i].id == id && modal_manager.callbacks[i].label == label){
                            modal_manager.callbacks[i].callback(label, $modal, event);
                            modal_manager.callbacks.pop();
                        }
                    }
                    
                    modal_manager.active_modals.pop();
                    
                    if (modal_manager.active_modals.length){
                        var active = modal_manager.active_modals[modal_manager.active_modals.length - 1];
                        $('#' + active).modal('show');
                    }
                    
                }
            );
            
            /* Bind show events */
            $this.find('#' + id).on(
                'show.bs.modal',
                {
                    modal_manager: this
                },
                function(event){
                    var $modal = $(this);
                    var id = $modal.attr('id');
                    
                    
                    var modal_manager = event.data.modal_manager;
                    
                    //alert('Showing new modal');
                    
                }
            );
            
            /* Bind close events */
            $this.find('#' + id).on(
                'hidden.bs.modal',
                {
                    modal_manager: this
                },
                function(event){
                    //console.log(event);
                    //console.log(this);
                    //if ($('.modal[style="display: block;"]').length == 0){
                        //event.data.modal_manager.active_modals = [];
                        //event.data.modal_manager.callbacks = [];
                        //$('.modal').detach();
                    //}
                }
            );
            
            /* Hide any modals currently displayed */
            if (this.active_modals.length) {
                var active = this.active_modals[this.active_modals.length - 1];
                $('#' + active).modal('hide');
            }
            
            
            /* Add the modal to the stack */
            this.active_modals.push(id);
            
            
            /* Should we load content remotely? */
            if (options.content_url) {
                var wait_id = this.wait('<strong>Loading please wait...</strong>');
                
                $.ajax({
                    url: options.content_url,
                    success: function(data){
                        var modal_manager = $('body').data('adf-modal_manager');
                        if (modal_manager.active_modals.length) {
                            var active = modal_manager.active_modals[modal_manager.active_modals.length - 1];
                            $('#' + active).modal('hide');
                        }
                        
                        modal_manager.callbacks.pop();
                        modal_manager.active_modals.pop();
                        
                        if (modal_manager.active_modals.length){
                            var active = modal_manager.active_modals[modal_manager.active_modals.length - 1];
                            $('#' + active).find('.modal-body').append(data).append('<div class="clearfix"></div>');
                            $('#' + active).modal('show');
                            
                            //if ($('#' + active).find('form.view.form').length){
                            //    /* Initialise the form */
                            //    $('#' + active).find('form.view.form').each(function(){
                            //        new adapt.form(this);
                            //    });
                            //}
                        }
                    }
                });
                
            }else{
                /* Show this modal */
                if (options.show) $('#' + id).modal('show');
            }
            
            return id;
        },
        
        alert: function(message, options){
            var defaults = {
                title: null,
                icon: null,
                content: message,
                buttons: [
                    {
                        label: "OK",
                        icon: null,
                        primary: true,
                        warning: false,
                        close_modal: true,
                        callback: null
                    }
                ],
                size: 'medium',
                header: false,
                footer: true,
                close: false
            };
            
            options = $.extend({}, defaults, options || {});
            
            return this.modal(options);
        },
        
        confirm: function(message, buttons, options){
            var defaults = {
                title: null,
                icon: null,
                content: message,
                buttons: buttons,
                size: 'medium',
                header: false,
                footer: true,
                close: false
            };
            
            options = $.extend({}, defaults, options || {});
            
            return this.modal(options);
        },
        
        wait: function(message){
            
            var $content = $('<div class="view progress_bar"><div class="progress"></div><div class="message">' + message + '</div></div>');
            $content.find('.progress').append('<div class="progress-bar progress-bar-striped active" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style="width: 100%"><span class="sr-only">100% Complete</span></div>');
            
            var options = {
                title: null,
                icon: null,
                content: $content,
                buttons: [],
                size: 'medium',
                header: false,
                footer: false,
                close: false
            };
            
            return this.modal(options);
        },
        
        generate_id: function(){
            var counter = this.counter;
            var id = "bootstrap-modal-manager-id-" + counter;
            
            /* Update the counter */
            this.counter = this.counter + 1;
            
            return id;
        }
    });
    
    $(document).ready(
        function(){
            $('body').modal_manager();
        }
    )
    
})(jQuery);