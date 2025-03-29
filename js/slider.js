function initializeSlider(sliderId, inputId, variable) {
    const slider = document.getElementById(sliderId);
    const input = document.getElementById(inputId);
    const defaultValue = slider.value;

    variable.value = parseInt(defaultValue);

    input.min = slider.min;
    input.max = slider.max;
    input.step = slider.step;
    input.value = slider.value;

    slider.addEventListener('input', () => {
        input.value = slider.value;
        variable.value = parseInt(slider.value);
    });

    input.addEventListener('input', () => {
        inputChange(input, slider, variable);
    });

    input.addEventListener('blur', () => {
        if (input.value.trim() === "") {
            input.value = defaultValue;
            slider.value = input.value;
            variable.value = parseInt(slider.value);
        } else {
            inputChange(input, slider, variable);
        }
    });

    input.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            if (input.value.trim() === "") {
                input.value = defaultValue;
                slider.value = input.value;
                variable.value = parseInt(slider.value);
            } else {
                inputChange(input, slider, variable);
            }
        }
    });
}

function inputChange(input, slider, variable) {
    const minValue = parseInt(slider.min);
    const maxValue = parseInt(slider.max);

    if (input.value >= minValue && input.value <= maxValue) {
        slider.value = input.value;
        variable.value = input.value;
    } else if (!(input.value.trim() === "")) {
        input.value = input.value < minValue ? minValue : maxValue;
        slider.value = input.value;
        variable.value = input.value;
    }
}

export { initializeSlider };