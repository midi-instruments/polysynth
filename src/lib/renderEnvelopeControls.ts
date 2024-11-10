import { validateADSREnvelopeSchema } from './utils.ts';

export default function renderEnvelopeControls(envelope: ADSREnvelope, synth, container) {
    const controls = document.createElement('div');
    controls.classList.add('envelope-controls');
    Object.keys(envelope).forEach((key) => {
        const prop = validateADSREnvelopeSchema.schema?.properties?.[key];
        if (prop) {
            const isEnum = Array.isArray(prop.enum);
            const control = document.createElement(isEnum ? 'select' : 'input');
            control.id = `${synth.name}-${key}`;
            control.name = control.id;
            const div = document.createElement('div');
            div.classList.add('control-container');
            const label = document.createElement('label');
            label.innerText = key.split('-')[1];
            label.htmlFor = control.id;
            if (prop.type === 'number') {
                control.setAttribute('type', 'range');
                control.setAttribute('min', prop.minimum);
                control.setAttribute('max', prop.maximum);
                control.setAttribute('step', prop.multipleOf);
                control.classList.add('input-knob');
                label.classList.add('input-knob-label');
            }
            if (isEnum) {
                prop.enum.forEach((option) => {
                    const item = document.createElement('option');
                    item.value = option;
                    item.innerText = option;
                    control.appendChild(item);
                });
                label.classList.add('input-select-label');
            }
            control.value = envelope[key];
            ['input', 'change'].forEach(function (e) {

            });
            const onInput = (event) => {
                const _key = key.split('-')[1];
                synth.set({ envelope: { [_key]: event.target?.value }});
            };
            control.addEventListener('input', onInput);
            control.addEventListener('change', onInput); 
            control.addEventListener('dblclick', (event) => {
                control.value = prop.default;
                const _key = key.split('-')[1];
                synth.set({ envelope: { [_key]: prop.default }});
            });
            div.appendChild(control);
            div.appendChild(label);
            controls.appendChild(div);
        }
    });
    container.appendChild(controls);
}
