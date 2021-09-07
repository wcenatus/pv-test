$(function() {

    jQuery.extend(jQuery.validator.messages, {
        required: "(This field is required)"})
      $('form').submit(function(e){
          e.preventDefault();
      }).validate({ // initialize the plugin
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
                e.preventDefault()
                $("#submit-text").addClass('hidden')
                $(".lds-ring").removeClass('hidden')
                console.log(form)
                console.log($(form).serializeArray())
                $.ajax({
                    type: 'post',
                    url: '/forms/supplyorderform',
                    data: $(form).serialize(),
                    success: function(response) {
                        $("#form-success").removeClass('hidden')
                        $(".lds-ring").addClass('hidden')
                        // localStorage.setItem('form-success', 'success')
                        // window.location.reload()
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