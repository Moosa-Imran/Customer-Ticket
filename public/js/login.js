$(document).ready(function () {

    // Fetch user information and redirect if authenticated
    fetch('/fetchUser')
        .then(response => response.json())
        .then(data => {
            if (data.status === true) {
                window.location.href = '/dashboard';
            } else {
                console.log("User is not authenticated");
            }
        })
        .catch(error => {
            console.error('Error fetching user data:', error);
        });

    // Sign Up Function
    $('.signup-form').submit(function (e) {
        e.preventDefault();

        const fullName = $('#signup-name').val().trim();
        const email = $('#signup-email').val().trim();
        const password = $('#signup-password').val().trim();
        const confirmPassword = $('#signup-confirm-password').val().trim();

        if (!fullName || !email || !password || !confirmPassword) {
            iziToast.error({ title: 'Error', message: 'All fields are required!' });
            return;
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            iziToast.error({ title: 'Error', message: 'Invalid email format!' });
            return;
        }

        if (password.length < 6) {
            iziToast.error({ title: 'Error', message: 'Password must be at least 6 characters long!' });
            return;
        }

        if (password !== confirmPassword) {
            iziToast.error({ title: 'Error', message: 'Passwords do not match!' });
            return;
        }

        $.ajax({
            url: '/signup',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ fullName, email, password }),
            success: function (response) {
                if (response.status === 'success') {
                    iziToast.success({ title: 'Success', message: response.message });
                    setTimeout(() => { window.location.href = '/dashboard'; }, 2000);
                } else {
                    iziToast.error({ title: 'Error', message: response.message });
                }
            },
            error: function (xhr) {
                const response = JSON.parse(xhr.responseText);

                if (xhr.status === 400 && response.status === 'email_exists') {
                    iziToast.error({ title: 'Error', message: response.message });
                } else if (xhr.status === 400 && response.status === 'short_password') {
                    iziToast.error({ title: 'Error', message: response.message });
                } else {
                    iziToast.error({ title: 'Error', message: 'An error occurred. Please try again.' });
                }
            }
        });
    });



    $('.signin-form').submit(function (e) {
        e.preventDefault();

        const email = $('#email').val().trim();
        const password = $('#password').val().trim();

        if (!email || !password) {
            iziToast.error({ title: 'Error', message: 'Email and password are required!' });
            return;
        }

        $.ajax({
            url: '/login',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ email, password }),
            success: function (response) {
                if (response.status === 'success') {
                    iziToast.success({ title: 'Success', message: response.message });
                    setTimeout(() => { window.location.href = '/dashboard'; }, 2000);
                } else {
                    iziToast.error({ title: 'Error', message: response.message });
                }
            },
            error: function (xhr) {
                if (xhr.status === 401) {
                    const response = JSON.parse(xhr.responseText);
                    iziToast.error({ title: 'Error', message: response.message });
                } else {
                    iziToast.error({ title: 'Error', message: 'An error occurred. Please try again.' });
                }
            }
        });
    });

});
