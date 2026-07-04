import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { evaluateAnswer } from '../api/interview';
import './Practice.css';

interface LocationState {
  sessionId: number;
  questions: string[];
  setupInfo: { role: string; level: string; company: string; topic: string };
}

function Practice() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState | null;

  const [questionIndex, setQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState<{ score: number; feedback: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);

  if (!state) {
    // someone landed here directly without going through setup
    navigate('/setup');
    return null;
  }

  const { sessionId, questions, setupInfo } = state;
  const currentQuestion = questions[questionIndex];
  const isLastQuestion = questionIndex === questions.length - 1;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await evaluateAnswer(sessionId, currentQuestion, answer);
      setFeedback(data);
      setShowFeedback(true);
    } catch (err) {
      setError('Could not evaluate answer. Try again.');
    } finally {
      setLoading(false);
    }
  }

  function handleNext() {
    if (isLastQuestion) {
      navigate('/history');
    } else {
      setQuestionIndex(questionIndex + 1);
      setAnswer('');
      setFeedback(null);
      setShowFeedback(false);
    }
  }

  function scoreClass(score: number) {
    if (score >= 8) return 'score-good';
    if (score >= 5) return 'score-mid';
    return 'score-low';
  }

  return (
    <div className="practice-page">
      <div className="practice-card">
        <div className="practice-header">
          <span className="practice-brand">PrepPilot</span>
        </div>

        <p className="practice-meta">
          Question {questionIndex + 1} of {questions.length} · {setupInfo.topic} · {setupInfo.company}
        </p>

        <div className="practice-stage">
          {!showFeedback ? (
            <form onSubmit={handleSubmit}>
              <p className="practice-question">{currentQuestion}</p>
              <textarea
                placeholder="Type your answer here..."
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                className="practice-textarea"
                required
                autoFocus
              />
              {error && <p className="practice-error">{error}</p>}
              <div className="practice-actions">
                <button type="submit" className="practice-button" disabled={loading}>
                  {loading ? 'Evaluating...' : 'Submit answer'}
                </button>
              </div>
            </form>
          ) : (
            feedback && (
              <div className="feedback-view">
                <div className="feedback-score-row">
                  <span className={`feedback-score ${scoreClass(feedback.score)}`}>{feedback.score}</span>
                  <span className="feedback-score-max">/ 10</span>
                </div>
                <p className="feedback-text">{feedback.feedback}</p>
                <div className="practice-actions">
                  <button className="practice-button-secondary" onClick={handleNext}>
                    {isLastQuestion ? 'Finish session' : 'Next question'}
                  </button>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}

export default Practice;