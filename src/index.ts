import Ajv from 'ajv';
import defaultConfig from './data/default.json';
import ADSREnvelopeSchema from '../schema/ADSREnvelopeSchema.json';
import FilterSchema from '../schema/FilterSchema.json';
import OscillatorSchema from '../schema/OscillatorSchema.json';
import * as Tone from 'tone';

const ajv = new Ajv();
const validateADSREnvelopeSchema = ajv.compile(ADSREnvelopeSchema);
const validateFilterSchema = ajv.compile(FilterSchema);
const validateOscillatorSchema = ajv.compile(OscillatorSchema);

const transport = Tone.Transport;

window.addEventListener('load', main);

async function main() {
    // const main = document.getElementById('app');
    defaultConfig.instruments.forEach(instrument => {
        const { oscillator, filters, envelope } = instrument;
        if (!validateOscillator(oscillator) || !validateFilters(filters) || !validateEnvelope(envelope)) {
            const errors = {
                    validateADSREnvelopeSchemaErrors: validateADSREnvelopeSchema.errors,
                    validateFilterSchemaErrors: validateFilterSchema.errors,
                    validateOscillatorSchemaErrors: validateOscillatorSchema.errors,
            };
            throw new Error(JSON.stringify(errors));
        }
    });
}

function validateOscillator(oscillator: Oscillator) {
    const valid = validateOscillatorSchema(oscillator);
    return valid;
}

function validateFilters(filters: any[]) {
    const valid = filters.every((filter: Filter) => validateFilterSchema(filter));
    return valid;
}

function validateEnvelope(envelope: ADSREnvelope) {
    const valid = validateADSREnvelopeSchema(envelope);
    return valid;
}
