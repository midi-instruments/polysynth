import { validateOscillatorSchema } from '../lib/utils.ts';

export default function renderOscillatorControls(oscillator: Oscillator, synth, container){
    const controls = document.createElement('div');
    controls.classList.add('oscillator-controls');
    Object.keys(oscillator).forEach((key) => {
        const prop = validateOscillatorSchema.schema?.properties?.[key];
        if (prop) {
            const isEnum = Array.isArray(prop.enum);
            const control = document.createElement(isEnum ? 'select' : 'input');
            control.id = `${synth.name}-${key}`;
            control.name = control.id;
            const label = document.createElement('label');
            label.innerText = key.split('-')[1];
            label.htmlFor = control.id;
            const div = document.createElement('div');
            div.classList.add('control-container');
            if (prop.type === 'number') {
                control.setAttribute('type', 'range');
                control.setAttribute('min', prop.minimum);
                control.setAttribute('max', prop.maximum);
                control.setAttribute('step', prop.multipleOf);
                control.classList.add('input-knob');
            }
            if (isEnum) {
                prop.enum.forEach((option) => {
                    const item = document.createElement('option');
                    item.value = option;
                    item.innerText = option;
                    control.appendChild(item);
                });
                control.classList.add('input-select');
                label.classList.add('input-select-label');
                control.addEventListener('keydown', (event) => {
                    event.preventDefault();
                });
            } else {
                label.classList.add('input-knob-label');
            }
            control.value = oscillator[key];
            synth.set({ oscillator: { [key]: oscillator[key] }});
            const onInput = (event) => {
                const _key = key.split('-')[1];
                synth.set({ oscillator: { [_key]: event.target?.value }});
            }
            control.addEventListener('input', onInput);
            control.addEventListener('change', onInput);
;
            control.addEventListener('dblclick', (event) => {
                control.value = prop.default;
                const _key = key.split('-')[1];
                synth.set({ oscillator: { [_key]: prop.default }});
            });
            div.appendChild(control);
            div.appendChild(label);
            controls.appendChild(div);
        }
    });
    container.appendChild(controls);
}
