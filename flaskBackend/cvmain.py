"""
python main.py [FOLDER]
"""

import sys
import os
import cv2
from pathlib import Path
import json

def cropandsaveandprocess(img_path, lx, ty, rx, by):
    img = cv2.imread(str(img_path))
    print(7)
    grayimg = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    invtimg = cv2.bitwise_not(grayimg)
    _, thresholdedimg = cv2.threshold(invtimg, 100, 255, cv2.THRESH_BINARY)
    tmp = thresholdedimg[ty:by, lx:rx]
    cv2.imwrite("tmp.jpg", tmp)

    sum = 0.0
    H = by-ty
    W = rx-lx
    for i in range(ty, ty+H//4):
        for j in range(lx, rx):
            sum += thresholdedimg[i,j]/(H//4)/(rx-lx)
    
    print("###", sum)
    if sum >= 235:
        return False
    else:
        return True

def checkFinished(pfold_str: str):
    pfold = Path(pfold_str)
    mach_name = pfold.parts[ len(pfold.parts)-1 ]
    print(3)
    img_path = None
    json_path = None
    for it in pfold.iterdir():
        print("** ",it, it.suffix)
        if it.suffix == '.jpg' or it.suffix == '.png':
            img_path = it
        elif it.suffix == '.json':
            json_path = it
    print(4)
    coord_path = Path(f"./uploads/{mach_name}.txt")

    print(coord_path, json_path, img_path)

    with json_path.open() as fin:
        json_text = fin.read()
        json_dic = json.loads(json_text)
        print(6)
        lx = int(json_dic['coordinates'][0]['x'])
        rx = int(json_dic['coordinates'][1]['x'])
        ty = int(json_dic['coordinates'][0]['y'])
        by = int(json_dic['coordinates'][1]['y'])
    print(5)
    ans = cropandsaveandprocess(img_path, lx, ty, rx, by)
    return ans

