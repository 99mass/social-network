export function signUpNotification(router,pageRedirect) {
    Swal.fire({
        icon: 'success',
        title: 'Great!',
        text: 'SweetAlert2 is working with CDN in Next.js!',
        confirmButtonText: "Yes, delete it!"
    }).then((result) => {
        // Vérifier si l'utilisateur a cliqué sur le bouton de confirmation
        if (result.isConfirmed) {
            // Effectuer la redirection ici
            router.push("/" + pageRedirect); // Remplacez '/nouvelle-page' par l'URL de la page de redirection
        }
    });
    
}