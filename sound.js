(function () {
    const STORAGE_KEY = 'urban-waste-sound-enabled';
    const MASTER_VOLUME = 2.5;
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    let enabled = true;
    let audioContext = null;

    function initialize() {
        try {
            enabled = window.localStorage.getItem(STORAGE_KEY) !== 'false';
        } catch (error) {
            enabled = true;
        }
    }

    function isEnabled() {
        return enabled;
    }

    function setEnabled(nextEnabled) {
        enabled = Boolean(nextEnabled);
        try {
            window.localStorage.setItem(STORAGE_KEY, String(enabled));
        } catch (error) {
            // Storage can be unavailable for local files or strict privacy settings.
        }
    }

    function getAudioContext() {
        if (!AudioContextClass) return null;
        if (!audioContext) audioContext = new AudioContextClass();
        if (audioContext.state === 'suspended') audioContext.resume().catch(() => {});
        return audioContext;
    }

    function tone(context, startTime, frequency, duration, options = {}) {
        const oscillator = context.createOscillator();
        const gain = context.createGain();
        const volume = Math.min(0.09, (options.volume ?? 0.025) * MASTER_VOLUME);
        const endFrequency = options.endFrequency ?? frequency;

        oscillator.type = options.type || 'sine';
        oscillator.frequency.setValueAtTime(frequency, startTime);
        oscillator.frequency.exponentialRampToValueAtTime(Math.max(1, endFrequency), startTime + duration);
        gain.gain.setValueAtTime(0.0001, startTime);
        gain.gain.exponentialRampToValueAtTime(volume, startTime + Math.min(0.012, duration * 0.25));
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

        oscillator.connect(gain);
        gain.connect(context.destination);
        oscillator.start(startTime);
        oscillator.stop(startTime + duration + 0.01);
    }

    function play(effect = 'click') {
        if (!enabled || document.visibilityState === 'hidden') return;

        try {
            const context = getAudioContext();
            if (!context) return;
            const now = context.currentTime + 0.008;

            switch (effect) {
                case 'select':
                    tone(context, now, 460, 0.07, { type: 'triangle', volume: 0.022, endFrequency: 520 });
                    tone(context, now + 0.055, 690, 0.09, { type: 'sine', volume: 0.018, endFrequency: 760 });
                    break;
                case 'start':
                    tone(context, now, 300, 0.1, { type: 'triangle', volume: 0.026, endFrequency: 390 });
                    tone(context, now + 0.075, 440, 0.11, { type: 'triangle', volume: 0.025, endFrequency: 540 });
                    tone(context, now + 0.15, 620, 0.16, { type: 'sine', volume: 0.023, endFrequency: 820 });
                    break;
                case 'generate':
                    tone(context, now, 210, 0.08, { type: 'square', volume: 0.012, endFrequency: 260 });
                    tone(context, now + 0.07, 310, 0.08, { type: 'square', volume: 0.012, endFrequency: 390 });
                    tone(context, now + 0.14, 470, 0.1, { type: 'triangle', volume: 0.022, endFrequency: 590 });
                    tone(context, now + 0.22, 710, 0.15, { type: 'sine', volume: 0.021, endFrequency: 880 });
                    break;
                case 'download':
                    tone(context, now, 560, 0.1, { type: 'triangle', volume: 0.021, endFrequency: 690 });
                    tone(context, now + 0.08, 840, 0.16, { type: 'sine', volume: 0.022, endFrequency: 980 });
                    break;
                case 'close':
                    tone(context, now, 380, 0.09, { type: 'triangle', volume: 0.018, endFrequency: 250 });
                    break;
                case 'open':
                    tone(context, now, 360, 0.075, { type: 'triangle', volume: 0.018, endFrequency: 460 });
                    tone(context, now + 0.05, 580, 0.1, { type: 'sine', volume: 0.017, endFrequency: 680 });
                    break;
                case 'toggleOn':
                    tone(context, now, 520, 0.07, { type: 'sine', volume: 0.02, endFrequency: 620 });
                    tone(context, now + 0.055, 760, 0.1, { type: 'sine', volume: 0.018, endFrequency: 820 });
                    break;
                case 'toggleOff':
                    tone(context, now, 560, 0.075, { type: 'triangle', volume: 0.019, endFrequency: 430 });
                    tone(context, now + 0.045, 330, 0.1, { type: 'sine', volume: 0.015, endFrequency: 250 });
                    break;
                case 'random':
                    tone(context, now, 360, 0.055, { type: 'square', volume: 0.009, endFrequency: 520 });
                    tone(context, now + 0.045, 620, 0.055, { type: 'square', volume: 0.009, endFrequency: 430 });
                    tone(context, now + 0.09, 510, 0.1, { type: 'triangle', volume: 0.019, endFrequency: 720 });
                    break;
                case 'apply':
                    tone(context, now, 440, 0.08, { type: 'triangle', volume: 0.019, endFrequency: 540 });
                    tone(context, now + 0.06, 660, 0.09, { type: 'triangle', volume: 0.019, endFrequency: 760 });
                    tone(context, now + 0.12, 880, 0.14, { type: 'sine', volume: 0.018, endFrequency: 980 });
                    break;
                case 'rebuild':
                    tone(context, now, 180, 0.08, { type: 'square', volume: 0.012, endFrequency: 220 });
                    tone(context, now + 0.07, 260, 0.09, { type: 'square', volume: 0.011, endFrequency: 330 });
                    tone(context, now + 0.14, 420, 0.14, { type: 'triangle', volume: 0.02, endFrequency: 620 });
                    break;
                case 'themeLight':
                    tone(context, now, 620, 0.1, { type: 'sine', volume: 0.018, endFrequency: 820 });
                    tone(context, now + 0.065, 940, 0.14, { type: 'sine', volume: 0.016, endFrequency: 1180 });
                    break;
                case 'themeDark':
                    tone(context, now, 620, 0.1, { type: 'triangle', volume: 0.018, endFrequency: 440 });
                    tone(context, now + 0.06, 350, 0.14, { type: 'sine', volume: 0.016, endFrequency: 240 });
                    break;
                case 'adjust':
                    tone(context, now, 620, 0.04, { type: 'triangle', volume: 0.012, endFrequency: 650 });
                    break;
                default:
                    tone(context, now, 430, 0.055, { type: 'triangle', volume: 0.016, endFrequency: 510 });
            }
        } catch (error) {
            // Sound effects are optional; interaction should continue if audio is unavailable.
        }
    }

    window.AppSound = { initialize, isEnabled, setEnabled, play };
})();
