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
@app.route('/uploads/<folder_name>/<filename>', methods=['GET'])
def uploaded_file(folder_name, filename):
    # Serve the uploaded file from the specific folder in the uploads directory
    folder_path = os.path.join(UPLOAD_FOLDER, folder_name)
    return send_from_directory(folder_path, filename)

@app.route('/ping', methods=['GET'])
def ping():
    return jsonify({'status': 'success', 'message': 'Backend is connected', 'number': 42})

@app.route('/get_folders', methods=['GET'])
def get_folders():
    # List all subdirectories in the uploads directory (folders)
    folders = [f for f in os.listdir(UPLOAD_FOLDER) if os.path.isdir(os.path.join(UPLOAD_FOLDER, f))]
    return jsonify({'folders': folders})

@app.route('/get_images_in_folder', methods=['POST'])
def get_images_in_folder():
    data = request.json
    folder_name = data.get('folder_name')

    if not folder_name:
        print("hi")
        return jsonify({'error': 'Folder name is required'}), 400

    # Construct the folder path
    folder_path = os.path.join(UPLOAD_FOLDER, folder_name)
    if not os.path.exists(folder_path):
        return jsonify({'error': 'Folder does not exist'}), 400

    # Get the list of all image files in the folder
    image_files = [f for f in os.listdir(folder_path) if f.endswith(('.jpg', '.jpeg', '.png'))]
    # Construct the full URL path for each image
    image_urls = [f'/uploads/{folder_name}/{image_file}' for image_file in image_files]

    return jsonify({'images': image_urls})

@app.route('/upload', methods=['POST'])
def upload_image():
    data = request.json
    image_data = data.get('image')
    folder_name = data.get('folder_name', '')  # Default to no folder if not provided

    if not image_data:
        return jsonify({'error': 'No image data found'}), 400

    # Remove the part before the actual image (data:image/jpeg;base64,)
    image_data = image_data.split(",")[1]
    image_bytes = base64.b64decode(image_data)
    
    # Generate a unique file name using UUID
    image_filename = f'{uuid.uuid4().hex}.jpg'
    
    # If a folder is provided, make sure it's valid
    if folder_name:
        folder_path = os.path.join(UPLOAD_FOLDER, folder_name)
        if not os.path.exists(folder_path):
            os.makedirs(folder_path)
    else:
        return jsonify({'error': 'Folder not selected'}), 400

    
    image_path = os.path.join(folder_path, image_filename)

    for filename in os.listdir(folder_path):
        file_path = os.path.join(folder_path, filename)
        if os.path.isfile(file_path):
            os.remove(file_path)

    # Save image to disk
    with open(image_path, 'wb') as f:
        f.write(image_bytes)

    # Return a response with the image URL
    return jsonify({'success': True, 'imageUrl': f'/uploads/{folder_name}/{image_filename}'})

# Route to create a new folder in the uploads directory
@app.route('/create_folder', methods=['POST'])
def create_folder():
    data = request.json
    folder_name = data.get('folder_name')

    if not folder_name:
        return jsonify({'error': 'Folder name is required'}), 400

    # Create the folder path
    folder_path = os.path.join(UPLOAD_FOLDER, folder_name)
    
    if os.path.exists(folder_path):
        return jsonify({'error': 'Folder already exists'}), 400

    os.makedirs(folder_path)  # Create the new folder
    return jsonify({'success': True, 'folder_name': folder_name})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000, ssl_context=('server.crt', 'server.key'))
