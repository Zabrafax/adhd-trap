export function initializeDropzone(dropzoneId, fileNameId, variable) {
    const input = document.getElementById(dropzoneId);
    const fileNameDisplay = document.getElementById(fileNameId);

    input.addEventListener('change', () => {
        const file = input.files[0];
        if (file) {
            fileNameDisplay.textContent = file.name;
            variable.value = file;
        } else {
            variable.value = null;
            fileNameDisplay.textContent = 'No file chosen';
        }
    });

    variable.value = null;
    fileNameDisplay.textContent = 'No file chosen';
}