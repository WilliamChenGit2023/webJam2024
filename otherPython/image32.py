from simpleimage import SimpleImage

def grayscale(image: SimpleImage):
    image = image.copy()
    for x in range(image.width):
        for y in range(image.height):
            pix = image.get_pixel(x, y)
            avg = (pix.red+ pix.green+ pix.blue)//3
            image.set_rgb(x, y, avg, avg, avg)
    return image

def sepia(image: SimpleImage):
    image = image.copy()
    for x in range(image.width):
        for y in range(image.height):
            pix = image.get_pixel(x,y)
            r = int(pix.red*0.393+ pix.green*0.769+ pix.blue*0.189)
            g = int(pix.red*0.349+ pix.green*0.686+ pix.blue*0.168)
            b = int(pix.red*0.272+ pix.green*0.534+ pix.blue*0.131)
            image.set_rgb(x,y,r,g,b)
    return image

def shrink(image: SimpleImage, scale: int):
    _img = SimpleImage.blank(image.width//scale, image.height//scale)
    for x in range(_img.width):
        for y in range(_img.height):
            pix = image.get_pixel(x*scale, y*scale)
            _img.set_pixel(x, y, pix)
    return _img

def mirror(image: SimpleImage, direction: int):
    if direction == 0:
        _img = SimpleImage.blank(image.width *2, image.height)
    if direction == 1:
        _img = SimpleImage.blank(image.width, image.height *2)

    for x in range(_img.width):
        for y in range(_img.height):
            tx = x
            ty = y
            if direction == 0 and x>=image.width:
                tx = 2* image.width -x -1
            if direction == 1 and y>=image.height:
                ty = 2* image.height -y -1
            _img.set_pixel(x, y, image.get_pixel(tx, ty))
    return _img

def blur(image: SimpleImage):
    dir = [ [0,0],[0,1],[0,-1],[1,0],[1,1],[1,-1],[-1,0],[-1,1],[-1,-1] ]
    _img = image.copy()
    for x in range(_img.width):
        for y in range(_img.height):
            if x==0 or x==_img.width-1 or y==0 or y==_img.height-1:
                continue

            tup = (0, 0, 0)
            for i in dir:
                tx = x + i[0]
                ty = y + i[1]
                pix = image.get_pixel(tx, ty)
                tup = (tup[0]+pix.red, tup[1]+pix.green, tup[2]+pix.blue)
            _img.set_rgb(x, y, tup[0]//9, tup[1]//9, tup[2]//9)

    return _img

def filter(image: SimpleImage, channel: str, intensity: int):
    _img = image.copy()

    for x in range(_img.width):
        for y in range(_img.height):
            pix = image.get_pixel(x,y)

            fl = True
            if channel == "red":
                if pix.red > intensity:
                    fl = False
            if channel == "green":
                if pix.green > intensity:
                    fl = False
            if channel == "blue":
                if pix.blue > intensity:
                    fl = False
            if fl:
                avg = (pix.red +pix.green +pix.blue)//3
                #print("go avg=",avg)
                _img.set_rgb(x, y, avg, avg, avg)
            else:   # retain is intensity is achieved
                continue

    return _img

if __name__ == "__main__":
    pass