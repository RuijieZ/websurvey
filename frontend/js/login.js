$(document).ready(function () {
    let message = $("#message");

    $("#login").click(function () {
        const userName = $("#loginUserName");
        const password = $("#loginPassword");

        if (userName.val() === "") {
            message.text("please enter User Name");
            return;
        }

        if (password.val() === "") {
            message.text("Please enter password");
            return;
        }

        var settings = {
            "url": "https://localhost:44350/api/token",
            "method": "POST",
            "timeout": 10000,
            "headers": {
                "Content-Type": ["application/json"],
            },
            "data": JSON.stringify(
                {
                    "UserName": userName.val(),
                    "Password": password.val()
                }),
        };

        $.ajax(settings).done(function (response) {
            console.log(response);
            window.localStorage.setItem("user", JSON.stringify(response));
            window.location.href = "index.html";
        }).fail(function (request, status, error) {
            message.css("margin-top: 50px");
            message.text("sorry, login failed: " +  request.responseText);
        })



    })


})