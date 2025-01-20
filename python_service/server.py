from flask import Flask, request, jsonify
from flask_cors import CORS
import base64
import io
import os
from dotenv import load_dotenv
from transformers import ViTForImageClassification, ViTFeatureExtractor
from PIL import Image
import torch

load_dotenv()

model = ViTForImageClassification.from_pretrained("./food101-vit-model")
feature_extractor = ViTFeatureExtractor.from_pretrained("./food101-vit-model")

app = Flask(__name__)
CORS(app) 
PYTHON_PORT=os.getenv('PYTHON_PORT', "5000")

MODEL_PATH = "./food101-vit-model"
model = ViTForImageClassification.from_pretrained(MODEL_PATH)
feature_extractor = ViTFeatureExtractor.from_pretrained(MODEL_PATH)

model.eval()
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model.to(device)

@app.route('/predict', methods=['POST'])
def predict():
    print(request.files)
    if 'image' not in request.files:
        return jsonify({"error": "No image file provided."}), 400

    image_file = request.files['image']

    try:
        image = Image.open(image_file)
        inputs = feature_extractor(images=image, return_tensors="pt")
        inputs = {key: value.to(device) for key, value in inputs.items()}

        with torch.no_grad():
            outputs = model(**inputs)
            logits = outputs.logits
            predictions = torch.nn.functional.softmax(logits, dim=1)
            predicted_class_idx = predictions.argmax(dim=1).item()

        return jsonify({"predicted_ind": predicted_class_idx})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)