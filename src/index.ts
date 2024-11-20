import defaultConfig from './data/default.json';
import { validateInstruments } from './lib/utils.ts';
import initMidiDevices from './lib/midi-devices.ts';
import querystringToForm from './lib/querystring-to-form.ts';
import * as Tone from 'tone';
import renderOscillatorControls from './lib/renderOscillatorControls.ts';
import renderFiltersControls from './lib/renderFiltersControls.ts';
import renderEnvelopeControls from './lib/renderEnvelopeControls.ts';
import renderChannelControls from './lib/renderChannelControls.ts';
import renderKeyboard from './lib/renderKeyboard.ts';
import renderMasterChannel from './lib/renderMasterChannel.ts';
import {
    OmniOscillatorSynthOptions,
    OmniOscillatorType,
} from 'tone/Tone/source/oscillator/OscillatorInterface.js';

declare global {
    interface Window {
        instruments: any;
    }
}

window.instruments = {};

async function main() {
    const { instruments } = defaultConfig;
    validateInstruments(instruments);
    const synths: any[] = [];
    const masterChannel = new Tone.Channel({ channelCount: 2 }).toDestination();
    renderMasterChannel(masterChannel, document.getElementById('app'));
    instruments.forEach(instrument => {
        const { name, channel, oscillator, envelope, filters } = instrument;
        const { 'channel-volume': volume, 'channel-pan': pan, 'channel-mute': mute } = channel;
        const synth = new Tone.PolySynth(Tone.Synth);
        const {
            'oscillator-type': type,
            'oscillator-phase': phase,
            'oscillator-modulationIndex': modulationIndex,
            'oscillator-harmonicity': harmonicity,
        } = oscillator;
        const {
            'envelope-attack': attack,
            'envelope-decay': decay,
            'envelope-sustain': sustain,
            'envelope-release': release,
        } = envelope;
        console.log(type as OmniOscillatorType)
        synth.set({
            oscillator: {
                type: type as OmniOscillatorType,
                phase: phase || 0,
                modulationIndex: modulationIndex || 3,
                harmonicity: harmonicity || 1,
            } as OmniOscillatorSynthOptions,
            envelope: {
                attack: attack || 0.7,
                decay: decay || 0.1,
                sustain: sustain || 0.3,
                release: release || 1,
            } ,
        });
        synths.push(synth);
        const ch = new Tone.Channel({ channelCount: 2 });
        ch.connect(masterChannel);
        ch.set({ volume, pan, mute });
        const container = document.createElement('div');
        container.classList.add('instrument');
        const title = document.createElement('h2');
        title.textContent = name.split('-')[1].toUpperCase();
        const instrumentContainer = document.createElement('div'); 
        instrumentContainer.classList.add('instrument-container');
        instrumentContainer.appendChild(title);
        window.instruments[name] = { name, synth, channel: ch };
        renderOscillatorControls(oscillator, window.instruments[name], container);
        renderFiltersControls(window.instruments[name], filters, container);
        synth.chain(...window.instruments[name].filters, ch);
        renderEnvelopeControls(envelope, window.instruments[name], container);
        renderChannelControls(channel, window.instruments[name], ch, container);
        instrumentContainer.appendChild(container);
        document.forms[0].appendChild(instrumentContainer);

    });
    renderKeyboard(synths, document.body);
    const submitButton = document.createElement('input');
    submitButton.type = 'submit';
    const resetButton = document.createElement('input');
    resetButton.type = 'reset';
    document.forms[0].appendChild(resetButton);
    document.forms[0].appendChild(submitButton);
    querystringToForm();
    await initMidiDevices(synths);
    // Tone.getTransport().start();
}

window.addEventListener('DOMContentLoaded', main);
