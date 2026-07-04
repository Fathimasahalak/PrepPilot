import { useEffect, useState } from 'react';
import { getSessions } from '../api/interview';
import './History.css';

interface QuestionAnswer {
  question: string;
  userAnswer: string;
  score: number;
  feedback: string;
}

interface SessionData {
  id: number;
  role: string;
  level: string;
  company: string;
  topic: string;
  createdAt: string;
  questionAnswers: QuestionAnswer[];
}

function History() {
  const [sessions, setSessions] = useState<SessionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useEffect(() => {
    async function fetchSessions() {
      try {
        const data = await getSessions();
        setSessions(data);
      } catch (err) {
        setError('Could not load your sessions.');
      } finally {
        setLoading(false);
      }
    }
    fetchSessions();
  }, []);

  function averageScore(qas: QuestionAnswer[]) {
    if (qas.length === 0) return null;
    const total = qas.reduce((sum, qa) => sum + qa.score, 0);
    return (total / qas.length).toFixed(1);
  }

  function scoreClass(avg: number) {
    if (avg >= 8) return 'score-good';
    if (avg >= 5) return 'score-mid';
    return 'score-low';
  }

  return (
    <div className="history-page">
      <div className="history-card">
        <div className="history-header">
          <span className="history-title">Your sessions</span>
          <span className="history-count">{sessions.length} total</span>
        </div>

        {loading && <p className="history-status">Loading...</p>}
        {error && <p className="history-status">{error}</p>}
        {!loading && sessions.length === 0 && (
          <p className="history-status">No sessions yet. Start practicing to see your history here.</p>
        )}

        <div className="history-list">
          {sessions.map((session) => {
            const avg = averageScore(session.questionAnswers);
            const isExpanded = expandedId === session.id;
            return (
              <div key={session.id} className="history-item">
                <div
                  className="history-row"
                  onClick={() => setExpandedId(isExpanded ? null : session.id)}
                >
                  <div>
                    <p className="history-role">{session.role}</p>
                    <p className="history-meta">
                      {session.company} · {session.topic} · {session.level}
                    </p>
                  </div>
                  {avg !== null && (
                    <span className={`history-score ${scoreClass(parseFloat(avg))}`}>{avg}</span>
                  )}
                </div>

                {isExpanded && (
                  <div className="history-detail">
                    {session.questionAnswers.map((qa, i) => (
                      <div key={i} className="history-qa">
                        <p className="history-qa-question">{qa.question}</p>
                        <p className="history-qa-answer">{qa.userAnswer}</p>
                        <p className="history-qa-feedback">
                          <span className={scoreClass(qa.score)}>{qa.score}/10</span> — {qa.feedback}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default History;