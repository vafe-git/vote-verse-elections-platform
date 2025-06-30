
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Vote, ArrowLeft, User, Shield, GraduationCap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    const success = await login(email, password);
    
    if (success) {
      toast({
        title: "Login Successful",
        description: "Welcome to VoteVerse!",
      });
      navigate('/');
    } else {
      setError('Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-4">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Home</span>
          </Link>
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Vote className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">VoteVerse</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Sign In</h1>
          <p className="text-gray-600 mt-2">Access your voting account</p>
        </div>

        <Card className="vote-card">
          <CardHeader>
            <CardTitle>Login to Vote</CardTitle>
            <CardDescription>
              Select your role and enter your credentials
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="voter" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="voter" className="flex items-center space-x-1">
                  <User className="h-4 w-4" />
                  <span>Voter</span>
                </TabsTrigger>
                <TabsTrigger value="lecturer" className="flex items-center space-x-1">
                  <GraduationCap className="h-4 w-4" />
                  <span>Lecturer</span>
                </TabsTrigger>
                <TabsTrigger value="admin" className="flex items-center space-x-1">
                  <Shield className="h-4 w-4" />
                  <span>Admin</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="voter" className="space-y-4 mt-4">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email or Student ID</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@university.edu"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full"
                    />
                  </div>

                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <Button
                    type="submit"
                    className="w-full vote-button-primary"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Signing In...' : 'Sign In as Voter'}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="lecturer" className="space-y-4 mt-4">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="lecturer-email">Lecturer Email</Label>
                    <Input
                      id="lecturer-email"
                      type="email"
                      placeholder="lecturer@university.edu"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lecturer-password">Password</Label>
                    <Input
                      id="lecturer-password"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full"
                    />
                  </div>

                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <Button
                    type="submit"
                    className="w-full vote-button-primary"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Signing In...' : 'Sign In as Lecturer'}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="admin" className="space-y-4 mt-4">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="admin-email">Admin Email</Label>
                    <Input
                      id="admin-email"
                      type="email"
                      placeholder="admin@university.edu"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="admin-password">Admin Password</Label>
                    <Input
                      id="admin-password"
                      type="password"
                      placeholder="Enter admin password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full"
                    />
                  </div>

                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <Button
                    type="submit"
                    className="w-full vote-button-primary"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Signing In...' : 'Sign In as Admin'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 mb-4">
                Don't have an account? Contact your student union for registration.
              </p>
              
              <div className="border-t pt-4">
                <p className="text-sm text-gray-500 mb-2">Demo Accounts:</p>
                <div className="text-xs text-gray-400 space-y-1">
                  <div>Admin: admin@university.edu</div>
                  <div>Voter: voter@university.edu</div>
                  <div>Candidate: candidate@university.edu</div>
                  <div>Lecturer: lecturer@university.edu</div>
                  <div className="text-xs mt-2">Password: anything</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <Link
            to="/register-candidate"
            className="text-blue-600 hover:text-blue-700 text-sm"
          >
            Want to run for office? Register as a candidate →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
