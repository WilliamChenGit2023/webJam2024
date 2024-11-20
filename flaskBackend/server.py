import os
import base64
import uuid
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Save directory for images
UPLOAD_FOLDER = 'uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

# Serve uploaded files
@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)

@app.route('/ping', methods=['GET'])
def ping():
    return jsonify({'status': 'success', 'message': 'Backend is connected', 'number': 42})

@app.route('/uploads', methods=['GET'])
def get_uploaded_images():
    # Get the list of all image files in the uploads folder
    image_files = [f for f in os.listdir(UPLOAD_FOLDER) if f.endswith(('.jpg', '.jpeg', '.png'))]
    # Construct the full URL path for each image
    image_urls = [f'/uploads/{image_file}' for image_file in image_files]
    return jsonify({'images': image_urls})

@app.route('/upload', methods=['POST'])
def upload_image():
    data = request.json
    image_data = data.get('image')

    if not image_data:
        return jsonify({'error': 'No image data found'}), 400
    
    # Remove the part before the actual image (data:image/jpeg;base64,)
    image_data = image_data.split(",")[1]
    image_bytes = base64.b64decode(image_data)
    
    # Generate a unique file name using UUID
    image_filename = f'{uuid.uuid4().hex}.jpg'
    image_path = os.path.join(UPLOAD_FOLDER, image_filename)
    
    # Save image to disk
    with open(image_path, 'wb') as f:
        f.write(image_bytes)

    # Return a response with the image URL
    return jsonify({'success': True, 'imageUrl': f'/uploads/{image_filename}'})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000, ssl_context=('server.crt', 'server.key'))
