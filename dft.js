class Phasor {
  constructor(re, im, freq, phase, amp) {
    this.re = re;
    this.im = im;
    this.freq = freq;
    this.phase = phase;
    this.amp = amp;
  }
}

// dft function
function dft(xn) {
  const N = xn.length;
  const X = [];
  for (let k = -N / 2 + 1; k < N / 2; k++) {
    let re = 0;
    let im = 0;
    for (let n = 0; n < N; n++) {
      const x = xn[n];
      const phi = (2 * Math.PI * k * n) / N;
      re += x * Math.cos(phi);
      im -= x * Math.sin(phi);
    }
    re /= N;
    im /= N;
    const phase = Math.atan2(im, re);
    const amp = Math.sqrt(re ** 2 + im ** 2);
    const Xk = new Phasor(re, im, k, phase, amp);
    X.push(Xk);
  }
  return X;
}

