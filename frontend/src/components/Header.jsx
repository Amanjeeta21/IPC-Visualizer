import { RotateCcw, Workflow, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";

function Header({ onReset, step = 0 }) {
  const navigate = useNavigate();

  return (
    <header className="topbar">
      <div className="topbar-brand">
        <div className="brand-icon">
          <Workflow size={20} />
        </div>

        <div className="brand-copy">
          <strong>IPC VISUALIZER</strong>
        </div>
      </div>

      <div className="topbar-actions">
        <span className={`live-indicator ${step === 6 ? "completed" : ""}`}>
          <span className="status-dot" />
          {step === 6 ? "RUN COMPLETED" : "SIMULATION MODE"}
        </span>

        <button
          type="button"
          className="header-reset-button"
          onClick={() => navigate("/documentation")}
          title="Open documentation"
        >
          <BookOpen size={14} />
          <span>DOCUMENTATION</span>
        </button>

        <button
          type="button"
          className="header-reset-button"
          onClick={onReset}
          title="Reset the simulation"
        >
          <RotateCcw size={14} />
          <span>RESET</span>
        </button>
      </div>
    </header>
  );
}

export default Header;