
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useVoting } from '@/contexts/VotingContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Vote, ArrowLeft, User, FileText, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const CandidateRegistration = () => {
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    party: '',
    manifesto: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addCandidate } = useVoting();
  const navigate = useNavigate();
  const { toast } = useToast();

  const positions = [
    'President',
    'Vice President',
    'Secretary',
    'Treasurer',
    'Social Secretary',
    'Sports Secretary'
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.position || !formData.party || !formData.manifesto) {
      toast({
        title: "Incomplete Form",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    if (formData.manifesto.length < 50) {
      toast({
        title: "Manifesto Too Short",
        description: "Your manifesto should be at least 50 characters long.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      addCandidate({
        name: formData.name,
        position: formData.position,
        party: formData.party,
        manifesto: formData.manifesto
      });

      toast({
        title: "Registration Submitted!",
        description: "Your candidate registration has been submitted for admin approval.",
      });

      navigate('/');
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: "There was an error submitting your registration. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link to="/" className="flex items-center space-x-2 text-blue-600 hover:text-blue-700">
              <ArrowLeft className="h-4 w-4" />
              <Vote className="h-6 w-6" />
              <span className="text-xl font-bold">VoteVerse</span>
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Candidate Registration</h1>
          <p className="text-gray-600">
            Register to run for a student union position
          </p>
        </div>

        <Card className="vote-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="h-5 w-5 mr-2" />
              Registration Form
            </CardTitle>
            <CardDescription>
              Fill out this form to register as a candidate. Your registration will be reviewed by administrators before being approved.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  Personal Information
                </h3>
                
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Position Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Users className="h-4 w-4 mr-2" />
                  Position Details
                </h3>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="position">Position *</Label>
                    <Select value={formData.position} onValueChange={(value) => handleInputChange('position', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a position" />
                      </SelectTrigger>
                      <SelectContent>
                        {positions.map(position => (
                          <SelectItem key={position} value={position}>
                            {position}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="party">Party/Group *</Label>
                    <Input
                      id="party"
                      type="text"
                      placeholder="e.g., Unity Party, Independent"
                      value={formData.party}
                      onChange={(e) => handleInputChange('party', e.target.value)}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              {/* Manifesto */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <FileText className="h-4 w-4 mr-2" />
                  Your Manifesto
                </h3>
                
                <div className="space-y-2">
                  <Label htmlFor="manifesto">
                    Campaign Manifesto * 
                    <span className="text-sm text-gray-500 ml-1">
                      ({formData.manifesto.length}/500 characters)
                    </span>
                  </Label>
                  <Textarea
                    id="manifesto"
                    placeholder="Describe your goals, vision, and what you plan to achieve if elected. What makes you the right candidate for this position?"
                    value={formData.manifesto}
                    onChange={(e) => handleInputChange('manifesto', e.target.value)}
                    className="w-full min-h-[120px]"
                    maxLength={500}
                  />
                  <p className="text-xs text-gray-500">
                    Minimum 50 characters required. Be specific about your plans and qualifications.
                  </p>
                </div>
              </div>

              {/* Important Notice */}
              <Alert>
                <FileText className="h-4 w-4" />
                <AlertDescription>
                  <strong>Please note:</strong> Your registration will be reviewed by administrators before being approved. 
                  You will appear on the ballot only after approval. Make sure all information is accurate and complete.
                </AlertDescription>
              </Alert>

              {/* Submit Button */}
              <div className="pt-4">
                <Button
                  type="submit"
                  className="w-full text-lg py-3 vote-button-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting Registration...' : 'Submit Registration'}
                </Button>
              </div>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already registered? <Link to="/login" className="text-blue-600 hover:text-blue-700">Sign in here</Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Guidelines */}
        <Card className="vote-card mt-8">
          <CardHeader>
            <CardTitle className="text-lg">Registration Guidelines</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-gray-600">
            <div className="flex items-start space-x-2">
              <span className="font-semibold text-blue-600">•</span>
              <span>All candidates must be currently enrolled students</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="font-semibold text-blue-600">•</span>
              <span>Manifestos should clearly outline your goals and qualifications</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="font-semibold text-blue-600">•</span>
              <span>Registration approval typically takes 24-48 hours</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="font-semibold text-blue-600">•</span>
              <span>You can only run for one position per election</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CandidateRegistration;
