var peselValidation = new function () {

    var that = this;
    this.message = document.getElementById('pesel-message');


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
        if (!pesel || isNaN(pesel) || parseInt(pesel) < 0 || pesel.length !== 11) {
            return null;
        }
        var year = parseInt(pesel.substring(0, 2), 10);
        var month = parseInt(pesel.substring(2, 4), 10) - 1;
        var day = parseInt(pesel.substring(4, 6), 10) + 1;

        if (month > 80) {
            year += 1800;
            month = month - 80;
        }
        else if (month > 60) {
            year += 2200;
            month = month - 60;
        }
        else if (month > 40) {
            year += 2100;
            month = month - 40;
        }
        else if (month > 20) {
            year += 2000;
            month = month - 20;
        }
        else {
            year += 1900;
        }
        var dateOfBirth = new Date();
        dateOfBirth.setFullYear(year, month, day);
        var wages = [9, 7, 3, 1, 9, 7, 3, 1, 9, 7];
        var checksum = 0;
        for (var i = 0; i < wages.length; i++) {
            checksum += (parseInt(pesel.substring(i, i + 1), 10) * wages[i]);
        }
        checksum = checksum % 10;
        var contrDigit = parseInt(pesel.substring(10, 11), 10);
        var validation = (checksum === contrDigit);
        var sex = 'k';

        if (parseInt(pesel.substring(9, 10), 10) % 2 === 1) {
            sex = 'm';
        }

        return {
            valid: validation,
            sex: sex,
            date: dateOfBirth
        };
    };

    this.peselMaleAction = function (result) {

        var maleButton = document.getElementById("male");
        maleButton.checked = true;
        that.message.style.color = successColor;
        that.message.innerHTML = "Pesel is correct and you have been recognized as male.";
        document.getElementById('birthdate').value = result.date.toISOString().substring(0, 10);
        peselCorrect = true;
    };

    this.peselFemaleAction = function (result) {
        var femaleButton = document.getElementById("female");
        femaleButton.checked = true;
        that.message.style.color = successColor;
        that.message.innerHTML = "Pesel is correct and you have been recognized as female.";
        document.getElementById('birthdate').value = result.date.toISOString().substring(0, 10);
        peselCorrect = true;
    };

    this.peselIncorrectAction = function () {
        that.message.style.color = failureColor;
        that.message.innerHTML = "Pesel is incorrect!";
        peselCorrect = false;
    };
};