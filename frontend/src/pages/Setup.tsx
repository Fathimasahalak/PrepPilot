import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateQuestions } from '../api/interview';
import './Setup.css';

const steps = ['role', 'level', 'company', 'topic'] as const;
type StepKey = typeof steps[number];

const stepConfig: Record<StepKey, { question: string; placeholder: string }> = {
  role: { question: 'Which role are you preparing for?', placeholder: 'e.g. Java Full Stack Developer' },
  level: { question: "What's your experience level?", placeholder: 'e.g. Fresher' },
  company: { question: 'Which company are you preparing for?', placeholder: 'e.g. Cognizant' },
  topic: { question: 'Which topic do you want to focus on?', placeholder: 'e.g. Spring Boot' },
};

function Setup() {
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<StepKey, string>>({
    role: '', level: '', company: '', topic: '',
  });
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const currentKey = steps[stepIndex];
  const current = stepConfig[currentKey];

  async function handleContinue(e: React.FormEvent) {
    e.preventDefault();
    const updatedAnswers = { ...answers, [currentKey]: inputValue };
    setAnswers(updatedAnswers);
    setInputValue('');

    if (stepIndex < steps.length - 1) {
      setStepIndex(stepIndex + 1);
    } else {
      // last step - submit everything to backend
      setLoading(true);
      setError('');
      try {
        const data = await generateQuestions(
          updatedAnswers.role,
          updatedAnswers.level,
          updatedAnswers.company,
          updatedAnswers.topic
        );
        navigate('/practice', {
          state: {
            sessionId: data.sessionId,
            questions: data.questions,
            setupInfo: updatedAnswers,
          },
        });
      } catch (err) {
        setError('Something went wrong generating questions. Try again.');
        setLoading(false);
      }
    }
  }

  function handleBack() {
    if (stepIndex > 0) {
      setInputValue(answers[steps[stepIndex - 1]]);
      setStepIndex(stepIndex - 1);
    }
  }

  return (
    <div className="setup-page">
      <div className="setup-card">
        <p className="setup-step-label">Step {stepIndex + 1} of {steps.length}</p>
        <form onSubmit={handleContinue}>
          <p className="setup-question">{current.question}</p>
          <input
            type="text"
            placeholder={current.placeholder}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="setup-input"
            required
            autoFocus
          />

          {error && <p className="setup-error">{error}</p>}

          <div className="setup-actions">
            {stepIndex > 0 ? (
              <span className="setup-back" onClick={handleBack}>Back</span>
            ) : <span />}
            <button type="submit" className="setup-button" disabled={loading}>
              {loading ? 'Generating...' : stepIndex === steps.length - 1 ? 'Start practice' : 'Continue'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Setup;