import tkinter as tk
from math import *
from dataclasses import dataclass
from collections import deque
from dft import dft, Phasor

@dataclass
class UI:
    circle: int
    stroke: int

@dataclass
class Point:
    x: int
    y: int

    def split(self):
        return self.x, self.y

class Circle:
    def __init__(self, parent, child, generation, omega, phase, rotation, c, r):
        self.parent: Circle = parent
        self.child: Circle = child
        self.generation = generation
        self.omega = omega
        self.phase = phase
        self.rotation = rotation
        self.c: Point = c
        self.r = r
        self.vector: Point = Point(r, 0)

        self.ui = UI(0,0)

    def __lt__(self, other):
        return self.r < other.r


def sort_circles(ancestor: Circle):
    circles: 'list[Circle]' = []
    c = ancestor
    while c.child is not None:
        circles.append(c)
        c = c.child

    # Sorts based on amp    
    circles.sort(reverse=True)

    # Set new ancestry tree
    for i, c in enumerate(circles):
        # Set parent
        if i == 0:
            c.parent = None
        else:
            c.parent = circles[i-1]
        # Set child
        if i < len(circles) - 1:
            c.child = circles[i+1]
        else:
            c.child = None 
    
    global okeanos
    okeanos = circles[0]

def draw_circle(c: Circle):
    def create_tk_circle(x, y, r, canvasName):
        x0 = x - r
        y0 = y - r
        x1 = x + r
        y1 = y + r
        return canvasName.create_oval(x0, y0, x1, y1), canvasName.create_line(x,y, x, y-r)
    c.ui.circle, c.ui.stroke = create_tk_circle(*c.c.split(), c.r, canvas)

def update_circle(c: Circle):
    c.omega = epicycles[c.generation].freq
    c.r = epicycles[c.generation].amp
    c.phase = epicycles[c.generation].phase
    c.rotation = c.omega * t + c.phase + pi / 2
    c.vector = Point(c.c.x + c.r * cos(c.rotation), c.c.y - c.r * sin(c.rotation))
    canvas.coords(c.ui.stroke, c.c.x, c.c.y, *c.vector.split())
    origin = c.parent.vector if c.parent else start_point
    canvas.coords(c.ui.circle, origin.x - c.r, origin.y - c.r, origin.x + c.r, origin.y + c.r)

    if c.child is None:
        return
    else:
        c.child.c = c.vector
        return update_circle(c.child)

def update_wave():
    global wave
    global wave_ui
    if len(wave) < 4:
        return
    while len(wave) > 400:
        wave.pop()
    wavex = [(wave[i//2] if i % 2 else i+600) for i in range(0,len(wave)*2)]
    canvas.delete(wave_ui)
    wave_ui = canvas.create_line(list(wavex), fill='white')


def breed(ancestor: Circle, descendants):
    draw_circle(ancestor)
    if descendants <= 0:
        return
    ancestor.child = Circle(ancestor, None, ancestor.generation+1, 1, 0, 0, ancestor.vector, ancestor.r * 0.7)
    return breed(ancestor.child, descendants-1)

def get_end_point(c: Circle):
    if c.child is None:
        return c.vector
    else:
        return get_end_point(c.child)

def update():
    global t, okeanos, wave
    t += dt * 0.1
    update_circle(okeanos)
    end_point = get_end_point(okeanos)
    #wave.appendleft(end_point.x)
    wave.appendleft(end_point.y)
    update_wave()
    root.after(15, update)

if __name__ == '__main__':
    # Global variables
    wave = deque()
    wave_ui = -1
    start_point = Point(200,400)
    signal = [100] * 15 + [-100] * 15

    t = 0
    dt = 2*pi / len(signal)

    # Discrete fourier transform
    epicycles = dft(signal)

    root = tk.Tk()
    h, w = 800, 1200
    canvas = tk.Canvas(root, height=h, width=w)
    # TODO you probably need to change the geometry to make the window appear on screen
    root.geometry('%sx%s+%s+%s'%(w,h,0,-2000))
    canvas.grid(row=0, column=0, sticky='w')

    okeanos = Circle(None, None, 0, 0, 0, 0, start_point, 50)
    breed(okeanos, len(epicycles)-1)

    update()
    #sort_circles(okeanos) # does not work 100%
    root.mainloop()

"""
TODO:

Dial to change number of epicycles
Make it draw in 2 dimensions
Load SVG as signal to DFT
Prettify

"""