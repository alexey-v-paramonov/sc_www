(function () {
    let signupBtn = document.getElementById("signup-submit");
    signupBtn.addEventListener('click', function (e) {
        console.log('button clicked!', arguments);
        e.preventDefault();

        var form = document.getElementById('signup-form');
        var data = new FormData(form);
        var req = new XMLHttpRequest();

        req.open('POST', API_BASE + '/users/');
        req.onreadystatechange = function (e) {
            if (req.readyState === 4) {
                // User created
                if (req.status === 201) {
                    console.log(req.responseText)
                } else {
                    console.log("Error", req.statusText);
                }
            }
        };
        req.send(data);
    }, false);
}());