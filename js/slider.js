function initSlider(sliderId, inputId) {
    const slider = document.getElementById(sliderId);
    const input = document.getElementById(inputId);
    const defaultValue = slider.value;

    input.min = slider.min;
    input.max = slider.max;
    input.step = slider.step;
    input.value = slider.value;

    slider.addEventListener('input', () => {
        input.value = slider.value;
    });

    input.addEventListener('input', () => {
        inputChange(input, slider);
    });

    input.addEventListener('blur', () => {
        if (input.value.trim() === "") {
            input.value = defaultValue;
            slider.value = input.value;
        } else {
            inputChange(input, slider);
        }
    });

    input.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            if (input.value.trim() === "") {
                input.value = defaultValue;
                slider.value = input.value;
            } else {
                inputChange(input, slider);
            }
        }
    });
}

function inputChange(input, slider) {
    const minValue = parseInt(slider.min);
    const maxValue = parseInt(slider.max);

    let inputValue = parseInt(input.value);
    if (isNaN(inputValue)) {
        inputValue = (minValue + maxValue) / 2; // Если не число, ставим среднее
    }

    inputValue = Math.max(minValue, Math.min(inputValue, maxValue)); // Ограничиваем диапазоном

    slider.value = inputValue;
    input.value = inputValue;
}