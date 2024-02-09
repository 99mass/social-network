export function signUpNotification(router,pageRedirect) {
    Swal.fire({
        icon: 'success',
        title: 'Great!',
        text: 'Registration successful! Please proceed to log in.',
        confirmButtonColor: "#3155f1",
        confirmButtonText: "Go, to sign in"
    }).then((result) => {
        if (result.isConfirmed) {
            router.push("/" + pageRedirect);
        }
    });
    
}
export function successNotification(text) {
    Swal.fire({
        icon: 'success',
        title: 'Great!',
        text: text,
        confirmButtonColor: "#3155f1",
        confirmButtonText: "Go, to sign in"
    }).then((result) => {
        if (result.isConfirmed) {
            router.push("/" + pageRedirect);
        }
    });
    
}