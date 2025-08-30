from flask import Blueprint, request, jsonify
from flask_cors import cross_origin
import openai
import json
import time
import random

triage_bp = Blueprint('triage', __name__)

# Mock healthcare resources database
MOCK_RESOURCES = [
    {
        "name": "Bay Area Urgent Care",
        "type": "Urgent Care",
        "distance": "0.8 miles",
        "waitTime": "15-30 min",
        "phone": "(555) 123-4567",
        "address": "123 Market St, San Francisco, CA",
        "lat": 37.7749,
        "lng": -122.4194
    },
    {
        "name": "UCSF Medical Center",
        "type": "Hospital",
        "distance": "2.1 miles",
        "waitTime": "45-60 min",
        "phone": "(555) 987-6543",
        "address": "505 Parnassus Ave, San Francisco, CA",
        "lat": 37.7632,
        "lng": -122.4583
    },
    {
        "name": "SF General Hospital",
        "type": "Emergency Room",
        "distance": "3.2 miles",
        "waitTime": "60-90 min",
        "phone": "(555) 456-7890",
        "address": "1001 Potrero Ave, San Francisco, CA",
        "lat": 37.7562,
        "lng": -122.4041
    },
    {
        "name": "Mission Bay Clinic",
        "type": "Clinic",
        "distance": "1.5 miles",
        "waitTime": "20-40 min",
        "phone": "(555) 234-5678",
        "address": "1825 4th St, San Francisco, CA",
        "lat": 37.7670,
        "lng": -122.3892
    }
]

def analyze_symptoms_with_ai(symptoms_text):
    """Use OpenAI to analyze symptoms and determine urgency level"""
    try:
        client = openai.OpenAI()
        
        prompt = f"""
        You are a medical triage AI assistant. Analyze the following symptoms and provide a triage assessment.
        
        IMPORTANT GUIDELINES:
        - You are NOT providing a diagnosis
        - You are assessing urgency level only
        - Always recommend consulting healthcare professionals
        - Be conservative and err on the side of caution
        
        Symptoms: {symptoms_text}
        
        Please respond with a JSON object containing:
        1. urgencyLevel: "low", "moderate", or "high"
        2. summary: A brief explanation of the assessment (2-3 sentences)
        3. recommendations: Array of 3-4 actionable recommendations
        4. reasoning: Brief explanation of why this urgency level was chosen
        
        Example format:
        {{
            "urgencyLevel": "moderate",
            "summary": "Based on your symptoms, this appears to be a moderate concern that should be addressed within 24 hours.",
            "recommendations": [
                "Visit an urgent care center",
                "Monitor symptoms closely",
                "Seek immediate care if symptoms worsen"
            ],
            "reasoning": "The combination of symptoms suggests a condition that requires medical attention but is not immediately life-threatening."
        }}
        """
        
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a conservative medical triage assistant focused on patient safety."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.3,
            max_tokens=500
        )
        
        # Parse the JSON response
        result = json.loads(response.choices[0].message.content)
        return result
        
    except Exception as e:
        print(f"AI Analysis Error: {e}")
        # Fallback to rule-based analysis
        return analyze_symptoms_rule_based(symptoms_text)

def analyze_symptoms_rule_based(symptoms_text):
    """Fallback rule-based symptom analysis"""
    symptoms_lower = symptoms_text.lower()
    
    # High urgency keywords
    high_urgency_keywords = [
        'chest pain', 'difficulty breathing', 'shortness of breath',
        'severe pain', 'unconscious', 'bleeding heavily', 'stroke',
        'heart attack', 'can\'t breathe', 'choking'
    ]
    
    # Moderate urgency keywords
    moderate_urgency_keywords = [
        'fever', 'nausea', 'vomiting', 'abdominal pain', 'headache',
        'dizziness', 'rash', 'infection', 'injury'
    ]
    
    # Check for high urgency
    for keyword in high_urgency_keywords:
        if keyword in symptoms_lower:
            return {
                "urgencyLevel": "high",
                "summary": "Your symptoms suggest a potentially serious condition that requires immediate medical attention.",
                "recommendations": [
                    "Seek emergency care immediately",
                    "Call 911 if symptoms are severe",
                    "Do not delay medical treatment",
                    "Have someone accompany you if possible"
                ],
                "reasoning": "Symptoms indicate a potentially urgent medical condition."
            }
    
    # Check for moderate urgency
    for keyword in moderate_urgency_keywords:
        if keyword in symptoms_lower:
            return {
                "urgencyLevel": "moderate",
                "summary": "Based on your symptoms, this appears to be a moderate concern that should be addressed within 24 hours.",
                "recommendations": [
                    "Visit an urgent care center or your primary care doctor",
                    "Monitor symptoms closely",
                    "Seek immediate care if symptoms worsen",
                    "Stay hydrated and rest"
                ],
                "reasoning": "Symptoms suggest a condition that needs medical attention but is not immediately life-threatening."
            }
    
    # Default to low urgency
    return {
        "urgencyLevel": "low",
        "summary": "Your symptoms appear to be mild and may be managed with self-care, but consider consulting a healthcare provider if they persist.",
        "recommendations": [
            "Monitor symptoms for changes",
            "Consider over-the-counter remedies if appropriate",
            "Schedule a routine appointment with your doctor if symptoms persist",
            "Maintain good hydration and rest"
        ],
        "reasoning": "Symptoms appear to be mild and may resolve with self-care."
    }

@triage_bp.route('/assess', methods=['POST'])
@cross_origin()
def assess_symptoms():
    """Main triage assessment endpoint"""
    try:
        data = request.get_json()
        
        if not data or 'symptoms' not in data:
            return jsonify({'error': 'Symptoms are required'}), 400
        
        symptoms = data['symptoms'].strip()
        location = data.get('location', '')
        
        if not symptoms:
            return jsonify({'error': 'Symptoms cannot be empty'}), 400
        
        # Simulate processing time
        time.sleep(1)
        
        # Analyze symptoms with AI
        triage_result = analyze_symptoms_with_ai(symptoms)
        
        # Get nearby resources based on urgency level
        urgency_level = triage_result['urgencyLevel']
        nearby_resources = get_nearby_resources(location, urgency_level)
        
        # Combine results
        response = {
            'urgencyLevel': triage_result['urgencyLevel'],
            'summary': triage_result['summary'],
            'recommendations': triage_result['recommendations'],
            'reasoning': triage_result.get('reasoning', ''),
            'nearbyResources': nearby_resources,
            'timestamp': time.time()
        }
        
        return jsonify(response)
        
    except Exception as e:
        print(f"Triage Assessment Error: {e}")
        return jsonify({'error': 'An error occurred during assessment'}), 500

def get_nearby_resources(location, urgency_level):
    """Get nearby healthcare resources based on location and urgency"""
    # Filter resources based on urgency level
    if urgency_level == 'high':
        # Prioritize emergency rooms and hospitals
        filtered_resources = [r for r in MOCK_RESOURCES if r['type'] in ['Emergency Room', 'Hospital']]
    elif urgency_level == 'moderate':
        # Prioritize urgent care and hospitals
        filtered_resources = [r for r in MOCK_RESOURCES if r['type'] in ['Urgent Care', 'Hospital', 'Emergency Room']]
    else:
        # Include all types for low urgency
        filtered_resources = MOCK_RESOURCES
    
    # Sort by distance (mock sorting)
    sorted_resources = sorted(filtered_resources, key=lambda x: float(x['distance'].split()[0]))
    
    # Return top 3 resources
    return sorted_resources[:3]

@triage_bp.route('/resources', methods=['GET'])
@cross_origin()
def get_resources():
    """Get all available healthcare resources"""
    try:
        location = request.args.get('location', '')
        urgency = request.args.get('urgency', 'moderate')
        
        resources = get_nearby_resources(location, urgency)
        
        return jsonify({
            'resources': resources,
            'total': len(resources)
        })
        
    except Exception as e:
        print(f"Resources Error: {e}")
        return jsonify({'error': 'An error occurred fetching resources'}), 500

@triage_bp.route('/health', methods=['GET'])
@cross_origin()
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'service': 'TRIAGE A.I. Backend',
        'timestamp': time.time()
    })

