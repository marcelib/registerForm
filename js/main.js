var peselValidation = peselValidation;
var passwordsMatch = false;
var passwordStrongEnough = false;
var loginAvailable = false;
var peselCorrect = false;
var successColor = "#66cc66";
var failureColor = "#ff6666";


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
            usernameField.style.backgroundColor = failureColor;
            message.style.color = failureColor;
            message.innerHTML = "Username already taken!";
            loginAvailable = false;
            onFieldChangeAction();
        }
        else {
            usernameField.style.backgroundColor = successColor;
            message.style.color = successColor;
            message.innerHTML = "Username available!";
            loginAvailable = true;
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
    if (!emptyFields.length && passwordsMatch && passwordStrongEnough && loginAvailable && peselCorrect) {
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
        pass1.style.backgroundColor = successColor;
        message.style.color = successColor;
        message.innerHTML = "Password is strong enough!";
        passwordStrongEnough = true;
        onFieldChangeAction();
    } else {
        pass1.style.backgroundColor = failureColor;
        message.style.color = failureColor;
        message.innerHTML = "Passwords needs to contain at least 6 signs, " +
            "one lowercase letter, one uppercase letter and a number.";
        passwordStrongEnough = false;
        onFieldChangeAction();
    }
}

function checkPasswordMatch() {
    var pass1 = document.getElementById('password');
    var pass2 = document.getElementById('repeat-password');
    var message = document.getElementById('repeat-password-message');
    if (!pass2.value.length) {
        message.innerHTML = "";
        passwordsMatch = false;
    } else if (pass1.value == pass2.value) {
        pass2.style.backgroundColor = successColor;
        message.style.color = successColor;
        message.innerHTML = "Passwords Match!";
        passwordsMatch = true;
        onFieldChangeAction();
    } else {
        pass2.style.backgroundColor = failureColor;
        message.style.color = failureColor;
        message.innerHTML = "Passwords Do Not Match!";
        passwordsMatch = false;
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

