type Oscillator = {
    type: string;
    frequency: number;
    detune: number;
    phase: number;
}

type Filter = {
    frequency: number;
    type: number;
    rolloff: number;
    q: number;
}

type ADSREnvelope = {
    attack: number;
    decay: number;
    sustain: number;
    release: number;
}
