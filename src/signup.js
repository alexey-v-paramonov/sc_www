(function () {
    let signupBtn = document.getElementById("signup-submit");
    signupBtn.addEventListener('click', (e) => {

        e.preventDefault();

        const form = document.getElementById('signup-form');
        const submitBtn = document.getElementById('signup-submit');
        let data = new FormData(form);
        let req = new XMLHttpRequest();

        // Hide all errors
        let errorMessages = document.querySelectorAll('div[id^="form-error-"]');
        for (let errMsgEl of errorMessages) {
            errMsgEl.style.visibility = 'hidden';
        }

        // Disable submit while request is running
        submitBtn.disabled = true;

        req.open('POST', API_BASE + '/users/');
        req.onreadystatechange = function (e) {
            if (req.readyState === 4) {
                // User created
                if (req.status === 201) {
                    let response = JSON.parse(req.responseText);
                    if (response.token) {
                        window.localStorage.setItem('token', response.token);
                        window.location.href = "/account";
                    }
                // Request returned with an error
                } else {
                    let responseData = JSON.parse(req.response);
                    for (let field of Object.keys(responseData)) {

                        let errorCodes = responseData[field];
                        for (let errCode of errorCodes) {
                            let errMsgEl = document.getElementById(`form-error-${field}-${errCode}`);
                            if (errMsgEl) {
                                errMsgEl.style.visibility = 'visible';
                            }
                        }

                    }
                    submitBtn.disabled = false;
                }
            }
        };
        req.send(data);

    }, false);
}());