import * as Tone from 'tone';

export default function mapVoice(voice: any) {
    switch (voice) {
        case 'Synth':
            return Tone.Synth;
        case 'AMSynth':
            return Tone.AMSynth;
        case 'DuoSynth':
            return Tone.DuoSynth;
        case 'FMSynth':
            return Tone.FMSynth;
        case 'MembraneSynth':
            return Tone.MembraneSynth;
        case 'MetalSynth':
            return Tone.MetalSynth;
        case 'MonoSynth':
            return Tone.MonoSynth;
        case 'NoiseSynth':
            return Tone.NoiseSynth;
        case 'PluckSynth':
            return Tone.PluckSynth;
        case 'PolySynth':
            return Tone.PolySynth;
        default:
            return Tone.Synth;
    }
}
