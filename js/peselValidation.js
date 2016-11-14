var peselValidation = new function () {

    var that = this;


    this.processPeselValidation = function () {
        var peselField = $("#pesel");
        var pesel = peselField.val();
        var validationData = that.validatePesel(pesel);
        if (validationData && validationData.sex === 'm') {
            that.peselMaleAction(validationData);
        } else if (validationData) {
            that.peselFemaleAction(validationData);
        } else {
            that.peselIncorrectAction();
        }
    };

    this.validatePesel = function (pesel) {

        var wages = [9, 7, 3, 1, 9, 7, 3, 1, 9, 7];
        var dateOfBirth = new Date();
        var checksum = 0;
        if (!pesel || isNaN(pesel) || parseInt(pesel) < 0 || pesel.length !== 11) {
            return null;
        }
        var year = parseInt(pesel.substring(0, 2), 10);
        var month = parseInt(pesel.substring(2, 4), 10) - 1;
        var day = parseInt(pesel.substring(4, 6), 10);
        if (month > 80) {
            year += 1800;
            month = month - 80;
        } else if (month > 60) {
            year += 2200;
            month = month - 60;
        } else if (month > 40) {
            year += 2100;
            month = month - 40;
        } else if (month > 20) {
            year += 2000;
            month = month - 20;
        } else {
            year += 1900;
        }
        dateOfBirth.setFullYear(year, month, day);
        for (var i = 0; i < wages.length; i++) {
            checksum += (parseInt(pesel.substring(i, i + 1), 10) * wages[i]);
        }
        var validated = checksum % 10 === parseInt(pesel.substring(10, 11), 10);
        var sex = parseInt(pesel.substring(9, 10), 10) % 2 === 1 ? 'm' : 'k';
        return {
            valid: validated,
            sex: sex,
            date: dateOfBirth
        };
    };

    this.peselMaleAction = function (result) {
        var maleButton = document.getElementById("male");
        maleButton.checked = true;
        that.message.style.color = stateAndContants.SUCCESS_COLOR;
        that.message.innerHTML = "Pesel is correct and you have been recognized as male.";
        document.getElementById('birthdate').value = result.date.toISOString().substring(0, 10);
        stateAndContants.peselCorrect = true;
        onFieldChangeAction();
    };

    this.peselFemaleAction = function (result) {
        var femaleButton = document.getElementById("female");
        femaleButton.checked = true;
        that.message.style.color = stateAndContants.SUCCESS_COLOR;
        that.message.innerHTML = "Pesel is correct and you have been recognized as female.";
        document.getElementById('birthdate').value = result.date.toISOString().substring(0, 10);
        stateAndContants.peselCorrect = true;
        onFieldChangeAction();
    };

    this.peselIncorrectAction = function () {
        that.message.style.color = stateAndContants.FAILURE_COLOR;
        that.message.innerHTML = "Pesel is incorrect!";
        stateAndContants.peselCorrect = false;
        onFieldChangeAction();
    };
};