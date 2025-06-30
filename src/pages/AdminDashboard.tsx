
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useVoting } from '@/contexts/VotingContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Vote, ArrowLeft, Users, CheckCircle, XCircle, Download, Settings, BarChart3 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AdminDashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const { candidates, votes, isVotingOpen, toggleVoting, approveCandidate } = useVoting();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      toast({
        title: "Access Denied",
        description: "You need admin privileges to access this page.",
        variant: "destructive"
      });
      navigate('/');
    }
  }, [isAuthenticated, user, navigate, toast]);

  if (!isAuthenticated || user?.role !== 'admin') {
    return null;
  }

  const totalVotes = votes.length;
  const approvedCandidates = candidates.filter(c => c.approved);
  const pendingCandidates = candidates.filter(c => !c.approved);
  const positions = [...new Set(candidates.map(c => c.position))];

  const handleToggleVoting = () => {
    toggleVoting();
    toast({
      title: isVotingOpen ? "Voting Closed" : "Voting Opened",
      description: isVotingOpen 
        ? "The voting period has been closed. No more votes can be cast."
        : "Voting is now open. Students can now cast their votes.",
    });
  };

  const handleApproveCandidate = (candidateId: string, candidateName: string) => {
    approveCandidate(candidateId);
    toast({
      title: "Candidate Approved",
      description: `${candidateName} has been approved and is now visible to voters.`,
    });
  };

  const exportResults = () => {
    const resultsData = positions.map(position => {
      const positionCandidates = approvedCandidates.filter(c => c.position === position);
      const positionVotes = votes.filter(v => v.position === position).length;
      
      return {
        position,
        totalVotes: positionVotes,
        candidates: positionCandidates.map(candidate => ({
          name: candidate.name,
          party: candidate.party,
          votes: candidate.voteCount,
          percentage: positionVotes > 0 ? (candidate.voteCount / positionVotes * 100).toFixed(2) : '0.00'
        }))
      };
    });

    const dataStr = JSON.stringify(resultsData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `election-results-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Results Exported",
      description: "Election results have been downloaded as a JSON file.",
    });
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
              <span className="text-xl font-bold">VoteVerse Admin</span>
            </Link>
            
            <div className="flex items-center space-x-4">
              <Badge variant={isVotingOpen ? "default" : "secondary"}>
                {isVotingOpen ? "Voting Open" : "Voting Closed"}
              </Badge>
              <span className="text-sm text-gray-600">Admin: {user?.name}</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage elections, candidates, and monitor voting progress</p>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="vote-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Votes</CardTitle>
              <div className="text-2xl font-bold text-blue-600">{totalVotes}</div>
            </CardHeader>
          </Card>

          <Card className="vote-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Approved Candidates</CardTitle>
              <div className="text-2xl font-bold text-green-600">{approvedCandidates.length}</div>
            </CardHeader>
          </Card>

          <Card className="vote-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Pending Approval</CardTitle>
              <div className="text-2xl font-bold text-amber-600">{pendingCandidates.length}</div>
            </CardHeader>
          </Card>

          <Card className="vote-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Positions</CardTitle>
              <div className="text-2xl font-bold text-purple-600">{positions.length}</div>
            </CardHeader>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="candidates">Candidates</TabsTrigger>
            <TabsTrigger value="voting">Voting Control</TabsTrigger>
            <TabsTrigger value="results">Results</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="vote-card">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2" />
                    Voting Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {positions.map(position => {
                      const positionVotes = votes.filter(v => v.position === position).length;
                      return (
                        <div key={position} className="flex justify-between items-center">
                          <span className="font-medium">{position}</span>
                          <Badge variant="outline">{positionVotes} votes</Badge>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card className="vote-card">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Settings className="h-5 w-5 mr-2" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Voting Status</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">
                        {isVotingOpen ? 'Open' : 'Closed'}
                      </span>
                      <Switch
                        checked={isVotingOpen}
                        onCheckedChange={handleToggleVoting}
                      />
                    </div>
                  </div>

                  <Button onClick={exportResults} className="w-full" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export Results
                  </Button>

                  <Button asChild className="w-full" variant="outline">
                    <Link to="/results">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      View Live Results
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="candidates" className="space-y-6">
            {pendingCandidates.length > 0 && (
              <Alert>
                <Users className="h-4 w-4" />
                <AlertDescription>
                  You have {pendingCandidates.length} candidate(s) waiting for approval.
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-6">
              {/* Pending Candidates */}
              {pendingCandidates.length > 0 && (
                <Card className="vote-card">
                  <CardHeader>
                    <CardTitle className="text-amber-600">Pending Approval</CardTitle>
                    <CardDescription>
                      Review and approve candidates before they appear on the ballot
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Position</TableHead>
                          <TableHead>Party</TableHead>
                          <TableHead>Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {pendingCandidates.map(candidate => (
                          <TableRow key={candidate.id}>
                            <TableCell className="font-medium">{candidate.name}</TableCell>
                            <TableCell>{candidate.position}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{candidate.party}</Badge>
                            </TableCell>
                            <TableCell>
                              <Button
                                size="sm"
                                onClick={() => handleApproveCandidate(candidate.id, candidate.name)}
                                className="vote-button-primary"
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Approve
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              )}

              {/* Approved Candidates */}
              <Card className="vote-card">
                <CardHeader>
                  <CardTitle className="text-green-600">Approved Candidates</CardTitle>
                  <CardDescription>
                    Candidates currently visible to voters
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Position</TableHead>
                        <TableHead>Party</TableHead>
                        <TableHead>Votes</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {approvedCandidates.map(candidate => (
                        <TableRow key={candidate.id}>
                          <TableCell className="font-medium">{candidate.name}</TableCell>
                          <TableCell>{candidate.position}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{candidate.party}</Badge>
                          </TableCell>
                          <TableCell className="font-bold">{candidate.voteCount}</TableCell>
                          <TableCell>
                            <Badge className="bg-green-100 text-green-800">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Approved
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="voting" className="space-y-6">
            <Card className="vote-card">
              <CardHeader>
                <CardTitle>Voting Control</CardTitle>
                <CardDescription>
                  Manage the voting process and election timeline
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-semibold">Voting Status</h3>
                    <p className="text-sm text-gray-600">
                      {isVotingOpen 
                        ? 'Students can currently cast their votes' 
                        : 'Voting is closed - no votes can be cast'
                      }
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge variant={isVotingOpen ? "default" : "secondary"}>
                      {isVotingOpen ? "OPEN" : "CLOSED"}
                    </Badge>
                    <Switch
                      checked={isVotingOpen}
                      onCheckedChange={handleToggleVoting}
                    />
                  </div>
                </div>

                <Alert>
                  <Settings className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Important:</strong> Closing voting will prevent any new votes from being cast. 
                    Make sure all eligible students have had the opportunity to vote before closing.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="results" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Election Results</h2>
                <p className="text-gray-600">
                  {isVotingOpen ? 'Live results - updates as votes are cast' : 'Final results'}
                </p>
              </div>
              <div className="space-x-2">
                <Button onClick={exportResults} variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export Data
                </Button>
                <Button asChild>
                  <Link to="/results">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Full Results View
                  </Link>
                </Button>
              </div>
            </div>

            <div className="space-y-6">
              {positions.map(position => {
                const positionCandidates = approvedCandidates
                  .filter(c => c.position === position)
                  .sort((a, b) => b.voteCount - a.voteCount);
                const positionVotes = votes.filter(v => v.position === position).length;

                return (
                  <Card key={position} className="vote-card">
                    <CardHeader>
                      <CardTitle>{position}</CardTitle>
                      <CardDescription>{positionVotes} votes cast</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Rank</TableHead>
                            <TableHead>Candidate</TableHead>
                            <TableHead>Party</TableHead>
                            <TableHead>Votes</TableHead>
                            <TableHead>Percentage</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {positionCandidates.map((candidate, index) => {
                            const percentage = positionVotes > 0 ? (candidate.voteCount / positionVotes * 100) : 0;
                            return (
                              <TableRow key={candidate.id} className={index === 0 ? 'bg-yellow-50' : ''}>
                                <TableCell>
                                  <div className="flex items-center">
                                    {index === 0 && <span className="text-yellow-500 mr-1">🏆</span>}
                                    #{index + 1}
                                  </div>
                                </TableCell>
                                <TableCell className="font-medium">{candidate.name}</TableCell>
                                <TableCell>
                                  <Badge variant="outline">{candidate.party}</Badge>
                                </TableCell>
                                <TableCell className="font-bold">{candidate.voteCount}</TableCell>
                                <TableCell>{percentage.toFixed(1)}%</TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
