import * as Tone from 'tone';

const scale = 3;

function drawMeter(ctx, meterL, meterR) {
    const valueL = (meterL.getValue() * 100);
    const valueR = (meterR.getValue() * 100);
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    if (valueL > 0) {
        ctx.fillStyle = valueL < 20 ? 'green' : valueL < 70 ? 'orange' : 'red';
        const height = ctx.canvas.height * (valueL / 100) * scale;
        ctx.fillRect(0, ctx.canvas.height - height, (ctx.canvas.width/2) - 0.5, height);
    }
    if (valueR > 0) {
        ctx.fillStyle = valueL < 20 ? 'green' : valueR < 70 ? 'orange' : 'red';
        const height = ctx.canvas.height * (valueR / 100) * scale;
        ctx.fillRect((ctx.canvas.width/2) + 0.5, ctx.canvas.height - height, (ctx.canvas.width/2) - 0.5, height);
    }
}

function drawWaveform(ctx, waveform, canvas) {
    const waveformArray = waveform.getValue();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    let max = 0
    for (let i = 0; i < waveformArray.length; i++) {
        const x = (i / waveformArray.length) * canvas.width;
        const y = (((waveformArray[i] * scale) + 1)/2) * canvas.height;
        max = Math.max(max, waveformArray[i]);
        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    }
    ctx.strokeStyle = max < 0.3 ? 'green' : max < 0.5 ? 'orange' : 'red';
    ctx.stroke();
}

// function drawFFT(ctx: CanvasRenderingContext2D, fft: any, canvas: HTMLCanvasElement): void {
//     const fftArray = fft.getValue();
//     ctx.clearRect(0, 0, canvas.width, canvas.height);
//     ctx.beginPath();
//     let max = 0
//     for (let i = 0; i < fftArray.length; i++) {
//         const x = (i / fftArray.length) * canvas.width;
//         const y = (1 - (fftArray[i] + 140) / 140) * canvas.height; // Adjust for dB range
//         if (i === 0) {
//             ctx.moveTo(x, y);
//         } else {
//             ctx.lineTo(x, y);
//         }
//         max = Math.max(max, fftArray[i]);
//     }
//     ctx.strokeStyle = max < 0.3 ? 'green' : max < 0.5 ? 'orange' : 'red';
//     ctx.stroke();
// }

export default function renderMasterMeter(channel, container) {
    const meterContainer = document.createElement('div');
    meterContainer.classList.add('meter-container');
    meterContainer.classList.add('master-meter-container');
    const meterCanvas = document.createElement('canvas');
    meterCanvas.width = 20;
    meterCanvas.height = 120;
    meterCanvas.classList.add('meter');
    const meterCtx = meterCanvas.getContext('2d');
    const splitter = new Tone.Split();
    // const merger = new Tone.Merge();
    const meterL = new Tone.Meter({ normalRange : true });
    const meterR = new Tone.Meter({ normalRange : true });
    channel.connect(splitter);
    // channel.connect(merger);
    splitter.connect(meterL, 0, 0);
    splitter.connect(meterR, 1, 0);
    const waveform = new Tone.Waveform();
    const waveformContainer = document.createElement('div');
    waveformContainer.classList.add('waveform-container');
    const waveformCanvas = document.createElement('canvas');
    waveformCanvas.width = 200;
    waveformCanvas.height = 120;
    const waveformCtx = waveformCanvas.getContext('2d');
    channel.connect(waveform);
    waveformContainer.appendChild(waveformCanvas);
    // const fft = new Tone.FFT();
    // const fftContainer = document.createElement('div');
    // fftContainer.classList.add('fft-container');
    // const fftCanvas = document.createElement('canvas');
    // fftCanvas.width = 600;
    // fftCanvas.height = 120;
    // const fftCtx = fftCanvas.getContext('2d');
    // channel.connect(fft);
    // fftContainer.appendChild(fftCanvas);
    // meterContainer.appendChild(fftContainer);
    meterContainer.appendChild(waveformContainer);
    meterContainer.appendChild(meterCanvas);
    container.appendChild(meterContainer);
    setInterval(drawMeter.bind(null, meterCtx, meterL, meterR), 50);
    setInterval(drawMeter.bind(null, meterCtx, meterL, meterR), 50);
    // setInterval(drawFFT.bind(null, fftCtx, fft, fftCanvas), 100);
    setInterval(drawWaveform.bind(null, waveformCtx, waveform, waveformCanvas), 100);
}
