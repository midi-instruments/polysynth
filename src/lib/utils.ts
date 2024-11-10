import Ajv from 'ajv';
import ADSREnvelopeSchema from '../../schema/ADSREnvelopeSchema.json';
import FilterSchema from '../../schema/FilterSchema.json';
import OscillatorSchema from '../../schema/OscillatorSchema.json';
import ChannelSchema from '../../schema/ChannelSchema.json';

const ajv = new Ajv();

export const validateADSREnvelopeSchema = ajv.compile(ADSREnvelopeSchema);
export const validateFilterSchema = ajv.compile(FilterSchema);
export const validateOscillatorSchema = ajv.compile(OscillatorSchema);
export const validateChannelSchema = ajv.compile(ChannelSchema);

export function validateInstruments(instruments) {
    instruments.forEach((instrument: Instrument) => {
        validateInstrument(instrument);
    });
}

export function validateInstrument(instrument: Instrument) {
    const { channel, oscillator, filters, envelope } = instrument;
    if (!validateOscillator(oscillator) || !validateFilters(filters) || !validateEnvelope(envelope) || !validateChannel(channel)) {
        const errors = {
                validateADSREnvelopeSchemaErrors: validateADSREnvelopeSchema.errors,
                validateFilterSchemaErrors: validateFilterSchema.errors,
                validateOscillatorSchemaErrors: validateOscillatorSchema.errors,
                validateChannelErrors: validateChannelSchema.errors
        };
        throw new Error(JSON.stringify(errors));
    }
}

export function validateOscillator(oscillator: Oscillator) {
    const valid = validateOscillatorSchema(oscillator);
    return valid;
}

export function validateFilters(filters: any[]) {
    const valid = filters.every((filter: Filter) => validateFilterSchema(filter));
    return valid;
}

export function validateEnvelope(envelope: ADSREnvelope) {
    const valid = validateADSREnvelopeSchema(envelope);
    return valid;
}

export function validateChannel(channel: Channel) {
    const valid = validateChannelSchema(channel);
    return valid;
}
