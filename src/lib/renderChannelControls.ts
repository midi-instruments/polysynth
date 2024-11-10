import { validateChannelSchema } from './utils.ts';
import renderMeter from './renderMeter.ts';
import renderWaveform from './renderWaveform.ts';

export default function renderChannelControls(channel: Channel, instrument, ch, container) {
    const { name } = instrument;
    const controls = document.createElement('div');
    controls.classList.add('channel-controls');
    Object.keys(channel).forEach(key => {
        const prop = validateChannelSchema.schema?.properties?.[key];
        if (prop) {
            const isEnum = Array.isArray(prop.enum);
            const control = document.createElement(isEnum ? 'select' : 'input');
            control.name = `${name}-${key}`;
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
            } else if (prop.type === 'boolean') {
                control.setAttribute('type', 'checkbox');
                control.classList.add('input-switch');
                control.setAttribute('data-diameter', '64');
                label.classList.add('input-switch-label');
            }
            if (isEnum) {
                prop.enum.forEach(option => {
                    const item = document.createElement('option');
                    item.value = option;
                    item.innerText = option;
                    control.appendChild(item);
                });
            }
            if (prop.type === 'boolean') {
                if (channel[key] === 'on') {
                    control.setAttribute('checked', 'checked');
                    ch.set({ [key.split('-')[1]]: true });
                } else {
                    control.removeAttribute('checked');
                    ch.set({ [key.split('-')[1]]: false });
                }
            } else {
                control.value = channel[key];
                ch.set({ [key.split('-')[1]]: channel[key] });
            }
            let prevVolume;
            control.addEventListener('input', event => {
                if (prop.type === 'boolean') {
                    const _key = key.split('-')[1];
                    if (event.target.checked) {
                        prevVolume = Number(ch.volume.value);
                        ch.set({[key.split('-')[1]]: true });
                    } else {
                        ch.set({ 
                            [_key]: _key === 'mute' ? false : true,
                            volume: prevVolume + 0.001,
                        });
                    }
                } else {
                    ch.set({ [key.split('-')[1]]: event.target?.value });
                }
            });
            control.addEventListener('dblclick', event => {
                control.value = prop.default;
                channel[key] = prop.default;
                ch.set({ channel: {[key.split('-')[1]]: prop.default }});
            });
            div.appendChild(label);
            controls.appendChild(div);
        }
    });
    renderWaveform(ch, controls);
    renderMeter(ch, controls);
    container.appendChild(controls);
}
