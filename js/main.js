$(document).ready(function () {
    addInputListeners();
    createInputMessages();
    setUpForValidation();
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
    document.getElementById("login").onkeydown = function () {
        clearTimeout(stateAndContants.typingTimer);
    };
    document.getElementById("login").onkeyup = function () {
        clearTimeout(stateAndContants.typingTimer);
        stateAndContants.typingTimer =
            setTimeout(getLoginAvailability, stateAndContants.doneTypingInterval);
    };
    document.getElementById("login").onblur = function () {
        getLoginAvailability();
    };
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
    var loginDiv = stateAndContants.loginDiv;
    var loginMessage = stateAndContants.loginMessage;
    var username = loginDiv.value;
    if (username === "") {
        return;
    }
    var url = "http://edi.iem.pw.edu.pl/bach/register/check/" + username;

    $.get(url, function (json) {
        if (json && json[username] === true) {
            loginDiv.style.backgroundColor = stateAndContants.FAILURE_COLOR;
            loginMessage.style.color = stateAndContants.FAILURE_COLOR;
            loginMessage.innerHTML = "Username already taken!";
            stateAndContants.loginAvailable = false;
            onFieldChangeAction();
        }
        else {
            loginDiv.style.backgroundColor = stateAndContants.SUCCESS_COLOR;
            loginMessage.style.color = stateAndContants.SUCCESS_COLOR;
            loginMessage.innerHTML = "Username available!";
            stateAndContants.loginAvailable = true;
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
    if (!emptyFields.length && stateAndContants.passwordsMatch &&
        stateAndContants.passwordStrongEnough && stateAndContants.loginAvailable && stateAndContants.peselCorrect) {
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
    var passDiv = stateAndContants.passDiv;
    var passMessage = stateAndContants.passMessage;
    if (re.test(stateAndContants.passDiv.value)) {
        passDiv.style.backgroundColor = stateAndContants.SUCCESS_COLOR;
        passMessage.style.color = stateAndContants.SUCCESS_COLOR;
        passMessage.innerHTML = "Password is strong enough!";
        stateAndContants.passwordStrongEnough = true;
        onFieldChangeAction();
    } else {
        passDiv.style.backgroundColor = stateAndContants.FAILURE_COLOR;
        passMessage.style.color = stateAndContants.FAILURE_COLOR;
        passMessage.innerHTML = "Passwords needs to contain at least 6 signs, " +
            "one lowercase letter, one uppercase letter and a number.";
        stateAndContants.passwordStrongEnough = false;
        onFieldChangeAction();
    }
}

function checkPasswordMatch() {
    var passDiv = stateAndContants.passDiv;
    var passRepeatDiv = stateAndContants.passRepeatDiv;
    var repeatPassMessage = stateAndContants.repeatPassMessage;
    if (!passRepeatDiv.value.length) {
        repeatPassMessage.innerHTML = "";
        stateAndContants.passwordsMatch = false;
    } else if (passDiv.value == passRepeatDiv.value) {
        passRepeatDiv.style.backgroundColor = stateAndContants.SUCCESS_COLOR;
        repeatPassMessage.style.color = stateAndContants.SUCCESS_COLOR;
        repeatPassMessage.innerHTML = "Passwords Match!";
        stateAndContants.passwordsMatch = true;
        onFieldChangeAction();
    } else {
        passRepeatDiv.style.backgroundColor = stateAndContants.FAILURE_COLOR;
        repeatPassMessage.style.color = stateAndContants.FAILURE_COLOR;
        repeatPassMessage.innerHTML = "Passwords Do Not Match!";
        stateAndContants.passwordsMatch = false;
        onFieldChangeAction();
    }
}

function readURL(input) {
    if (input.files && input.files[0]) {
        var fileReader = new FileReader();
        fileReader.onload = function (e) {
            createAndAppendImg(e.target.result)
        };
        fileReader.readAsDataURL(input.files[0]);
    }
}

function setUpForValidation() {
    $("#submit-form").addClass("button-unavailable");
}

function createInputMessages() {
    document.getElementById("login-container").appendChild(createSpanInsideDiv("login-message"));
    document.getElementById("password-container").appendChild(createSpanInsideDiv("password-message"));
    document.getElementById("repeat-password-container").appendChild(createSpanInsideDiv("repeat-password-message"));
    document.getElementById("pesel-container").appendChild(createSpanInsideDiv("pesel-message"));
    peselValidation.message = document.getElementById('pesel-message');
    stateAndContants.passDiv = document.getElementById('password');
    stateAndContants.passRepeatDiv = document.getElementById('repeat-password');
    stateAndContants.passMessage = document.getElementById('password-message');
    stateAndContants.repeatPassMessage = document.getElementById('repeat-password-message');
    stateAndContants.loginDiv = document.getElementById('login');
    stateAndContants.loginMessage = document.getElementById('login-message');
}

function createSpanInsideDiv(spanId) {
    var spanDiv = document.createElement("div");
    var span = document.createElement("span");
    span.setAttribute("id", spanId);
    spanDiv.appendChild(span);
    spanDiv.className += " message-under-input";
    return spanDiv;
}

function createAndAppendImg(imgSrc) {
    var previousImg = $("#avatar-preview");
    if(previousImg){
        previousImg.remove();
    }
    var imgDiv = document.createElement("img");
    imgDiv.setAttribute("id", "avatar-preview");
    imgDiv.setAttribute("src", imgSrc);
    imgDiv.className+=" image-preview";
    document.getElementById("image-preview-div").appendChild(imgDiv);
}

