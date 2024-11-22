import os
import base64
import uuid
import json
import threading
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from cvmain import checkFinished
import time


app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Save directory for images
UPLOAD_FOLDER = 'uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

#update function
def update_status_periodically():
    while True:
        folders = [f for f in os.listdir(UPLOAD_FOLDER) if os.path.isdir(os.path.join(UPLOAD_FOLDER, f))]
        for folder_name in folders:
            folder_path = os.path.join(UPLOAD_FOLDER, folder_name)
            print(folder_path)
            print("hi")
            status_file_path = os.path.join(folder_path, 'state.txt')
            try:
                # Call the function from `cvmain.py` to determine the status
                status = checkFinished(folder_path)  # Assuming it returns a boolean or similar
                print("2")
                with open(status_file_path, 'w') as f:
                    f.write('true' if status else 'false')
            except Exception as e:
                print(f"Error updating status for folder {folder_name}: {e}")
        time.sleep(30)  # Update every 30 seconds

# Start the status update thread
status_thread = threading.Thread(target=update_status_periodically, daemon=True)
status_thread.start()

# Serve uploaded files
@app.route('/uploads/<folder_name>/<filename>', methods=['GET'])
def uploaded_file(folder_name, filename):
    folder_path = os.path.join(UPLOAD_FOLDER, folder_name)
    return send_from_directory(folder_path, filename)

@app.route('/ping', methods=['GET'])
def ping():
    return jsonify({'status': 'success', 'message': 'Backend is connected', 'number': 42})

@app.route('/get_folders', methods=['GET'])
def get_folders():
    folders = [f for f in os.listdir(UPLOAD_FOLDER) if os.path.isdir(os.path.join(UPLOAD_FOLDER, f))]
    return jsonify({'folders': folders})

@app.route('/get_images_in_folder', methods=['POST'])
def get_images_in_folder():
    data = request.json
    folder_name = data.get('folder_name')

    if not folder_name:
        return jsonify({'error': 'Folder name is required'}), 400

    folder_path = os.path.join(UPLOAD_FOLDER, folder_name)
    if not os.path.exists(folder_path):
        return jsonify({'error': 'Folder does not exist'}), 400

    image_files = [f for f in os.listdir(folder_path) if f.endswith(('.jpg', '.jpeg', '.png'))]
    image_urls = [f'/uploads/{folder_name}/{image_file}' for image_file in image_files]

    return jsonify({'images': image_urls})

@app.route('/upload', methods=['POST'])
def upload_image():
    data = request.json
    image_data = data.get('image')
    folder_name = data.get('folder_name', '')  # Default to no folder if not provided

    if not image_data:
        return jsonify({'error': 'No image data found'}), 400

    # Decode the image data
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
        # Delete only image files
        if os.path.isfile(file_path) and file_path.lower().endswith(('.jpg', '.jpeg', '.png')):
            os.remove(file_path)


    # Save image to disk
    with open(image_path, 'wb') as f:
        f.write(image_bytes)

    # Return a response with the image URL
    return jsonify({'success': True, 'imageUrl': f'/uploads/{folder_name}/{image_filename}'})

@app.route('/create_folder', methods=['POST'])
def create_folder():
    data = request.json
    folder_name = data.get('folder_name')

    if not folder_name:
        return jsonify({'error': 'Folder name is required'}), 400

    folder_path = os.path.join(UPLOAD_FOLDER, folder_name)
    if os.path.exists(folder_path):
        return jsonify({'error': 'Folder already exists'}), 400

    os.makedirs(folder_path)
    return jsonify({'success': True, 'folder_name': folder_name})

@app.route('/upload_coordinates', methods=['POST'])
def upload_coordinates():
    data = request.json
    folder_name = data.get('folder_name')  # Folder where the coordinates will be saved
    coordinates = data.get('coordinates')  # Coordinates to be uploaded

    if not folder_name or not coordinates:
        return jsonify({'error': 'Folder name and coordinates are required'}), 400

    # Ensure the folder exists
    folder_path = os.path.join(UPLOAD_FOLDER, folder_name)
    if not os.path.exists(folder_path):
        return jsonify({'error': 'Folder does not exist'}), 400
    for filename in os.listdir(folder_path):
        file_path = os.path.join(folder_path, filename)
        # Delete only image files
        if os.path.isfile(file_path) and file_path.lower().endswith(('.json')):
            os.remove(file_path)
    # Save the coordinates as a fixed JSON file
    coordinates_filename = os.path.join(folder_path, 'coordinates.json')

    # Write the coordinates to a JSON file
    with open(coordinates_filename, 'w') as f:
        json.dump({'coordinates': coordinates}, f)

    return jsonify({'success': True, 'message': 'Coordinates uploaded successfully'})

# Fetch coordinates from the folder
@app.route('/get_coordinates', methods=['POST'])
def get_coordinates():
    data = request.json
    folder_name = data.get('folder_name')  # Name of the folder

    if not folder_name:
        return jsonify({'error': 'Folder name is required'}), 400

    folder_path = os.path.join(UPLOAD_FOLDER, folder_name)
    if not os.path.exists(folder_path):
        return jsonify({'error': 'Folder does not exist'}), 400

    # Find the coordinates file in the folder
    coordinates_filename = os.path.join(folder_path, 'coordinates.json')

    if not os.path.exists(coordinates_filename):
        return jsonify({'error': 'Coordinates file does not exist'}), 400

    # Load and return the coordinates
    with open(coordinates_filename, 'r') as f:
        coordinates_data = json.load(f)

    return jsonify({'coordinates': coordinates_data['coordinates']})

@app.route('/get_status', methods=['GET'])
def get_status():
    folder_name = request.args.get('folder_name')  # Fetch query parameter
    print("hi")  # Debugging message
    print(f"Folder name: {folder_name}")  # Debugging the received folder name

    if not folder_name:
        return jsonify({'error': 'Folder name is required'}), 400

    folder_path = os.path.join(UPLOAD_FOLDER, folder_name)
    if not os.path.exists(folder_path):
        return jsonify({'error': 'Folder does not exist'}), 404

    status_filename = os.path.join(folder_path, 'state.txt')
    if os.path.exists(status_filename):
        try:
            with open(status_filename, 'r') as f:
                status = f.read().strip()
            return jsonify({'status': status}), 200
        except Exception as e:
            return jsonify({'error': 'Error reading status file', 'details': str(e)}), 500
    else:
        return jsonify({'error': 'Status file not found'}), 404


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000, ssl_context=('server.crt', 'server.key'))
