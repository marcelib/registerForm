var birthdateAndSexValidation = new function () {
    
    var that = this;
    
    this.verifyBirthdateAndSex = function () {
        var peselData = peselValidation.validatePesel();
        var birthdate = $("#birthdate").val();
        if (!peselData) {
            return;
        }
        if (peselData.date && this.checkPeselBirthdateCompatibility(peselData.date, birthdate)) {
            that.displayBirthdateAlert(stateAndContants.SUCCESS_COLOR, "Birthdate is compatible with pesel!");
        } else {
            that.displayBirthdateAlert(stateAndContants.WARNING_COLOR, "Warning: birthdate is not compatible with pesel");
        }
        if (peselData.sex && this.checkPeselSexCompatibility(peselData.sex, birthdate)) {
            that.displaySexAlert(stateAndContants.SUCCESS_COLOR, "Sex is compatible with pesel!");
        } else {
            that.displaySexAlert(stateAndContants.WARNING_COLOR, "Warning: sex is not compatible with pesel");
        }
    };

    this.checkPeselBirthdateCompatibility = function (peselDate, date) {
        return peselDate.toISOString().substring(0, 10) === date;
    };

    this.checkPeselSexCompatibility = function (peselSex) {
        var radios = document.getElementsByName('sex');
        var gender = undefined;
        radios.forEach(function (obj) {
            if (obj.checked) {
                gender = obj.value;
            }
        });
        return gender && gender === peselSex;
    };


    this.displayBirthdateAlert = function (color, message) {
        stateAndContants.birthdateMessage.style.color = color;
        stateAndContants.birthdateMessage.innerHTML = message;
    };

    this.displaySexAlert = function (color, message) {
        stateAndContants.sexMessage.style.color = color;
        stateAndContants.sexMessage.innerHTML = message;
    };
};
