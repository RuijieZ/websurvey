
$("document").ready(function () {
    var message = $("#message");
    let passwordRegex = new RegExp("^(?=.{8,})(?=.*[a-z])(?=.*[A-Z])(?!.*\s).*$");
    const firstName = $("#firstName");
    const lastName = $("#lastName");
    const userName = $("#userName");
    const password = $("#password");
    const passwordRepeat = $("#password-repeat");
    let fields = [firstName, lastName, userName, password];
    $("#register-button").click(function() {
        $.each(fields, function(idx, element) {
            if (element.val() === "") {
                message.text("sorry, " + element.attr("id").replace("#", " ") + " cannot be empty");
                return;
            }
        });

        if (userName.val().length < 5) {
            message.text("Sorry, user name must have length at least 5");
            return;
        }

        if (password.val() !== passwordRepeat.val()) {
            message.text("Sorry, password has to match repeated password");
            return;
        }

        if (!passwordRegex.test(password.val())) {
            message.text("Sorry, password not strong enough. Password must be in the length of 8-200 characters long and has upper and lower case letters");
        }

        let settings = {
            "url": "https://localhost:44350/api/users",
            "method": "POST",
            "timeout": 10000,
            "headers": {
                "Content-Type": ["application/json"]
            },
            "data": JSON.stringify({
                "UserName":userName.val(),
                "Password":password.val(),
                "FirstName":firstName.val(),
                "LastName":lastName.val()
            }),
        };


        $.ajax(settings)
            .done(function (response, statusText, xhr) {
                console.log(response);
                console.log(xhr.status);
                message.text("Register success. Redirect you to login page in 3 seconds");
                setTimeout(function(){
                    window.location.href = 'login.html';
                }, 3000);
            }).fail(function(request, status, error) {
                message.text("sorry, register failed due to the following reason: " +  request.responseText);
            });


        message.text("");

    });
})