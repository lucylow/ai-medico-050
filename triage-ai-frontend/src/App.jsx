import { useState } from 'react'
import { Card } from './components/ui/card'
import { Button } from './components/ui/button'
import { Badge } from './components/ui/badge'
import { Textarea } from './components/ui/textarea'
import { Input } from './components/ui/input'
import { 
  Stethoscope, 
  MapPin, 
  Camera, 
  Phone, 
  AlertTriangle, 
  Clock,
  Activity,
  Brain,
  Shield,
  Users,
  TrendingUp,
  BarChart3,
  Zap,
  Heart,
  Eye
} from 'lucide-react'
import SymptomAnalysis from './components/SymptomAnalysis'

function App() {
  const [symptoms, setSymptoms] = useState('')
  const [triageResult, setTriageResult] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [location, setLocation] = useState('')
  const [showAnalysis, setShowAnalysis] = useState(false)
  const [analysisResult, setAnalysisResult] = useState(null)

  const handleTriage = async () => {
    if (!symptoms.trim()) return
    
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/triage/assess', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          symptoms: symptoms,
          location: location
        })
      })
      
      if (!response.ok) {
        throw new Error('Failed to get triage assessment')
      }
      
      const result = await response.json()
      setTriageResult(result)
    } catch (error) {
      console.error('Triage error:', error)
      // Fallback to mock result on error
      const mockResult = {
        urgencyLevel: 'moderate',
        summary: 'Unable to connect to AI service. This is a fallback assessment. Please consult a healthcare professional.',
        recommendations: [
          'Consult with a healthcare professional',
          'Monitor symptoms closely',
          'Seek immediate care if symptoms worsen'
        ],
        nearbyResources: [
          {
            name: 'Bay Area Urgent Care',
            type: 'Urgent Care',
            distance: '0.8 miles',
            waitTime: '15-30 min',
            phone: '(555) 123-4567'
          }
        ]
      }
      setTriageResult(mockResult)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAnalysisComplete = (result) => {
    setAnalysisResult(result)
  }

  const getUrgencyColor = (level) => {
    switch (level) {
      case 'high': return 'bg-red-100 text-red-800 border-red-300'
      case 'moderate': return 'bg-orange-100 text-orange-800 border-orange-300'
      case 'low': return 'bg-green-100 text-green-800 border-green-300'
      default: return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  const getPriorityBadge = (level) => {
    const colors = getUrgencyColor(level)
    return (
      <Badge className={`${colors} font-semibold px-3 py-1`}>
        {level?.toUpperCase()} PRIORITY
      </Badge>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-xl">
                <Stethoscope className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">TRIAGE A.I.</h1>
                <p className="text-sm text-gray-600">AI-Powered Medical Triage & Resource Navigator</p>
              </div>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
              <Shield className="h-4 w-4" />
              HIPAA Compliant
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Input Section */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-8 bg-white/90 backdrop-blur-sm border-gray-200 shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <Activity className="h-6 w-6 text-blue-600" />
                <h2 className="text-2xl font-semibold text-gray-800">Describe Your Symptoms</h2>
              </div>
              <p className="text-gray-600 mb-6">
                Tell us about your symptoms in detail. Our AI will help assess the urgency and guide you to appropriate care.
              </p>
              
              <div className="space-y-6">
                <div>
                  <Textarea
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                    placeholder="Describe your symptoms, pain level, duration, and any other relevant details..."
                    className="min-h-[120px] text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-1">
                    <Input
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="Your location (optional)"
                      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <Button variant="outline" className="px-6 border-gray-300 hover:bg-gray-50">
                    <Camera className="h-4 w-4 mr-2" />
                    Add Photo
                  </Button>
                </div>
                
                <div className="flex gap-4">
                  <Button 
                    onClick={handleTriage}
                    disabled={isLoading || !symptoms.trim()}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 text-base font-medium"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Analyzing Symptoms...
                      </>
                    ) : (
                      <>
                        <Stethoscope className="h-4 w-4 mr-2" />
                        Get Triage Assessment
                      </>
                    )}
                  </Button>
                  
                  <Button 
                    onClick={() => setShowAnalysis(!showAnalysis)}
                    variant="outline"
                    className="px-6 border-blue-300 text-blue-600 hover:bg-blue-50"
                  >
                    <BarChart3 className="h-4 w-4 mr-2" />
                    AI Analysis
                  </Button>
                </div>
              </div>
            </Card>

            {/* Enhanced AI Analysis Section */}
            {showAnalysis && (
              <SymptomAnalysis 
                symptoms={symptoms} 
                onAnalysisComplete={handleAnalysisComplete}
              />
            )}

            {/* Triage Results */}
            {triageResult && (
              <Card className="p-8 bg-white/90 backdrop-blur-sm border-gray-200 shadow-xl">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="h-6 w-6 text-orange-600" />
                    <h3 className="text-2xl font-semibold text-gray-800">Triage Assessment</h3>
                  </div>
                  {getPriorityBadge(triageResult.urgencyLevel)}
                </div>
                
                <div className="space-y-6">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-700 leading-relaxed">{triageResult.summary}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      Recommendations:
                    </h4>
                    <ul className="space-y-2">
                      {triageResult.recommendations?.map((rec, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-gray-700">{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Card>
            )}

            {/* Nearby Resources */}
            {triageResult?.nearbyResources && (
              <Card className="p-8 bg-white/90 backdrop-blur-sm border-gray-200 shadow-xl">
                <div className="flex items-center gap-3 mb-6">
                  <MapPin className="h-6 w-6 text-green-600" />
                  <h3 className="text-2xl font-semibold text-gray-800">Nearby Resources</h3>
                </div>
                
                <div className="grid gap-4">
                  {triageResult.nearbyResources.map((resource, index) => (
                    <div key={index} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-800">{resource.name}</h4>
                        <Badge variant="outline" className="text-xs">
                          {resource.type}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {resource.distance}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {resource.waitTime}
                        </span>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="ml-auto"
                        >
                          <Phone className="h-3 w-3 mr-1" />
                          Call
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Why TRIAGE A.I.? */}
            <Card className="p-6 bg-white/90 backdrop-blur-sm border-gray-200 shadow-xl">
              <div className="flex items-center gap-2 mb-4">
                <Heart className="h-5 w-5 text-red-500" />
                <h3 className="text-lg font-semibold text-gray-800">Why TRIAGE A.I.?</h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Brain className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-800">AI-Powered Analysis</h4>
                    <p className="text-sm text-gray-600">Advanced ML models trained on medical data</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-800">24/7 Availability</h4>
                    <p className="text-sm text-gray-600">Get help anytime, anywhere</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-purple-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-800">Local Resources</h4>
                    <p className="text-sm text-gray-600">Find nearby healthcare facilities</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-orange-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-800">Privacy First</h4>
                    <p className="text-sm text-gray-600">Your data stays secure and private</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Emergency Alert */}
            <Card className="p-6 bg-gradient-to-br from-red-50 to-pink-50 border-red-200 shadow-xl">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <h3 className="text-lg font-semibold text-red-800">Emergency?</h3>
              </div>
              <p className="text-red-700 text-sm mb-4">
                If you're experiencing a medical emergency, call 911 immediately or go to your nearest emergency room.
              </p>
              <Button className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold">
                <Phone className="h-4 w-4 mr-2" />
                Call 911
              </Button>
            </Card>

            {/* Analysis Insights */}
            {analysisResult && (
              <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 shadow-xl">
                <div className="flex items-center gap-2 mb-4">
                  <Eye className="h-5 w-5 text-blue-600" />
                  <h3 className="text-lg font-semibold text-blue-800">AI Insights</h3>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-blue-700">Condition Detected:</span>
                    <span className="font-medium text-blue-800">{analysisResult.condition}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-blue-700">Confidence Level:</span>
                    <span className="font-medium text-blue-800">{analysisResult.confidence}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-blue-700">Priority Level:</span>
                    <Badge className={getUrgencyColor(analysisResult.urgency)}>
                      {analysisResult.urgency}
                    </Badge>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-lg border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="text-center text-sm text-gray-600">
            <p className="mb-2">
              TRIAGE A.I. is not a substitute for professional medical advice. Always consult with healthcare professionals for medical concerns.
            </p>
            <p>© 2025 TRIAGE A.I. - Built for Bay2Bay Hacks 2025</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App

