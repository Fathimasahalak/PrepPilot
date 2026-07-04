import { useNavigate } from 'react-router-dom';
import './Landing.css';

function Landing() {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      <div className="landing-content">
        <p className="landing-brand">PrepPilot</p>
        <h1 className="landing-tagline">Practice with intent. Walk in ready.</h1>
        <p className="landing-subtext">
          AI-generated interview questions, honest feedback, and a record of how far you've come.
        </p>
        <button className="landing-button" onClick={() => navigate('/signup')}>
          Get started
        </button>
        <p className="landing-footer">
          Already have an account? <span className="landing-link" onClick={() => navigate('/login')}>Log in</span>
        </p>
      </div>
    </div>
  );
}

export default Landing;