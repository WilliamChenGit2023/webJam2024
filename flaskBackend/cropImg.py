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

            # Crop the image and process it
            cropped_image = image[top_left[1]:bottom_right[1], top_left[0]:bottom_right[0]]
            process_image(cropped_image)

def process_image(image):
    grayscale_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    inverted_image = cv2.bitwise_not(grayscale_image)
    _, thresholded_image = cv2.threshold(inverted_image, 50, 255, cv2.THRESH_BINARY)
    thresholded_color_image = cv2.cvtColor(thresholded_image, cv2.COLOR_GRAY2BGR)

    # Save the processed image
    processed_image_path = 'processed_image.jpg'
    cv2.imwrite(processed_image_path, thresholded_color_image)
    return processed_image_path

def start_image_processing(image_path):
    global image
    image = cv2.imread(image_path)
    cv2.setMouseCallback("Original Image", on_click)
    cv2.waitKey(0)
    cv2.destroyAllWindows()

    # Return the path of the processed image
    return process_image(image)
