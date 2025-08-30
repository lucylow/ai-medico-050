import { useState } from 'react'
import { Card } from './ui/card'
import { Button } from './ui/button'
import { Textarea } from './ui/textarea'
import { Activity, TrendingUp, BarChart3, PieChart } from 'lucide-react'

// Enhanced disease database with more comprehensive data
const diseaseDatabase = {
  fever: {
    name: "Fever/Infection",
    symptoms: [
      { name: "High Temperature", value: 40, color: "#ef4444", severity: "high" },
      { name: "Body Aches", value: 30, color: "#f97316", severity: "moderate" },
      { name: "Fatigue", value: 30, color: "#eab308", severity: "moderate" },
    ],
    treatments: [
      { name: "Rest", effectiveness: 90, color: "#22c55e", priority: 1 },
      { name: "Hydration", effectiveness: 85, color: "#3b82f6", priority: 2 },
      { name: "Fever Reducers", effectiveness: 75, color: "#8b5cf6", priority: 3 },
      { name: "Cool Compress", effectiveness: 65, color: "#06b6d4", priority: 4 },
    ],
    urgency: "moderate",
    description: "Elevated body temperature often indicating infection or immune response.",
    recommendations: [
      "Monitor temperature regularly",
      "Stay well hydrated with fluids",
      "Get plenty of rest",
      "Seek medical attention if fever exceeds 103°F (39.4°C)"
    ]
  },
  respiratory: {
    name: "Respiratory Issues",
    symptoms: [
      { name: "Cough", value: 35, color: "#ef4444", severity: "moderate" },
      { name: "Shortness of Breath", value: 25, color: "#dc2626", severity: "high" },
      { name: "Chest Tightness", value: 20, color: "#f97316", severity: "moderate" },
      { name: "Runny Nose", value: 20, color: "#eab308", severity: "low" },
    ],
    treatments: [
      { name: "Steam Inhalation", effectiveness: 80, color: "#22c55e", priority: 1 },
      { name: "Rest", effectiveness: 85, color: "#3b82f6", priority: 2 },
      { name: "Warm Fluids", effectiveness: 70, color: "#8b5cf6", priority: 3 },
      { name: "Humidifier", effectiveness: 65, color: "#06b6d4", priority: 4 },
    ],
    urgency: "moderate",
    description: "Symptoms affecting the respiratory system including airways and lungs.",
    recommendations: [
      "Avoid irritants and allergens",
      "Use a humidifier to ease breathing",
      "Stay hydrated with warm liquids",
      "Seek immediate care if breathing becomes severely difficult"
    ]
  },
  headache: {
    name: "Headache/Migraine",
    symptoms: [
      { name: "Head Pain", value: 45, color: "#ef4444", severity: "high" },
      { name: "Light Sensitivity", value: 25, color: "#f97316", severity: "moderate" },
      { name: "Nausea", value: 20, color: "#eab308", severity: "moderate" },
      { name: "Neck Stiffness", value: 10, color: "#22c55e", severity: "low" },
    ],
    treatments: [
      { name: "Dark Quiet Room", effectiveness: 85, color: "#22c55e", priority: 1 },
      { name: "Pain Relief", effectiveness: 80, color: "#3b82f6", priority: 2 },
      { name: "Hydration", effectiveness: 70, color: "#8b5cf6", priority: 3 },
      { name: "Cold Compress", effectiveness: 65, color: "#06b6d4", priority: 4 },
    ],
    urgency: "low",
    description: "Pain in the head or neck region, possibly accompanied by other symptoms.",
    recommendations: [
      "Rest in a dark, quiet environment",
      "Apply cold or warm compress as preferred",
      "Stay hydrated",
      "Avoid known triggers like certain foods or stress"
    ]
  },
  gastrointestinal: {
    name: "Gastrointestinal Issues",
    symptoms: [
      { name: "Nausea", value: 30, color: "#ef4444", severity: "moderate" },
      { name: "Abdominal Pain", value: 35, color: "#dc2626", severity: "high" },
      { name: "Vomiting", value: 20, color: "#f97316", severity: "moderate" },
      { name: "Diarrhea", value: 15, color: "#eab308", severity: "moderate" },
    ],
    treatments: [
      { name: "Clear Fluids", effectiveness: 90, color: "#22c55e", priority: 1 },
      { name: "BRAT Diet", effectiveness: 80, color: "#3b82f6", priority: 2 },
      { name: "Rest", effectiveness: 75, color: "#8b5cf6", priority: 3 },
      { name: "Probiotics", effectiveness: 60, color: "#06b6d4", priority: 4 },
    ],
    urgency: "moderate",
    description: "Digestive system symptoms affecting stomach and intestines.",
    recommendations: [
      "Stay hydrated with clear fluids",
      "Follow BRAT diet (Bananas, Rice, Applesauce, Toast)",
      "Avoid dairy and fatty foods temporarily",
      "Seek medical attention if symptoms persist or worsen"
    ]
  }
}

const SymptomChart = ({ data, title, type = "bar" }) => {
  const maxValue = Math.max(...data.map(item => item.value || item.effectiveness))
  
  return (
    <div className="space-y-4">
      <h4 className="font-semibold text-gray-700 flex items-center gap-2">
        {type === "bar" ? <BarChart3 className="h-4 w-4" /> : <PieChart className="h-4 w-4" />}
        {title}
      </h4>
      <div className="space-y-2">
        {data.map((item, index) => (
          <div key={index} className="flex items-center gap-3">
            <div className="w-20 text-sm text-gray-600 truncate">{item.name}</div>
            <div className="flex-1 bg-gray-200 rounded-full h-3 relative overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-1000 ease-out"
                style={{
                  backgroundColor: item.color,
                  width: `${((item.value || item.effectiveness) / maxValue) * 100}%`
                }}
              />
            </div>
            <div className="w-12 text-sm font-medium text-gray-700">
              {item.value || item.effectiveness}%
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const SymptomAnalysis = ({ symptoms, onAnalysisComplete }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState(null)

  const analyzeSymptoms = async () => {
    if (!symptoms.trim()) return

    setIsAnalyzing(true)
    
    // Simulate AI analysis with enhanced logic
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const symptomsLower = symptoms.toLowerCase()
    let detectedCondition = 'respiratory' // default
    
    // Enhanced symptom detection logic
    if (symptomsLower.includes('fever') || symptomsLower.includes('temperature') || 
        symptomsLower.includes('chills') || symptomsLower.includes('hot')) {
      detectedCondition = 'fever'
    } else if (symptomsLower.includes('headache') || symptomsLower.includes('migraine') || 
               symptomsLower.includes('head pain')) {
      detectedCondition = 'headache'
    } else if (symptomsLower.includes('nausea') || symptomsLower.includes('vomit') || 
               symptomsLower.includes('stomach') || symptomsLower.includes('abdominal')) {
      detectedCondition = 'gastrointestinal'
    } else if (symptomsLower.includes('cough') || symptomsLower.includes('breathing') || 
               symptomsLower.includes('chest') || symptomsLower.includes('throat')) {
      detectedCondition = 'respiratory'
    }

    const condition = diseaseDatabase[detectedCondition]
    const result = {
      condition: condition.name,
      urgency: condition.urgency,
      description: condition.description,
      symptoms: condition.symptoms,
      treatments: condition.treatments,
      recommendations: condition.recommendations,
      confidence: Math.floor(Math.random() * 20) + 80 // 80-100%
    }

    setAnalysisResult(result)
    setIsAnalyzing(false)
    
    if (onAnalysisComplete) {
      onAnalysisComplete(result)
    }
  }

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200'
      case 'moderate': return 'text-orange-600 bg-orange-50 border-orange-200'
      case 'low': return 'text-green-600 bg-green-50 border-green-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
        <div className="flex items-center gap-3 mb-4">
          <Activity className="h-6 w-6 text-blue-600" />
          <h3 className="text-xl font-semibold text-gray-800">AI Symptom Analysis</h3>
        </div>
        
        <Button 
          onClick={analyzeSymptoms}
          disabled={isAnalyzing || !symptoms.trim()}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
        >
          {isAnalyzing ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Analyzing Symptoms...
            </>
          ) : (
            <>
              <TrendingUp className="h-4 w-4 mr-2" />
              Analyze with AI
            </>
          )}
        </Button>
      </Card>

      {analysisResult && (
        <div className="space-y-6 animate-fade-in">
          {/* Analysis Summary */}
          <Card className="p-6 bg-white border-gray-200 shadow-lg">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Analysis Results</h3>
                <div className={`inline-flex px-3 py-1 rounded-full text-sm font-medium border ${getUrgencyColor(analysisResult.urgency)}`}>
                  {analysisResult.urgency.toUpperCase()} PRIORITY
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">Confidence</div>
                <div className="text-2xl font-bold text-green-600">{analysisResult.confidence}%</div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div>
                <h4 className="font-semibold text-gray-700">Likely Condition</h4>
                <p className="text-gray-600">{analysisResult.condition}</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-700">Description</h4>
                <p className="text-gray-600">{analysisResult.description}</p>
              </div>
            </div>
          </Card>

          {/* Charts */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6 bg-white border-gray-200 shadow-lg">
              <SymptomChart 
                data={analysisResult.symptoms} 
                title="Symptom Severity Analysis" 
                type="bar"
              />
            </Card>
            
            <Card className="p-6 bg-white border-gray-200 shadow-lg">
              <SymptomChart 
                data={analysisResult.treatments} 
                title="Treatment Effectiveness" 
                type="bar"
              />
            </Card>
          </div>

          {/* Recommendations */}
          <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
            <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Activity className="h-5 w-5 text-green-600" />
              Recommended Actions
            </h4>
            <ul className="space-y-2">
              {analysisResult.recommendations.map((rec, index) => (
                <li key={index} className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">{rec}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      )}
    </div>
  )
}

export default SymptomAnalysis

