
import { Link } from 'react-router-dom';
import { useVoting } from '@/contexts/VotingContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Vote, ArrowLeft, Trophy, Users, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const Results = () => {
  const { candidates, votes, isVotingOpen } = useVoting();
  
  const approvedCandidates = candidates.filter(c => c.approved);
  const positions = [...new Set(approvedCandidates.map(c => c.position))];
  const totalVotes = votes.length;

  const getPositionResults = (position: string) => {
    const positionCandidates = approvedCandidates.filter(c => c.position === position);
    const positionVotes = votes.filter(v => v.position === position).length;
    
    return positionCandidates
      .map(candidate => ({
        ...candidate,
        percentage: positionVotes > 0 ? (candidate.voteCount / positionVotes) * 100 : 0
      }))
      .sort((a, b) => b.voteCount - a.voteCount);
  };

  const getChartData = (position: string) => {
    return getPositionResults(position).map(candidate => ({
      name: candidate.name,
      votes: candidate.voteCount,
      percentage: candidate.percentage
    }));
  };

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

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
              <Badge variant={isVotingOpen ? "default" : "secondary"}>
                {isVotingOpen ? "Live Results" : "Final Results"}
              </Badge>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Election Results</h1>
          <p className="text-gray-600 text-lg">
            {isVotingOpen ? 'Live results - votes are still being counted' : 'Final election results'}
          </p>
        </div>

        {/* Overview Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="vote-card text-center">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                <Vote className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle className="text-3xl font-bold text-blue-600">{totalVotes}</CardTitle>
              <p className="text-gray-600">Total Votes Cast</p>
            </CardHeader>
          </Card>

          <Card className="vote-card text-center">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-2">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle className="text-3xl font-bold text-green-600">{approvedCandidates.length}</CardTitle>
              <p className="text-gray-600">Candidates</p>
            </CardHeader>
          </Card>

          <Card className="vote-card text-center">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-2">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <CardTitle className="text-3xl font-bold text-purple-600">{positions.length}</CardTitle>
              <p className="text-gray-600">Positions</p>
            </CardHeader>
          </Card>
        </div>

        {/* Results by Position */}
        <div className="space-y-12">
          {positions.map(position => {
            const results = getPositionResults(position);
            const chartData = getChartData(position);
            const winner = results[0];
            const positionVotes = votes.filter(v => v.position === position).length;

            return (
              <div key={position} className="bg-white rounded-xl border border-gray-200 p-8">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                    <Trophy className="h-6 w-6 mr-2 text-yellow-500" />
                    {position}
                  </h2>
                  <Badge variant="outline" className="text-sm">
                    {positionVotes} votes cast
                  </Badge>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                  {/* Candidates List */}
                  <div className="space-y-4">
                    {results.map((candidate, index) => (
                      <Card 
                        key={candidate.id} 
                        className={`${index === 0 ? 'ring-2 ring-yellow-400 bg-yellow-50' : ''} transition-all`}
                      >
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-3">
                              {index === 0 && <Trophy className="h-5 w-5 text-yellow-500" />}
                              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                                {candidate.name.split(' ').map(n => n[0]).join('')}
                              </div>
                              <div>
                                <h3 className="font-semibold text-gray-900">{candidate.name}</h3>
                                <Badge variant="outline" className="text-xs">
                                  {candidate.party}
                                </Badge>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-gray-900">{candidate.voteCount}</div>
                              <div className="text-sm text-gray-600">{candidate.percentage.toFixed(1)}%</div>
                            </div>
                          </div>
                          
                          <Progress value={candidate.percentage} className="h-2" />
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* Charts */}
                  <div className="space-y-6">
                    {/* Bar Chart */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-4">Vote Distribution</h4>
                      <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis 
                            dataKey="name" 
                            angle={-45}
                            textAnchor="end"
                            height={80}
                            fontSize={12}
                          />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="votes" fill="#3B82F6" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Pie Chart */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-4">Percentage Share</h4>
                      <ResponsiveContainer width="100%" height={200}>
                        <PieChart>
                          <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percentage }) => `${name}: ${percentage.toFixed(1)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="votes"
                          >
                            {chartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                {/* Winner Announcement */}
                {winner && winner.voteCount > 0 && (
                  <div className="mt-8 p-6 bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Trophy className="h-8 w-8 text-yellow-500" />
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">
                          {isVotingOpen ? 'Current Leader' : 'Winner'}: {winner.name}
                        </h3>
                        <p className="text-gray-600">
                          Leading with {winner.voteCount} votes ({winner.percentage.toFixed(1)}% of total)
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div className="text-center mt-12">
          <div className="space-y-4">
            {isVotingOpen && (
              <p className="text-gray-600">
                Results will update automatically as votes are cast.
              </p>
            )}
            <Button asChild variant="outline" size="lg">
              <Link to="/">Back to Home</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;
