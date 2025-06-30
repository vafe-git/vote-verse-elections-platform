
import { useAuth } from '@/contexts/AuthContext';
import { useVoting } from '@/contexts/VotingContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Vote, LogOut, Users, UserCheck, BarChart3, FileText, GraduationCap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const LecturerDashboard = () => {
  const { user, logout } = useAuth();
  const { candidates, votes, isVotingOpen } = useVoting();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    navigate('/');
  };

  const approvedCandidates = candidates.filter(c => c.approved);
  const totalVotes = votes.length;
  const participationRate = Math.round((totalVotes / 1000) * 100); // Mock calculation

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-2">
              <GraduationCap className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">Lecturer Dashboard</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <Badge variant={isVotingOpen ? "default" : "secondary"}>
                {isVotingOpen ? "Voting Open" : "Voting Closed"}
              </Badge>
              <span className="text-sm text-gray-600">Welcome, {user?.name}</span>
              <Button variant="outline" onClick={handleLogout} className="flex items-center space-x-2">
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Election Oversight Dashboard</h1>
          <p className="text-gray-600">Monitor the election process and review candidate information</p>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="vote-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Election Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Vote className="h-5 w-5 text-blue-600" />
                <span className="text-2xl font-bold text-gray-900">
                  {isVotingOpen ? 'Active' : 'Closed'}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="vote-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Votes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <UserCheck className="h-5 w-5 text-green-600" />
                <span className="text-2xl font-bold text-gray-900">{totalVotes}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="vote-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Candidates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-purple-600" />
                <span className="text-2xl font-bold text-gray-900">{approvedCandidates.length}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="vote-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Participation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-orange-600" />
                <span className="text-2xl font-bold text-gray-900">{participationRate}%</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Candidate Profiles */}
          <Card className="vote-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>Candidate Profiles</span>
              </CardTitle>
              <CardDescription>
                Review candidate information and manifestos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {approvedCandidates.length > 0 ? (
                approvedCandidates.map((candidate) => (
                  <div key={candidate.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">{candidate.name}</h3>
                        <Badge variant="outline" className="text-sm mt-1">
                          {candidate.position}
                        </Badge>
                      </div>
                      <Badge className="bg-green-100 text-green-800">
                        {candidate.party}
                      </Badge>
                    </div>
                    <div className="flex items-start space-x-2 text-sm text-gray-600">
                      <FileText className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <p className="leading-relaxed">{candidate.manifesto}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No approved candidates yet</p>
              )}
            </CardContent>
          </Card>

          {/* Election Statistics */}
          <Card className="vote-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5" />
                <span>Real-time Statistics</span>
              </CardTitle>
              <CardDescription>
                Current voting progress and metrics
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-600">Voter Turnout</span>
                  <span className="text-sm text-gray-900">{participationRate}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${participationRate}%` }}
                  ></div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Election Metrics</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Total Registered:</span>
                    <div className="font-semibold">1,000</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Votes Cast:</span>
                    <div className="font-semibold">{totalVotes}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Pending Votes:</span>
                    <div className="font-semibold">{1000 - totalVotes}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Positions:</span>
                    <div className="font-semibold">{[...new Set(approvedCandidates.map(c => c.position))].length}</div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Observer Notes</h4>
                <p className="text-sm text-blue-700">
                  Election is proceeding smoothly. No irregularities detected. 
                  Voting participation is within expected range.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Feedback Section */}
        <Card className="vote-card mt-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>Submit Observation Report</span>
            </CardTitle>
            <CardDescription>
              Record any observations or feedback about the voting process
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <textarea
                className="w-full p-3 border border-gray-300 rounded-lg resize-none"
                rows={4}
                placeholder="Enter your observations about the election process..."
              />
              <Button className="vote-button-primary">
                Submit Report
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LecturerDashboard;
