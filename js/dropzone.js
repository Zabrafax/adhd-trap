export function initializeDropzone(dropzoneId, fileNameId, variable, durationSliderContainer) {
    const input = document.getElementById(dropzoneId);
    const fileNameDisplay = document.getElementById(fileNameId);

    input.addEventListener('change', () => {
        const file = input.files[0];
        if (file) {
            fileNameDisplay.textContent = file.name;
            variable.value = file;
            if (durationSliderContainer !== null) {
                openSliderContainer(durationSliderContainer);
            }
        } else {
            variable.value = null;
            fileNameDisplay.textContent = 'No file chosen';
            if (durationSliderContainer !== null) {
                hideSliderContainer(durationSliderContainer);
            }
        }
    });

    variable.value = null;
    fileNameDisplay.textContent = 'No file chosen';
    hideSliderContainer(durationSliderContainer);
}

function hideSliderContainer(sliderContainer) {
    const height = sliderContainer.scrollHeight + 'px';

    sliderContainer.style.height = height;

    sliderContainer.style.height = '0';
    sliderContainer.style.transform = 'scaleY(0)';

    setTimeout(function () {
        sliderContainer.style.height = '0';
    }, 500)
}

function openSliderContainer(sliderContainer) {
    const height = sliderContainer.scrollHeight + 'px';

    sliderContainer.style.height = height;
    sliderContainer.style.transform = 'scaleY(1)';
}