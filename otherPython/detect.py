import os
import sys
from simpleimage import SimpleImage


def detect(path):

    img = SimpleImage(path)

    x = 0
    for i in range(img.width//4):
        for j in range(img.height):
            pix = img.get_pixel(i,j)
            avg = (pix.red+pix.green+pix.blue)//3
            x +=avg
    x/= (img.width//4) * img.height
    print(x)
    if x>=235:
        return False        # working, not available.
    else:
        return True         # not working, available.
