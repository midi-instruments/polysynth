import { Note } from 'tonal';
import * as Tone from 'tone';

const pedals = {
    right: false,
    middle: false,
    left: false,
}

export default async function initMidiDevices(synths) {
    const access = await navigator.requestMIDIAccess();
    const inputs = access.inputs;
    const context = Tone.getContext();
    for (let input of inputs.values()) {
        input.addEventListener('midimessage', event => {
            if (event.data) {
                const [command, note, velocity] = event.data;
                const midiNote = Note.fromMidi(note);
                if (command === 144) {
                    synths.forEach(synth => {
                        synth.triggerAttack(midiNote, context.currentTime, velocity);
                    });
                } else if (command === 128) {
                    synths.forEach(synth => {
                        synth.triggerRelease(midiNote, context.currentTime);
                    });
                } else if (command === 176 || command === 244) {
                    processSystemMessage(synths, command, note, midiNote, context, velocity);
                }
            }
        });
    }
}

function isCustomControlChangeMessage(note) {
    return note === 3 || 
        note === 9 ||
        note === 14 || note === 15 ||
        note >= 20 && note <= 31 ||
        note >= 85 && note <= 87 ||
        note >= 89 && note <= 90 ||
        note >= 102 && note <= 119;
}

function processSystemMessage(synths, command, note, midiNote, context, velocity) {
    if (command === 176 && note === 1) {
        console.log('control: modulation wheel', velocity);
    } else if (command === 176 && note === 7) {
        console.log('control: volume');
    } else if (command === 176 && note === 38) {
        console.log('control: rate/time', velocity);
    } else if (command === 244) {
        console.log('control: pitch', note);
    } else if (command === 176 && note === 67) {
        if (velocity > 63) {
            pedals.left = true;
        } else {
            pedals.left = false;
        }
        console.log('control change left pedal', pedals.left);
    } else if (command === 176 && note === 66) {
        if (velocity > 63) {
            pedals.middle = true;
        } else {
            pedals.middle = false;
        }
        console.log('control change middle pedal', pedals.middle);
    } else if (command === 176 && note === 64) {
        if (velocity > 63) {
            pedals.right = true;
        } else {
            pedals.right = false;
        }
        console.log('control change right pedal', pedals.right);
    }
}
