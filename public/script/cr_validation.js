$(function() {

    jQuery.extend(jQuery.validator.messages, {
        required: "(This field is required)"})
      $('form').validate({ // initialize the plugin
            rules: {
                'termPrompts': {
                    required: true
                }
            },
            errorPlacement:function(error,element){
       
            },
            messages: {
                'termPrompts': {
                    required: "You must check at least 1 box"
                }
            },
            submitHandler: function(form) { // for demo
                $(".lds-ring").removeClass('hidden')
                console.log(form)
                console.log($(form).serializeArray())
                $.ajax({
                    type: 'post',
                    url: '/',
                    data: new FormData(form),
                    success: function(response) {
                        $("#form-success").removeClass('hidden')
                        $(".lds-ring").addClass('hidden')
                    },
                    error: function(){
                       alert('There was an error, please refresh and try again')
                    }
                  });
                // alert('valid form submitted'); // for demo
                // return false; // for demo
            },
            invalidHandler: function(form, validator) {
                // var errors = validator.numberOfInvalids();
                // if (errors) {                    
                //     validator.errorList[0].element.focus();
                // }
            } 
        });

});