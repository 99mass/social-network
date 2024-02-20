export function signUpNotification(router, pageRedirect) {
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
        confirmButtonText: "Glose"
    });
}
export function errorNotification(text) {
    const Toast = Swal.mixin({
        toast: true,
        color: "red",
        position: "center",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
        }
    });
    Toast.fire({
        icon: "error",
        title: text
    });
}

