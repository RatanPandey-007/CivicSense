from flask import Flask, request, jsonify
from model import predict_priority, load_resources
import os

app = Flask(__name__)

# Pre-load resources on server start
load_resources()

@app.route('/predict', methods=['POST'])
def predict():
    if not request.is_json:
        return jsonify({"error": "Request must be JSON"}), 400
        
    data = request.get_json()
    complaint_id = data.get('complaint_id', 'mock_id')
    description = data.get('description', '')
    image = data.get('image', None) # Keep for backwards compatibility
    
    if not description:
        # Fallback if no description provided
        description = "Unknown issue"
        
    try:
        # Reusable central prediction logic (incorporating the hybrid override)
        result = predict_priority(description)
        
        if "error" in result:
            return jsonify(result), 500
            
        # Hardcoding the 'category' for backwards compatibility with the Node.js backend
        response = {
            "complaint_id": complaint_id,
            "priority": result["prediction"],
            "confidence_scores": result["probabilities"], # Return probabilities as requested
            "category": "unclassified", # Required by the backend issue creation flow
            "confidence": 0.5 # Required by the backend issue creation flow
        }
        
        return jsonify(response), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8000))
    app.run(host='0.0.0.0', port=port, debug=True)