export function initializeDropzone(dropzoneId, fileNameId) {
    const input = document.getElementById(dropzoneId);
    const fileNameDisplay = document.getElementById(fileNameId);

    input.addEventListener('change', () => {
        const file = input.files[0];
        if (file) {
            fileNameDisplay.textContent = file.name;
        } else {
            fileNameDisplay.textContent = 'No file chosen';
        }
    });

    fileNameDisplay.textContent = 'No file chosen';
}