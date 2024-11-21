"""
python main.py [Machine's name(Like W1, D2)]        Normal update on status.
python main.py [Machine's name(Like W1, D2)] -N     Means new position, need to recrop the photo.
"""

import sys
import os
import cv2
import cropImg
import detect
from pathlib import Path

def main():
    n = len(sys.argv)
    if n<2:
        raise Exception("Format error: At least one parameter for cv-main.py.")
    if n>3:
        raise Exception("Format error: Cannot have more than two parameters.")
    img_path = sys.argv[1]
    if not (Path(img_path).exists() and Path(img_path).is_file()):
        raise Exception("Invalid image path.")
    if n == 4 and sys.argv[3]!="-N":
        raise Exception("Invalid flag.")
    
    pfold = Path(img_path).parent
    mach_name = pfold.parts[len(pfold.parts)-1]
    lc_path = f"./mach_coord/{mach_name}.txt"
    if n == 2:
        lx = rx = None
        uy = dy = None
        with open(lc_path, "r") as fin:
            info = fin.read().split()
            lx = int(info[0])
            uy = int(info[1])
            rx = int(info[2])
            dy = int(info[3])
        img_obj = cv2.imread(img_path)
        img_obj = img_obj[uy: dy, lx: rx]
        img_obj = cropImg.process_image(img_obj)
        cv2.imwrite("tmp.png", img_obj)
        return detect.detect("tmp.png")
    
    else:       # n==3
        cropImg.crop_and_save(img_path)
        with open("tmp.txt","r") as fin:
            info = fin.read()
        with open(lc_path, "w") as fout:
            fout.write(info)
        return detect.detect("tmp.png")


if __name__=="__main__":
    res=main()
    print(res)
    sys.exit(res)