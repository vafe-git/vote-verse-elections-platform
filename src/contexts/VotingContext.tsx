
import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Candidate {
  id: string;
  name: string;
  position: string;
  party: string;
  manifesto: string;
  image?: string;
  voteCount: number;
  approved: boolean;
}

export interface Vote {
  id: string;
  voterId: string;
  candidateId: string;
  position: string;
  timestamp: Date;
  encrypted: boolean;
}

interface VotingContextType {
  candidates: Candidate[];
  votes: Vote[];
  isVotingOpen: boolean;
  submitVote: (candidateId: string, position: string) => Promise<boolean>;
  toggleVoting: () => void;
  addCandidate: (candidate: Omit<Candidate, 'id' | 'voteCount' | 'approved'>) => void;
  approveCandidate: (candidateId: string) => void;
  getResultsByPosition: (position: string) => Candidate[];
  hasUserVoted: (userId: string) => boolean;
}

const VotingContext = createContext<VotingContextType | undefined>(undefined);

export const useVoting = () => {
  const context = useContext(VotingContext);
  if (context === undefined) {
    throw new Error('useVoting must be used within a VotingProvider');
  }
  return context;
};

export const VotingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [votes, setVotes] = useState<Vote[]>([]);
  const [isVotingOpen, setIsVotingOpen] = useState(true);

  useEffect(() => {
    // Initialize with mock data
    const mockCandidates: Candidate[] = [
      {
        id: '1',
        name: 'Sarah Johnson',
        position: 'President',
        party: 'Unity Party',
        manifesto: 'Focused on improving campus facilities, mental health support, and academic resources. I believe in transparent governance and student-first policies.',
        voteCount: 0,
        approved: true
      },
      {
        id: '2',
        name: 'Michael Chen',
        position: 'President',
        party: 'Progress Alliance',
        manifesto: 'Committed to sustainability initiatives, diverse student activities, and bridging the gap between administration and students.',
        voteCount: 0,
        approved: true
      },
      {
        id: '3',
        name: 'Emma Williams',
        position: 'Vice President',
        party: 'Student Voice',
        manifesto: 'Advocating for affordable campus services, improved Wi-Fi infrastructure, and more study spaces.',
        voteCount: 0,
        approved: true
      },
      {
        id: '4',
        name: 'David Rodriguez',
        position: 'Vice President',
        party: 'Innovation Hub',
        manifesto: 'Focus on technology integration, career development programs, and international student support.',
        voteCount: 0,
        approved: true
      },
      {
        id: '5',
        name: 'Lisa Park',
        position: 'Secretary',
        party: 'Unity Party',
        manifesto: 'Ensuring efficient communication between student body and union, transparent record-keeping, and accessible information systems.',
        voteCount: 0,
        approved: true
      }
    ];

    setCandidates(mockCandidates);

    // Load stored data
    const storedVotes = localStorage.getItem('voteverse_votes');
    const storedVotingStatus = localStorage.getItem('voteverse_voting_open');
    
    if (storedVotes) {
      try {
        const parsedVotes = JSON.parse(storedVotes);
        setVotes(parsedVotes);
        
        // Update vote counts
        const voteCounts: { [key: string]: number } = {};
        parsedVotes.forEach((vote: Vote) => {
          voteCounts[vote.candidateId] = (voteCounts[vote.candidateId] || 0) + 1;
        });
        
        setCandidates(prev => prev.map(candidate => ({
          ...candidate,
          voteCount: voteCounts[candidate.id] || 0
        })));
      } catch (error) {
        console.error('Error parsing stored votes:', error);
      }
    }
    
    if (storedVotingStatus) {
      setIsVotingOpen(JSON.parse(storedVotingStatus));
    }
  }, []);

  const submitVote = async (candidateId: string, position: string): Promise<boolean> => {
    try {
      const newVote: Vote = {
        id: `vote-${Date.now()}`,
        voterId: `voter-${Date.now()}`, // In real app, get from auth context
        candidateId,
        position,
        timestamp: new Date(),
        encrypted: true
      };

      const updatedVotes = [...votes, newVote];
      setVotes(updatedVotes);
      localStorage.setItem('voteverse_votes', JSON.stringify(updatedVotes));

      // Update candidate vote count
      setCandidates(prev => prev.map(candidate => 
        candidate.id === candidateId 
          ? { ...candidate, voteCount: candidate.voteCount + 1 }
          : candidate
      ));

      return true;
    } catch (error) {
      console.error('Error submitting vote:', error);
      return false;
    }
  };

  const toggleVoting = () => {
    setIsVotingOpen(prev => {
      const newStatus = !prev;
      localStorage.setItem('voteverse_voting_open', JSON.stringify(newStatus));
      return newStatus;
    });
  };

  const addCandidate = (candidateData: Omit<Candidate, 'id' | 'voteCount' | 'approved'>) => {
    const newCandidate: Candidate = {
      ...candidateData,
      id: `candidate-${Date.now()}`,
      voteCount: 0,
      approved: false
    };
    
    setCandidates(prev => [...prev, newCandidate]);
  };

  const approveCandidate = (candidateId: string) => {
    setCandidates(prev => prev.map(candidate =>
      candidate.id === candidateId
        ? { ...candidate, approved: true }
        : candidate
    ));
  };

  const getResultsByPosition = (position: string): Candidate[] => {
    return candidates
      .filter(candidate => candidate.position === position && candidate.approved)
      .sort((a, b) => b.voteCount - a.voteCount);
  };

  const hasUserVoted = (userId: string): boolean => {
    return votes.some(vote => vote.voterId === userId);
  };

  const value = {
    candidates,
    votes,
    isVotingOpen,
    submitVote,
    toggleVoting,
    addCandidate,
    approveCandidate,
    getResultsByPosition,
    hasUserVoted
  };

  return <VotingContext.Provider value={value}>{children}</VotingContext.Provider>;
};
