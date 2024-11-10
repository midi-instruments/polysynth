type Instrument = {
    name: string;
    channel: Channel;
    oscillator: Oscillator;
    filters: Filter[];
    envelope: ADSREnvelope;
}

type Channel = {
    volume: number;
    pan: number;
    mute: boolean;
    solo: boolean;
}

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
