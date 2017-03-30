(function () {
    let signinBtn = document.getElementById("signin-submit");
    signinBtn.addEventListener('click', (e) => {

        e.preventDefault();

        const form = document.getElementById('signin-form');
        const submitBtn = document.getElementById('signin-submit');
        let data = new FormData(form);
        let req = new XMLHttpRequest();

        // Hide all errors
        let errorMessages = document.querySelectorAll('div[id^="form-error-"]');
        for (let errMsgEl of errorMessages) {
            errMsgEl.style.visibility = 'hidden';
        }

        // Disable submit while request is running
        signinBtn.disabled = true;

        req.open('POST', API_BASE + '/api-token-auth/');
        req.onreadystatechange = function (e) {
            if (req.readyState === 4) {
                // Logged in uccessfully
                if (req.status === 200) {
                    let response = JSON.parse(req.responseText);
                    if (response.token) {
                        window.localStorage.setItem('auth_token', response.token);
                        window.location.href = "/account";
                    }
                    else {
                        let errMsgEl = document.getElementById("form-error-no-token");
                        if (errMsgEl) {
                            errMsgEl.style.visibility = 'visible';
                        }
                        signinBtn.disabled = false;
                    }
                // Request returned with an error
                } else {
                    let responseData = JSON.parse(req.response);
                    for (let field of Object.keys(responseData)) {
                        let errorCodes = responseData[field];
                        for (let errCode of errorCodes) {
                            
                            errCode = errCode.replace(/\s/g, '-').replace(/\./g, '').toLowerCase();
                            let errMsgEl = document.getElementById(`form-error-${field}-${errCode}`);
                            console.log(`form-error-${field}-${errCode}`);
                            if (errMsgEl) {
                                errMsgEl.style.visibility = 'visible';
                            }
                        }

                    }
                    signinBtn.disabled = false;
                }
            }
        };
        req.send(data);

    }, false);
}());