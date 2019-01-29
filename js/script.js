var Donation = (function() {

    // form fields for valitation
    var form_fields = ["donation-value", "name", "surname", "email", "cpf", "card-number", "cvv", "card-validity"];

    // changes donation text with data
    function render_value_confirmation(periodicity, donation_value) {
        var periodicity_map = {
            "unica": "única",
            "mensal": "mensais",
            "semestral": "semestrais",
            "anual": "anuais"
        }

        $(".value-confirmation").html(donation_value + " " + periodicity_map[periodicity]);
    }

    function inputs_on_blur() {
        for (field in form_fields) {
            var form_field = $("input[name='" + form_fields[field] + "']");

            form_field.blur(function() {
                var
                    label = $("label[for='" + this.name + "']"),
                    $this = $(this)
                ;
                
                if ($this.val() == "") {
                    $this.css('border', '1px solid #ff5252');
                    label.css('color', '#ff5252');
                } else {
                    $this.css('border', '1px solid #d2d2d2');
                    label.css('color', '#9e9e9e');
                }
            });
        }
    }

    function setup_masks() {
        $("input[name='cpf']").mask('000.000.000-00', {reverse: true});
        $("input[name='card-number']").mask('0000 0000 0000 0000');
        $("input[name='card-validity']").mask('00/00');
    }

    function submit_handler() {
        var request = $.ajax({
            url: "https://frontend-test-trackmob.firebaseio.com/253c0d77-7095-48a0-8114-6ea307ae743b/dirceup/donors.json",
            method: "POST",
            dataType: "json",
            contentType: 'application/json',
            data: JSON.stringify({
                "first_name": $("input[name='name']").val(),
                "last_name": $("input[name='surname']").val(),
                "complete_name": $("input[name='name']").val() + " " + $("input[name='surname']").val(),
                "phone": "4123456789",
                "cellphone": "41987654321",
                "gender": "male",
                "birthdate": "1990-01-01",
                "document": $("input[name='cpf']").cleanVal(),
                "card_number": $("input[name='card-number']").cleanVal(),
                "cvv": $("input[name='cvv']").val(),
                "validity​": $("input[name='card-validity']").val(),
                "accept_contact": $("input[name='accept-ngo-info']").prop("checked"),
                "accept_readjustment": false
            })
        });
        
        request.done(function(msg) {
            console.log(msg);
        });
    }

    function init() {
        
        // renders donation value confirmation
        $("[name='periodicity']").change(function() {
            render_value_confirmation(this.value, $("[name='donation-value']").val());
        });

        $("[name='donation-value']").keyup(function() {
            render_value_confirmation($("[name='periodicity']").val(), this.value);
        });

        // setup validation on input blur
        inputs_on_blur();

        // setup masks
        setup_masks();

        // setup validation on form submition
        $("#the-form").validate({
            rules: {
                "email": {
                    required: true,
                    email: true
                },
                "card-number": {
                    required: true,
                    creditcard: true
                },
                "cpf": {
                    required: true,
                    cpfBR: true
                },
                "cvv": {
                    required: true,
                    minlength: 3
                }
            },
            invalidHandler: function(event, validator) {
                var errors = validator.numberOfInvalids();
                if (errors) {
                    $(".warning-box").show();
                } else {
                    $(".warning-box").hide();
                }
            },
            submitHandler: function() {
                $(".warning-box").hide();

                submit_handler();
            }
        });
    }

    return {
        init: init
    }

})();

Donation.init();