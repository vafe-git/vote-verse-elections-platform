
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useVoting } from '@/contexts/VotingContext';
import { Vote, Users, UserCheck, Shield } from 'lucide-react';

const Index = () => {
  const { isAuthenticated, user } = useAuth();
  const { isVotingOpen, votes, candidates } = useVoting();

  const totalVotes = votes.length;
  const approvedCandidates = candidates.filter(c => c.approved).length;
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-2">
              <Vote className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">VoteVerse</span>
            </div>
            
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  <Badge variant={isVotingOpen ? "default" : "secondary"}>
                    {isVotingOpen ? "Voting Open" : "Voting Closed"}
                  </Badge>
                  <span className="text-sm text-gray-600">Welcome, {user?.name}</span>
                  {user?.role === 'voter' && !user?.hasVoted && isVotingOpen && (
                    <Button asChild className="vote-button-primary">
                      <Link to="/vote">Cast Your Vote</Link>
                    </Button>
                  )}
                  {user?.role === 'admin' && (
                    <Button asChild variant="outline">
                      <Link to="/admin">Admin Dashboard</Link>
                    </Button>
                  )}
                </>
              ) : (
                <Button asChild className="vote-button-primary">
                  <Link to="/login">Login to Vote</Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Student Union Elections
            <span className="text-blue-600"> 2024</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Your voice matters. Participate in shaping the future of our university by casting your vote for student leaders who will represent your interests.
          </p>
          
          {!isAuthenticated ? (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="text-lg px-8 py-3 vote-button-primary">
                <Link to="/login">Start Voting</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg px-8 py-3">
                <Link to="/register-candidate">Register as Candidate</Link>
              </Button>
            </div>
          ) : user?.hasVoted ? (
            <div className="flex flex-col items-center space-y-4">
              <div className="flex items-center space-x-2 text-green-600">
                <UserCheck className="h-6 w-6" />
                <span className="text-lg font-medium">You have successfully voted!</span>
              </div>
              <Button asChild variant="outline" size="lg">
                <Link to="/results">View Results</Link>
              </Button>
            </div>
          ) : isVotingOpen ? (
            <Button asChild size="lg" className="text-lg px-8 py-3 vote-button-primary">
              <Link to="/vote">Cast Your Vote Now</Link>
            </Button>
          ) : (
            <div className="text-center">
              <Badge variant="secondary" className="text-lg px-4 py-2 mb-4">
                Voting is Currently Closed
              </Badge>
              <Button asChild variant="outline" size="lg">
                <Link to="/results">View Results</Link>
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center vote-card">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <Vote className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle className="text-3xl font-bold text-blue-600">{totalVotes}</CardTitle>
                <CardDescription>Total Votes Cast</CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center vote-card">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle className="text-3xl font-bold text-green-600">{approvedCandidates}</CardTitle>
                <CardDescription>Approved Candidates</CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center vote-card">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle className="text-3xl font-bold text-purple-600">100%</CardTitle>
                <CardDescription>Secure & Anonymous</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">How It Works</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4">1</div>
              <h3 className="text-xl font-semibold mb-2">Login</h3>
              <p className="text-gray-600">Sign in with your student credentials to access the voting system.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4">2</div>
              <h3 className="text-xl font-semibold mb-2">Choose</h3>
              <p className="text-gray-600">Review candidates and their manifestos, then make your selection.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4">3</div>
              <h3 className="text-xl font-semibold mb-2">Vote</h3>
              <p className="text-gray-600">Cast your secure, anonymous vote and receive confirmation.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Vote className="h-8 w-8" />
            <span className="text-2xl font-bold">VoteVerse</span>
          </div>
          <p className="text-gray-400 mb-4">
            Secure, transparent, and accessible online voting for student union elections.
          </p>
          <div className="flex justify-center space-x-6 text-sm">
            <Link to="/results" className="hover:text-blue-400 transition-colors">Results</Link>
            <span className="text-gray-600">|</span>
            <span className="text-gray-400">University Student Union © 2024</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
