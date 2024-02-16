export function EncodeImage(fileInputRef) {
  return new Promise((resolve, reject) => {
    const file = fileInputRef.current.files[0];

    // Vérifier l'extension du fichier
    const allowedExtensions = ["png", "jpeg", "jpg", "gif"];
    const fileExtension = file.name.split(".").pop().toLowerCase();
    if (!allowedExtensions.includes(fileExtension)) {
      reject("The file must have the extension .png, .jpeg ou .jpg.");
    }

    const reader = new FileReader();
    reader.onloadend = function () {
      const base64File = reader.result;
      resolve(base64File);
    };

    reader.readAsDataURL(file);
  });
}
