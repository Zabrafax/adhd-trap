export function initializeDropzone(dropzoneId, fileNameId, variable, variableSliderContainer) {
    const input = document.getElementById(dropzoneId);
    const fileNameDisplay = document.getElementById(fileNameId);

    input.addEventListener('change', () => {
        const file = input.files[0];
        if (file) {
            fileNameDisplay.textContent = file.name;
            variable.value = file;
            if (variableSliderContainer !== null) {
                openSliderContainer(variableSliderContainer);
            }
        } else {
            variable.value = null;
            fileNameDisplay.textContent = 'No file chosen';
            if (variableSliderContainer !== null) {
                hideSliderContainer(variableSliderContainer);
            }
        }
    });

    variable.value = null;
    fileNameDisplay.textContent = 'No file chosen';
    hideSliderContainer(variableSliderContainer);
}

function hideSliderContainer(variableSliderContainer) {
    const height = variableSliderContainer.scrollHeight + 'px';

    variableSliderContainer.style.height = height;

    variableSliderContainer.style.height = '0';
    variableSliderContainer.style.transform = 'scaleY(0)';

    setTimeout(function () {
        variableSliderContainer.style.height = '0';
    }, 500)
}

function openSliderContainer(variableSliderContainer) {
    const height = variableSliderContainer.scrollHeight + 'px';

    variableSliderContainer.style.height = height;
    variableSliderContainer.style.transform = 'scaleY(1)';
}