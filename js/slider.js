export class Slider {
    slider;
    input;
    defaultValue;

    variable;

    minValue;
    maxValue;

    constructor(sliderId, inputId, variable, defaultValue, minValue, maxValue) {
        this.slider = document.getElementById(sliderId);
        this.input = document.getElementById(inputId);
        this.defaultValue = defaultValue;

        this.variable = variable;
        this.variable.value = defaultValue;

        this.minValue = minValue;
        this.maxValue = maxValue;

        this.input.min = minValue;
        this.input.max = maxValue;
        this.input.value = defaultValue;

        this.slider.addEventListener('input', () => {
            this.input.value = this.slider.value;
            this.variable.value = parseInt(this.slider.value);
        });

        this.input.addEventListener('input', () => {
            this.inputChange(this.input, this.slider, this.variable);
        });

        this.input.addEventListener('blur', () => {
            if (this.input.value.trim() === "") {
                this.input.value = this.defaultValue;
                this.slider.value = this.input.value;
                this.variable.value = parseInt(this.slider.value);
            } else {
                this.inputChange(this.input, this.slider, this.variable);
            }
        });

        this.input.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                if (this.input.value.trim() === "") {
                    this.input.value = this.defaultValue;
                    this.slider.value = this.input.value;
                    this.variable.value = parseInt(this.slider.value);
                } else {
                    this.inputChange(this.input, this.slider, this.variable);
                }
            }
        });
    }

    inputChange() {
        if (this.input.value >= this.minValue && this.input.value <= this.maxValue) {
            this.slider.value = this.input.value;
            this.variable.value = this.input.value;
        } else if (!(this.input.value.trim() === "")) {
            this.input.value = this.input.value < this.minValue ? this.minValue : this.maxValue;
            this.slider.value = this.input.value;
            this.variable.value = this.input.value;
        }
    }
}