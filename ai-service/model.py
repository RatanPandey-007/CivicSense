import pandas as pd
import numpy as np
import string
import joblib
import os
import nltk
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
from sklearn.preprocessing import LabelEncoder
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer

# Ensure NLTK resources
try:
    nltk.data.find('corpora/stopwords')
    nltk.data.find('corpora/wordnet')
except LookupError:
    nltk.download('stopwords')
    nltk.download('wordnet')

# Absolute paths
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
DATASET_PATH = os.path.join(SCRIPT_DIR, 'DataSet.csv')
MODEL_PATH = os.path.join(SCRIPT_DIR, 'civic_priority_model.pkl')
VECTORIZER_PATH = os.path.join(SCRIPT_DIR, 'tfidf_vectorizer.pkl')
ENCODER_PATH = os.path.join(SCRIPT_DIR, 'label_encoder.pkl')

EMERGENCY_KEYWORDS = ['fire', 'accident', 'explosion', 'blast', 'collapse']

def apply_priority(complaint_type):
    """
    Rules for new 'priority' column based on actual data + user requirements.
    Used ONLY to generate training labels.
    """
    ctype = str(complaint_type).lower().strip()
    
    # High: Accident, Fire, Road Block (User defined) + Real dataset (Parking, Driveway, Traffic, Derelict)
    if any(keyword in ctype for keyword in ['accident', 'fire', 'road block', 'road blocking', 'parking', 'driveway', 'traffic', 'derelict']):
        return 'High'
    # Medium: Garbage, Water Leakage, Drainage (User defined) + Real dataset (Animal Abuse, Homeless Encampment, Vending, Drinking, Urinating)
    elif any(keyword in ctype for keyword in ['garbage', 'water leakage', 'drainage', 'animal', 'homeless', 'vending', 'drinking', 'urinating']):
        return 'Medium'
    # Low: Noise, Street Light (User defined) + Real dataset (Posting Advertisement, Bike, Pamphlet, Graffiti)
    elif any(keyword in ctype for keyword in ['noise', 'street light', 'advertisement', 'bike', 'panhandling', 'youth', 'fireworks', 'graffiti']):
        return 'Low'
    else:
        return 'Medium'

def preprocess_text(text):
    """
    Perform text preprocessing on description exactly like training.
    """
    text = str(text).strip()
    
    # Handle floats that are really integers
    if text.endswith('.0'):
        text = text[:-2]
        
    text = text.lower()
    text = text.translate(str.maketrans('', '', string.punctuation))
    
    stop_words = set(stopwords.words('english'))
    words = text.split()
    words = [w for w in words if w not in stop_words]
    
    lemmatizer = WordNetLemmatizer()
    words = [lemmatizer.lemmatize(w) for w in words]
    
    return ' '.join(words)

def build_and_evaluate_model():
    print(f"Loading dataset from {DATASET_PATH}...")
    try:
        df = pd.read_csv(DATASET_PATH, low_memory=False)
    except FileNotFoundError:
        print(f"Error: {DATASET_PATH} not found.")
        return None

    initial_len = len(df)
    
    if 'Complaint Type' in df.columns and 'complaint_type' not in df.columns:
        df = df.rename(columns={'Complaint Type': 'complaint_type'})
    if 'Incident Zip' in df.columns and 'description' not in df.columns:
        df = df.rename(columns={'Incident Zip': 'description'})
    
    if 'complaint_type' not in df.columns or 'description' not in df.columns:
        print("Dataset missing required columns ('complaint_type', 'description').")
        return None

    df = df[['complaint_type', 'description']].dropna().drop_duplicates()
    df = df[df['description'].astype(str).str.strip() != '']
    df = df[df['complaint_type'].astype(str).str.strip() != '']
    
    print(f"Cleaning complete. Reduced rows from {initial_len} to {len(df)}.")

    # Apply priority labels for training
    df['priority'] = df['complaint_type'].apply(apply_priority)

    # 1. Combine complaint_type and description into one feature column
    df['combined_text'] = df['complaint_type'].astype(str) + " " + df['description'].astype(str)

    print("Preprocessing text...")
    df['clean_desc'] = df['combined_text'].apply(preprocess_text)

    X_text = df['clean_desc']
    y_labels = df['priority']

    print("Vectorizing text (TF-IDF)...")
    tfidf = TfidfVectorizer()
    X = tfidf.fit_transform(X_text)

    le = LabelEncoder()
    y = le.fit_transform(y_labels)

    print("Splitting dataset...")
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    print("Training Logistic Regression ML model...")
    model = LogisticRegression(max_iter=1000)
    model.fit(X_train, y_train)

    y_pred = model.predict(X_test)
    
    print("\n--- Model Evaluation ---")
    print(f"Accuracy: {accuracy_score(y_test, y_pred):.4f}")
    
    target_names = le.inverse_transform(np.unique(y_test))
    print("\nClassification Report:")
    try:
        print(classification_report(y_test, y_pred, target_names=le.classes_))
    except Exception:
        print(classification_report(y_test, y_pred))

    joblib.dump(model, MODEL_PATH)
    joblib.dump(tfidf, VECTORIZER_PATH)
    joblib.dump(le, ENCODER_PATH)
    print("\nModel and transformers saved successfully!")

# Global variables for inference prediction
_model = None
_tfidf = None
_le = None

def load_resources():
    global _model, _tfidf, _le
    try:
        _model = joblib.load(MODEL_PATH)
        _tfidf = joblib.load(VECTORIZER_PATH)
        _le = joblib.load(ENCODER_PATH)
    except Exception as e:
        print(f"Notice: Model resources not found or failed to load. Please train the model. Error: {e}")

def predict_priority(new_text):
    """
    Central inference architecture combining ML and direct Override rules.
    """
    global _model, _tfidf, _le
    if _model is None or _tfidf is None or _le is None:
        load_resources()
        if _model is None:
            return {"error": "Models not loaded. Train the model first."}
            
    # 2. HYBRID EMERGENCY OVERRIDE
    text_lower = str(new_text).lower()
    if any(keyword in text_lower for keyword in EMERGENCY_KEYWORDS):
        # Override to strict High probability
        prob_dict = {"High": 1.0, "Medium": 0.0, "Low": 0.0}
        
        # In case the label encoder defines classes differently, force compliance
        for c in _le.classes_:
            if c not in prob_dict:
                prob_dict[c] = 0.0
                
        return {
            'prediction': 'High',
            'probabilities': prob_dict,
            'top_features_for_prediction': {'emergency_keyword_override': 1.0}
        }
        
    # Standard ML Pipeline prediction
    cleaned_text = preprocess_text(new_text)
    features = _tfidf.transform([cleaned_text])
    
    prediction_encoded = _model.predict(features)
    prediction_label = _le.inverse_transform(prediction_encoded)
    
    probabilities = _model.predict_proba(features)[0]
    prob_dict = {label: round(float(prob), 4) for label, prob in zip(_le.classes_, probabilities)}
    
    class_index = prediction_encoded[0]
    
    if len(_le.classes_) == 2:
        coef = _model.coef_[0]
        contributions = coef * features.toarray()[0]
        if class_index == 0:
            contributions = -contributions
    else:
        coef = _model.coef_[class_index]
        contributions = coef * features.toarray()[0]
        
    feature_names = _tfidf.get_feature_names_out()
    positive_indices = np.where(contributions > 0)[0]
    sorted_pos_indices = positive_indices[np.argsort(contributions[positive_indices])[::-1]]
    top_features = {feature_names[i]: round(contributions[i], 4) for i in sorted_pos_indices[:5]}
    
    return {
        'prediction': prediction_label[0],
        'probabilities': prob_dict,
        'top_features_for_prediction': top_features
    }

if __name__ == "__main__":
    # 4. Retrain model (this regenerates the .pkl files)
    build_and_evaluate_model()
    
    print("\n--- Testing Hybrid System: Override Scenario ---")
    test_complaint = "Fire in the market"
    import json
    print(f"Prediction result for '{test_complaint}':\n{json.dumps(predict_priority(test_complaint), indent=2)}")
    
    print("\n--- Testing Hybrid System: ML Scenario ---")
    ml_test = "Gas explosion in factory area"
    print(f"Prediction result for '{ml_test}':\n{json.dumps(predict_priority(ml_test), indent=2)}")