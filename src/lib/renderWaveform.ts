import * as Tone from 'tone';

const scale = 3;

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

export default function renderWaveform(channel, container) {
    const waveformContainer = document.createElement('div');
    waveformContainer.classList.add('waveform-container');
    const waveformCanvas = document.createElement('canvas');
    waveformCanvas.width = 200;
    waveformCanvas.height = 120;
    waveformCanvas.classList.add('waveform');
    const ctx = waveformCanvas.getContext('2d');
    waveformContainer.appendChild(waveformCanvas);
    container.appendChild(waveformContainer);
    const merge = new Tone.Merge();
    const waveform = new Tone.Waveform();
    channel.connect(merge);
    merge.connect(waveform);
    setInterval(drawWaveform.bind(null, ctx, waveform, waveformCanvas), 50);
}
