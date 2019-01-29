var Donation = (function() {

    // form fields for valitation
    var form_fields = ["donation-value", "name", "surname", "email", "cpf", "card-number", "cvv", "card-validity"];

    function render_value_confirmation(periodicity, donation_value) {
        var periodicity_map = {
            "unica": "única",
            "mensal": "mensais",
            "semestral": "semestrais",
            "anual": "anuais"
        }

        $(".value-confirmation").html(donation_value + " " + periodicity_map[periodicity]);
    }

    function on_form_submittion() {
        // validation
        for (field in form_fields) {
            var
                form_field = $("input[name='" + form_fields[field] + "']"),
                label = $("label[for='" + form_fields[field] + "']")
            ;

            if (form_field.val() == "") {
                form_field.css('border', '1px solid #ff5252');
                label.css('color', '#ff5252');
            } else {
                form_field.css('border', '1px solid #d2d2d2');
                label.css('color', '#9e9e9e');
            }
        }
    }

    function inputs_on_blur() {
        for (field in form_fields) {
            var form_field = $("input[name='" + form_fields[field] + "']");

            form_field.blur(function() {
                on_form_submittion();
            });
        }
    }

    function setup_masks() {
        $("input[name='cpf']").mask('000.000.000-00', {reverse: true});
        $("input[name='card-number']").mask('0000 0000 0000 0000');
        $("input[name='card-validity']").mask('00/00');
    }

    function init() {
        
        // renders donation value confirmation
        $("[name='periodicity']").change(function() {
            render_value_confirmation(this.value, $("[name='donation-value']").val());
        });

        $("[name='donation-value']").keyup(function() {
            render_value_confirmation($("[name='periodicity']").val(), this.value);
        });

        // setup validation on form submition
        $("#the-form").submit(function() {
            on_form_submittion();
            return false;
        });

        // setup validation on input blur
        inputs_on_blur();

        // setup masks
        setup_masks();

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
                // 'this' refers to the form
                var errors = validator.numberOfInvalids();
                if (errors) {
                    $(".warning-box").show();
                } else {
                    $(".warning-box").hide();
                }
            },
            submitHandler: function() {
                console.log("valid");
                $(".warning-box").hide();
            }
        });
    }

    return {
        init: init
    }

})();

Donation.init();