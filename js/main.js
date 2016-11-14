$(document).ready(function () {
    addInputListeners();
});

function addInputListeners() {
    addLoginCheckListener();
    addPasswordListener();
    addRepeatPasswordListener();
    addPeselListener();
    addPhotoListener();
    addSubmitAvailableListener();
}

function addLoginCheckListener() {
    document.getElementById("login").onblur = function () {
        getLoginAvailability();
    }
}

function addPasswordListener() {
    document.getElementById("password").onkeyup = function () {
        checkPasswordStrength();
        checkPasswordMatch();
    };
}


function addRepeatPasswordListener() {
    document.getElementById("repeat-password").onkeyup = function () {
        checkPasswordMatch();
    };
}

function addPeselListener() {
    document.getElementById("pesel").onkeyup = function () {
        peselValidation.processPeselValidation();
    };
}

function addPhotoListener() {
    $("#photo").change(function () {
        readURL(this);
    });
}

function addSubmitAvailableListener() {
    var fields = $(".non-empty");
    fields.change(function () {
        onFieldChangeAction();
    });
}

function getLoginAvailability() {
    var message = document.getElementById('login-message');
    var usernameField = document.getElementById('login');
    var username = usernameField.value;
    if (username === "") {
        return;
    }
    var url = "http://edi.iem.pw.edu.pl/bach/register/check/" + username;

    $.get(url, function (json) {
        if (json && json[username] === true) {
            usernameField.style.backgroundColor = applicationState.failureColor;
            message.style.color = applicationState.failureColor;
            message.innerHTML = "Username already taken!";
            applicationState.loginAvailable = false;
            onFieldChangeAction();
        }
        else {
            usernameField.style.backgroundColor = applicationState.successColor;
            message.style.color = applicationState.successColor;
            message.innerHTML = "Username available!";
            applicationState.loginAvailable = true;
            onFieldChangeAction();
        }
    });
}

function onFieldChangeAction() {
    var submitForm = $('#submit-form');
    var fields = $(".non-empty");
    var emptyFields = fields.filter(function () {
        return this.value === "";
    });
    if (!emptyFields.length && applicationState.passwordsMatch &&
        applicationState.passwordStrongEnough && applicationState.loginAvailable && applicationState.peselCorrect) {
        submitForm.removeClass("button-unavailable");
        submitForm.addClass("button-available");
        submitForm.removeAttr("disabled");
    } else {
        submitForm.removeClass("button-available");
        submitForm.addClass("button-unavailable");
        submitForm.attr("disabled", "disabled");
    }
}

function checkPasswordStrength() {
    var re = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    var pass1 = document.getElementById('password');
    var message = document.getElementById('password-message');
    if (re.test(pass1.value)) {
        pass1.style.backgroundColor = applicationState.successColor;
        message.style.color = applicationState.successColor;
        message.innerHTML = "Password is strong enough!";
        applicationState.passwordStrongEnough = true;
        onFieldChangeAction();
    } else {
        pass1.style.backgroundColor = applicationState.failureColor;
        message.style.color = applicationState.failureColor;
        message.innerHTML = "Passwords needs to contain at least 6 signs, " +
            "one lowercase letter, one uppercase letter and a number.";
        applicationState.passwordStrongEnough = false;
        onFieldChangeAction();
    }
}

function checkPasswordMatch() {
    var pass1 = document.getElementById('password');
    var pass2 = document.getElementById('repeat-password');
    var message = document.getElementById('repeat-password-message');
    if (!pass2.value.length) {
        message.innerHTML = "";
        applicationState.passwordsMatch = false;
    } else if (pass1.value == pass2.value) {
        pass2.style.backgroundColor = applicationState.successColor;
        message.style.color = applicationState.successColor;
        message.innerHTML = "Passwords Match!";
        applicationState.passwordsMatch = true;
        onFieldChangeAction();
    } else {
        pass2.style.backgroundColor = applicationState.failureColor;
        message.style.color = applicationState.failureColor;
        message.innerHTML = "Passwords Do Not Match!";
        applicationState.passwordsMatch = false;
        onFieldChangeAction();
    }
}

function readURL(input) {
    if (input.files && input.files[0]) {
        var fileReader = new FileReader();
        var preview = $('#avatar-preview');
        fileReader.onload = function (e) {
            preview.attr('src', e.target.result);
            preview.addClass("image-preview");
        };
        fileReader.readAsDataURL(input.files[0]);
    }
}

