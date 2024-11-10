import { Note } from 'tonal';
import * as Tone from 'tone';

const mapKeyToNote = {
    a: 'C4',
    s: 'D4',
    d: 'E4',
    f: 'F4',
    g: 'G4',
    h: 'A4',
    j: 'B4',
    k: 'C5',
    l: 'D5',
    w: 'Db4',
    e: 'Db4',
    t: 'Gb4',
    y: 'Ab5',
    u: 'Bb5',
    o: 'Cb4',
};

const playing = {};

export default function renderKeyboard(synths, container) {
    const keyboardContainer = document.createElement('div');
    keyboardContainer.id = 'keyboard-container';
    const keyboard = document.createElement('div');
    keyboard.id = 'keyboard';
    keyboard.addEventListener('mousedown', event => {
        const index = Number((event.target as HTMLElement).dataset.index);
        const note = (event.target as HTMLElement).dataset.note;
        if (!index || !note) {
            return;
        }
        playing[note] = true;
        synths.forEach(synth => {
            synth.triggerAttack(note, Tone.now(), 0.5);
        });
        window.addEventListener('mouseup', () => {
            delete playing[note];
            synths.forEach(synth => {
                synth.triggerRelease(note, Tone.now());
            });
        }, { once: true });
    });
    for (let index = 21; index < 110; index++) {
        const key = document.createElement('div');
        key.classList.add('key');
        key.dataset.index = String(index);
        const note = (key.dataset.note = Note.fromMidi(index));
        if (note.includes('b')) {
            key.classList.add('flat');
        }
        if (note.includes('C') || note.includes('F')) {
            key.classList.add('pad-key-left');
        }
        keyboard.appendChild(key);
    }
    keyboardContainer.appendChild(keyboard);
    // DISABLED
    // container.appendChild(keyboardContainer);
    window.addEventListener('keydown', event => {
        const note = mapKeyToNote[event.key];
        const isPlaying = playing[note];
        const key = document.querySelector(`[data-note="${note}"]`);
        if (key) {
            event.preventDefault();
            key.classList.add('active');
        }
        if (note && !isPlaying) {
            playing[note] = true;
            synths.forEach(synth => {
                synth.triggerAttack(note, Tone.now(), -20);
            });
        }
    });
    window.addEventListener('keyup', event => {
        const note = mapKeyToNote[event.key];
        const key = document.querySelector(`[data-note="${note}"]`);
        if (key) {
            key.classList.remove('active');
        }
        if (note) {
            delete playing[note];
            synths.forEach(synth => {
                synth.triggerRelease(note, Tone.now());
            });
        }
    });
}
