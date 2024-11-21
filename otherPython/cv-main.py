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
    grayimg = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    invtimg = cv2.bitwise_not(grayimg)
    _, thresholdedimg = cv2.threshold(invtimg, 50, 255, cv2.THRESH_BINARY)
    
    tmp = thresholdedimg[ty:by, lx:rx]
    cv2.imwrite("tmp.jpg", tmp)

    sum = 0
    H = by-ty
    W = rx-lx
    for i in range(ty, ty+H//4):
        for j in range(lx, rx):
            print(thresholdedimg[i,j])
            sum += thresholdedimg[i,j]
    sum/=(H//4)*(rx-lx)
    if sum >= 235:
        return False
    else:
        return True

def main(pfold_str: str, if_new_pos = False):
    pfold = Path(pfold_str)
    mach_name = pfold.parts[ len(pfold.parts)-1 ]

    img_path = None
    json_path = None
    for it in pfold.iterdir():
        print("** ",it, it.suffix)
        if it.suffix == '.jpg' or it.suffix == '.png':
            img_path = it
        else:
            json_path = it
    
    coord_path = Path(f"./mach-coord/{mach_name}.txt")

    print(coord_path, json_path, img_path)

    if if_new_pos == False:
        with coord_path.open() as fin:
            info = [int(x) for x in fin.read().split()]
        lx = info[0]
        ty = info[1]
        rx = info[2]
        by = info[3]
        ans = cropandsaveandprocess(img_path, lx, ty, rx, by)
    else:
        with json_path.open() as fin:
            json_text = fin.read()
        json_dic = json.loads(json_text)
        lx = int(json_dic['coordinates'][0]['x'])
        rx = int(json_dic['coordinates'][1]['x'])
        ty = int(json_dic['coordinates'][0]['y'])
        by = int(json_dic['coordinates'][1]['y'])
        if coord_path.exists() == False:
            coord_path.touch()
        with coord_path.open("w") as fout:
            fout.write(f"{lx} {ty} {rx} {by}")
        ans = cropandsaveandprocess(img_path, lx, ty, rx, by)
    return ans


if __name__=="__main__":
    print(main("../W1", if_new_pos=True))