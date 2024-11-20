from flask import Flask, request, jsonify, send_from_directory
import os
import json

app = Flask(__name__)

# Directory for uploaded files
UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # Limit file size to 16MB

@app.route("/members")
def members():
    return {"members": [1, 2, 3]}

@app.route("/upload", methods=["POST"])
def upload_image():
    # Check if the request contains the image file and coordinates
    if 'image' not in request.files or 'coordinates' not in request.form:
        return jsonify({"error": "Image or coordinates missing"}), 400

    # Get the uploaded image
    image = request.files['image']
    coordinates = json.loads(request.form['coordinates'])  # Parse the coordinates from JSON string

    # Save the image
    image_filename = os.path.join(app.config['UPLOAD_FOLDER'], image.filename)
    image.save(image_filename)

    # Store the coordinates in a file inside the uploads folder
    coordinates_filename = os.path.join(app.config['UPLOAD_FOLDER'], f"{image.filename}_coordinates.json")
    
    # Create or append to the coordinates file
    with open(coordinates_filename, 'w') as f:
        json.dump({'image': image.filename, 'coordinates': coordinates}, f, indent=4)

    # Print the coordinates to the console
    print(f"Coordinates for {image.filename}: {coordinates}")

    # Return a response with the image path and coordinates
    return jsonify({
        "message": "Image and coordinates uploaded successfully",
        "image_url": f"/uploads/{image.filename}",
        "coordinates": coordinates
    })

# Route to serve the uploaded images
@app.route("/uploads/<filename>")
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

if __name__ == "__main__":
    app.run(debug=True)
