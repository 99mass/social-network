export function signUpNotification(router,pageRedirect) {
    Swal.fire({
        icon: 'success',
        title: 'Great!',
        text: 'Registration successful! Please proceed to log in.',
        confirmButtonColor: "#00D4A1",
        confirmButtonText: "Go, to sign in"
    }).then((result) => {
        if (result.isConfirmed) {
            router.push("/" + pageRedirect);
        }
    });
    
}