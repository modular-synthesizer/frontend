class EnvelopeProcessor extends AudioWorkletProcessor {

  // Indicates if the ADSR is currently triggered (in any phase but release)
  triggered = false;

  static get parameterDescriptors() {
    return [
      // The time, in milliseconds, to go from 0% to 100% volume when stroking a key
      { name: "attack", minValue: 0, maxValue: 10000, defaultValue: 100, automationRate: 'k-rate' },
      // The time, in milliseconds, to go from 100% to the sustain volume after the attack phase
      { name: "decay", minValue: 0, maxValue: 10000, defaultValue: 100, automationRate: 'k-rate' },
      // The amount, in percent, of volume sustained during the sustain phase
      { name: "sustain", minValue: 0, maxValue: 100, defaultValue: 70, automationRate: 'k-rate' },
      // The time, in milliseconds, to go from the sustain level to 0% when releasing the key
      { name: "release", minValue: 0, maxValue: 10000, defaultValue: 100, automationRate: 'k-rate' },
      /**
       * The trigger parameter working like that :
       * - when it passes a certain threshold, the AD is triggered
       * - as long as the voltage is hold, the ADSR stays in sustain mode
       * - when the voltage is released, the ADSR goes in release mode
       * */
      { name: "trigger", minValue: 0, maxValue: 10, defaultValue: 0, automationRate: "a-rate"},

      // This creates the values for the output by applying exponential growoth, DO NOT AUTOMATE OR SET ANY VALUE
      { name: "curve", minValue: 0, maxValue: 10, defaultValue: 0, automationRate: "a-rate"},

      // The threshold to trigger the AD phase when the voltage goes UP.
      { name: "thresholdUp", minvalue: 0, maxValue: 10, defaultValue: 9.5, automationRate: 'k-rate' },
      // The threshold under which trigger the R phase when the voltage goes DOWN.
      { name: "thresholdDownp", minvalue: 0, maxValue: 10, defaultValue: 0.5, automationRate: 'k-rate' }
    ];
  }

  process(_inputs, outputs, { attack, decay, sustain, release, curve, trigger, thresholdUp, thresholdDown }) {
    const trig = trigger[0];

    console.log(trig);

    // The ADSR was at rest, and is triggered by a high-enough voltage.
    if (!this.triggered && trig > thresholdUp.value) {
      console.log("TRIGGERED");
      curve.cancelScheduledValues(currentTime);
      curve.exponentialRampToValueAtTime(10, currentTime + attack[0]);
      curve.exponentialRampToValueAtTime(sustain.value, currentTime + decay[0]);
      this.triggered = true;
    }
    // The ADSR was triggered, but is not triggered anymore as voltage went down.
    if (this.triggered && trig < thresholdDown.value) {
      console.log("RELEASED");
      curve.cancelScheduledValues(currentTime);
      curve.exponentialRampToValueAtTime(0, currentTime + release[0]);
      this.triggered = false;
    }
    outputs[0].forEach(channel => {
      for (let i = 0; i < channel.length ; ++i) {
        channel[i] = curve[0];
      }
    });
  }
}

registerProcessor("envelope", EnvelopeProcessor);