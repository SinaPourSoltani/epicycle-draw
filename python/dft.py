import math
from dataclasses import dataclass

@dataclass
class Phasor:
    re: float
    im: float
    freq: int
    phase: float
    amp: float

def dft(xn):
    N = len(xn)
    X = []
    for k in range(-N//2 + 1, N//2):
        re = 0
        im = 0
        for n, x in enumerate(xn):
            phi = (2*math.pi * k * n) / N
            re += x * math.cos(phi)
            im -= x * math.sin(phi)
        
        re /= N
        im /= N
        phase = math.atan2(im, re)
        amp = math.sqrt(re**2 + im**2)

        Xk = Phasor(re, im, k, phase, amp)
        X.append(Xk)
    return X