import * as Tone from 'tone';
import { validateFilterSchema } from './utils.ts';

export default function renderFiltersControls(instrument, filters: Filter[], container){
    const { name, } = instrument
    const controlGroup: HTMLDivElement[] = [];
    instrument.filters = [];
    filters.forEach(filter => {    
        const controls = document.createElement('div');
        controls.classList.add('filter-controls');
        const _filter = new Tone.Filter();
        instrument.filters.push(_filter);
        Object.keys(filter).forEach((key) => {
            const prop = validateFilterSchema.schema?.properties?.[key];
            if (prop) {
                Object.keys(filter).forEach((key) => {
                    _filter.set({[key.split('-')[1]]: filter[key]});
                });
                const isEnum = Array.isArray(prop.enum);
                const control = document.createElement(isEnum ? 'select' : 'input');
                control.name = `${name}-${key}`;
                control.title = key;
                const label = document.createElement('label');
                label.innerText = key.split('-')[1];
                label.appendChild(control);
                const div = document.createElement('div');
                div.classList.add('control-container');
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
                    control.classList.add('input-select');
                    label.classList.add('input-select-label');
                }
                control.value = filter[key];
                const onInput = (event) => {
                    _filter.set({ [key.split('-')[1]]: event.target?.value });
                }
                control.addEventListener('input', onInput);
                control.addEventListener('change', onInput);
                control.addEventListener('dblclick', (event) => {
                    control.value = prop.default;
                    _filter.set({ [key]: prop.default });
                });
                div.appendChild(label);
                controls.appendChild(div);
            }
        });
        controlGroup.push(controls);
    });
    controlGroup.forEach((controls) => {
        container.appendChild(controls);
    });
}
