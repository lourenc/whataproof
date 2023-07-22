import cv2
import numpy as np
from flask import Flask, request, jsonify, Response
from flask_cors import CORS

from imwatermark import WatermarkEncoder, WatermarkDecoder

app = Flask(__name__)
CORS(app)  # Enable CORS for the entire app

@app.route('/process_image', methods=['POST'])
def process_image():
    if 'image' not in request.files:
        return jsonify({'error': 'No image found in the request'}), 400

    image_file = request.files['image']

    key = request.form.get('key', '')

    if image_file:
        # Convert the image file to a NumPy array using OpenCV and NumPy
        image_data = cv2.imdecode(np.frombuffer(image_file.read(), np.uint8), cv2.IMREAD_COLOR)

        encoder = WatermarkEncoder()
        encoder.set_watermark('bytes', key.encode('utf-8'))
        bgr_encoded = encoder.encode(image_data, 'dwtDct')

        # Get the image format from the uploaded image file
        _, image_extension = image_file.filename.rsplit('.', 1)

        image_extension = image_extension.lower()

        # Convert the NumPy array to binary image data of the same format
        _, encoded_image = cv2.imencode(f'.{image_extension}', bgr_encoded)

        return Response(encoded_image.tobytes(), content_type=f'image/{image_extension}')
    else:
        return jsonify({'error': 'No image file received'}), 400


@app.route('/check_image', methods=['POST'])
def check_image():
    if 'image' not in request.files:
        return jsonify({'error': 'No image found in the request'}), 400

    image_file = request.files['image']

    if image_file:
        # Convert the image file to a NumPy array using OpenCV and NumPy
        image_data = cv2.imdecode(np.frombuffer(image_file.read(), np.uint8), cv2.IMREAD_COLOR)

        decoder = WatermarkDecoder('bytes', 32)
        watermark = decoder.decode(image_data, 'dwtDct')
        key = watermark.decode('utf-8', 'replace')

        return Response(key, content_type='text/plain')
    else:
        return jsonify({'error': 'No image file received'}), 400

if __name__ == '__main__':
    app.run(debug=True)