
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useVoting } from '@/contexts/VotingContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Vote, ArrowLeft, CheckCircle, User, FileText, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const VotingBooth = () => {
  const { user, isAuthenticated } = useAuth();
  const { candidates, isVotingOpen, submitVote } = useVoting();
  const [selectedCandidates, setSelectedCandidates] = useState<{ [position: string]: string }>({});
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Check if user has already voted
    if (user?.hasVoted) {
      toast({
        title: "Already Voted",
        description: "You have already cast your vote in this election.",
        variant: "destructive"
      });
      navigate('/');
      return;
    }

    if (!isVotingOpen) {
      toast({
        title: "Voting Closed",
        description: "The voting period has ended.",
        variant: "destructive"
      });
      navigate('/');
      return;
    }
  }, [isAuthenticated, user, isVotingOpen, navigate, toast]);

  if (!isAuthenticated || user?.hasVoted || !isVotingOpen) {
    return null;
  }

  // Double-check voting eligibility
  const votingRecords = JSON.parse(localStorage.getItem('voteverse_voting_records') || '[]');
  const hasAlreadyVoted = votingRecords.some((record: any) => record.voterEmail === user?.email);

  if (hasAlreadyVoted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full vote-card">
          <CardContent className="p-8 text-center">
            <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Already Voted</h2>
            <p className="text-gray-600 mb-6">You have already voted in this election. Each voter can only vote once.</p>
            <Button asChild className="vote-button-primary">
              <Link to="/">Return to Home</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const approvedCandidates = candidates.filter(c => c.approved);
  const positions = [...new Set(approvedCandidates.map(c => c.position))];

  const handleCandidateSelect = (position: string, candidateId: string) => {
    setSelectedCandidates(prev => ({
      ...prev,
      [position]: candidateId
    }));
  };

  const handleSubmitVote = async () => {
    setIsSubmitting(true);
    
    try {
      // Submit votes for each position
      const votePromises = Object.entries(selectedCandidates).map(([position, candidateId]) =>
        submitVote(candidateId, position)
      );
      
      const results = await Promise.all(votePromises);
      
      if (results.every(result => result)) {
        // Record that this user has voted
        const votingRecord = {
          voterEmail: user?.email,
          voterId: user?.id,
          timestamp: new Date().toISOString(),
          votes: selectedCandidates
        };
        
        const existingRecords = JSON.parse(localStorage.getItem('voteverse_voting_records') || '[]');
        existingRecords.push(votingRecord);
        localStorage.setItem('voteverse_voting_records', JSON.stringify(existingRecords));
        
        // Update user's voting status
        if (user) {
          const updatedUser = { ...user, hasVoted: true };
          localStorage.setItem('voteverse_user', JSON.stringify(updatedUser));
        }
        
        toast({
          title: "Vote Submitted Successfully!",
          description: "Your vote has been recorded securely and anonymously.",
        });
        
        navigate('/');
      } else {
        throw new Error('Some votes failed to submit');
      }
    } catch (error) {
      console.error('Error submitting votes:', error);
      toast({
        title: "Vote Submission Failed",
        description: "There was an error submitting your vote. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
      setShowConfirmDialog(false);
    }
  };

  const canSubmit = positions.length > 0 && positions.every(position => selectedCandidates[position]);

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
            
            <div className="flex items-center space-x-4">
              <Badge className="bg-green-100 text-green-800">
                Voting in Progress
              </Badge>
              <span className="text-sm text-gray-600">Welcome, {user?.name}</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Cast Your Vote</h1>
          <p className="text-gray-600">
            Select one candidate for each position. Your vote is secure and anonymous.
          </p>
        </div>

        {/* Voting Instructions */}
        <Alert className="mb-8">
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Important:</strong> You can only vote once. Please review your selections carefully before submitting.
            Once submitted, your votes cannot be changed.
          </AlertDescription>
        </Alert>

        {/* Voting Sections by Position */}
        <div className="space-y-8">
          {positions.map(position => {
            const positionCandidates = approvedCandidates.filter(c => c.position === position);
            
            return (
              <div key={position} className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <User className="h-6 w-6 mr-2 text-blue-600" />
                  {position}
                </h2>
                
                <div className="grid gap-4">
                  {positionCandidates.map(candidate => (
                    <Card
                      key={candidate.id}
                      className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                        selectedCandidates[position] === candidate.id
                          ? 'ring-2 ring-blue-500 bg-blue-50'
                          : 'hover:bg-gray-50'
                      }`}
                      onClick={() => handleCandidateSelect(position, candidate.id)}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-3">
                              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                {candidate.name.split(' ').map(n => n[0]).join('')}
                              </div>
                              <div>
                                <h3 className="text-xl font-semibold text-gray-900">{candidate.name}</h3>
                                <Badge variant="outline" className="text-sm">
                                  {candidate.party}
                                </Badge>
                              </div>
                            </div>
                            
                            <div className="flex items-start space-x-2 text-gray-600">
                              <FileText className="h-4 w-4 mt-1 flex-shrink-0" />
                              <p className="text-sm leading-relaxed">{candidate.manifesto}</p>
                            </div>
                          </div>
                          
                          <div className="ml-4">
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                              selectedCandidates[position] === candidate.id
                                ? 'border-blue-500 bg-blue-500'
                                : 'border-gray-300'
                            }`}>
                              {selectedCandidates[position] === candidate.id && (
                                <CheckCircle className="h-4 w-4 text-white" />
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Submit Section */}
        <div className="mt-12 text-center">
          <div className="bg-white rounded-xl border border-gray-200 p-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Review Your Selections</h3>
            
            {positions.length > 0 ? (
              <div className="space-y-2 mb-6">
                {positions.map(position => {
                  const selectedCandidate = selectedCandidates[position] 
                    ? candidates.find(c => c.id === selectedCandidates[position])
                    : null;
                  
                  return (
                    <div key={position} className="flex justify-between items-center py-2 px-4 bg-gray-50 rounded-lg">
                      <span className="font-medium text-gray-700">{position}:</span>
                      <span className="text-gray-900">
                        {selectedCandidate ? selectedCandidate.name : 'No selection'}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-600 mb-6">No positions available for voting.</p>
            )}

            <Button
              onClick={() => setShowConfirmDialog(true)}
              disabled={!canSubmit}
              size="lg"
              className="px-8 py-3 text-lg vote-button-primary"
            >
              Submit My Vote
            </Button>
            
            {!canSubmit && positions.length > 0 && (
              <p className="text-sm text-red-600 mt-2">
                Please select a candidate for all positions before submitting.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Your Vote</DialogTitle>
            <DialogDescription>
              Are you sure you want to submit your vote? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-2">
            {positions.map(position => {
              const selectedCandidate = candidates.find(c => c.id === selectedCandidates[position]);
              return (
                <div key={position} className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded">
                  <span className="font-medium">{position}:</span>
                  <span>{selectedCandidate?.name}</span>
                </div>
              );
            })}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmitVote}
              disabled={isSubmitting}
              className="vote-button-primary"
            >
              {isSubmitting ? 'Submitting...' : 'Confirm Vote'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VotingBooth;
