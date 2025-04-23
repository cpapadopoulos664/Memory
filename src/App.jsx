import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Button,
  TextField,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
} from '@mui/material';

function App() {
  const [currentDigit, setCurrentDigit] = useState(1);
  const [sequence, setSequence] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [isForward, setIsForward] = useState(true);
  const [isShowing, setIsShowing] = useState(false);
  const [isInput, setIsInput] = useState(false);
  const [history, setHistory] = useState([]);
  const [score, setScore] = useState({ forward: 0, backward: 0 });

  const generateSequence = (length) => {
    return Array.from({ length }, () => Math.floor(Math.random() * 10));
  };

  const startNewRound = () => {
    const newSequence = generateSequence(currentDigit);
    setSequence(newSequence);
    setIsShowing(true);
    setIsInput(false);
    setUserInput('');
  };

  const handleSubmit = () => {
    const userSequence = userInput.split('').map(Number);
    const isCorrect = isForward
      ? JSON.stringify(userSequence) === JSON.stringify(sequence)
      : JSON.stringify(userSequence) === JSON.stringify([...sequence].reverse());

    const newHistory = [...history, {
      type: isForward ? 'Forward' : 'Backward',
      sequence: sequence.join(''),
      userInput: userInput,
      correct: isCorrect,
      length: currentDigit
    }];

    setHistory(newHistory);

    if (isCorrect) {
      if (isForward) {
        setScore(prev => ({ ...prev, forward: currentDigit }));
        setIsForward(false);
      } else {
        setScore(prev => ({ ...prev, backward: currentDigit }));
        setCurrentDigit(prev => prev + 1);
        setIsForward(true);
      }
    } else {
      setIsForward(true);
    }

    setIsInput(false);
    setUserInput('');
  };

  useEffect(() => {
    if (isShowing) {
      const timer = setTimeout(() => {
        setIsShowing(false);
        setIsInput(true);
      }, 1000 * currentDigit);
      return () => clearTimeout(timer);
    }
  }, [isShowing, currentDigit]);

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Digit Span Test
        </Typography>
        
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5">
            {isForward ? 'Forward' : 'Backward'} Digit Span
          </Typography>
          <Typography variant="h6">
            Current Level: {currentDigit} digits
          </Typography>
          <Typography variant="h6">
            Forward Score: {score.forward} | Backward Score: {score.backward}
          </Typography>
        </Box>

        {!isShowing && !isInput && (
          <Button
            variant="contained"
            color="primary"
            onClick={startNewRound}
            sx={{ mb: 2 }}
          >
            Start New Round
          </Button>
        )}

        {isShowing && (
          <Box sx={{ my: 2 }}>
            <Typography variant="h4">
              {sequence.join(' ')}
            </Typography>
          </Box>
        )}

        {isInput && (
          <Box sx={{ my: 2 }}>
            <TextField
              fullWidth
              label="Enter the sequence"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </Box>
        )}

        <TableContainer component={Paper} sx={{ mt: 4 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Type</TableCell>
                <TableCell>Sequence</TableCell>
                <TableCell>Your Input</TableCell>
                <TableCell>Correct</TableCell>
                <TableCell>Length</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {history.map((entry, index) => (
                <TableRow key={index}>
                  <TableCell>{entry.type}</TableCell>
                  <TableCell>{entry.sequence}</TableCell>
                  <TableCell>{entry.userInput}</TableCell>
                  <TableCell>{entry.correct ? '✓' : '✗'}</TableCell>
                  <TableCell>{entry.length}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Container>
  );
}

export default App; 