import cv2

first_click = None
second_click = None


def on_click(event, x, y, flags, param):
    global first_click, second_click

    if event == cv2.EVENT_LBUTTONDOWN:
        if first_click is None:
            first_click = (x, y)
            print(f"First click at: ({x}, {y})")
        elif second_click is None:
            second_click = (x, y)
            print(f"Second click at: ({x}, {y})")
            top_left = first_click
            bottom_right = second_click

            if top_left[0] > bottom_right[0]:
                top_left = second_click
                bottom_right = first_click
            if top_left[1] > bottom_right[1]:
                top_left = second_click
                bottom_right = first_click

            # Draw the rectangle on the original image
            image_with_rectangle = image.copy()
            cv2.rectangle(image_with_rectangle, top_left, bottom_right, (0, 255, 0), 2)

            cv2.imshow("Image with Rectangle", image_with_rectangle)

            cropped_image = image[top_left[1]:bottom_right[1], top_left[0]:bottom_right[0]]

            process_image(cropped_image)

def process_image(image):

    grayscale_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    inverted_image = cv2.bitwise_not(grayscale_image)


    _, thresholded_image = cv2.threshold(inverted_image, 50, 255, cv2.THRESH_BINARY)

    thresholded_color_image = cv2.cvtColor(thresholded_image, cv2.COLOR_GRAY2BGR)

    cv2.imshow("Processed Image", thresholded_color_image)

image_path = "/Users/williamchen/Downloads/stuff.PNG"
image = cv2.imread(image_path)

cv2.imshow("Original Image", image)

cv2.setMouseCallback("Original Image", on_click)


cv2.waitKey(0)

cv2.destroyAllWindows()