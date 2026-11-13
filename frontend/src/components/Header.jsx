
import { Activity, BookOpen, GitBranch, RotateCcw } from "lucide-react";
import { Link } from "react-router-dom";

function Header({ onReset, step = 0 }) {
  const status =
    step === 6 ? "RUN COMPLETED" : step > 0 ? "EXECUTION ACTIVE" : "READY TO EXECUTE";

  return (
    <header className="topbar">
      <div className="topbar-brand">
        <div className="brand-mark">
          <GitBranch size={20} />
        </div>
        <div className="brand-copy">
          <strong>IPC / VISUALIZER</strong>
          <span>OPERATING SYSTEMS LAB</span>
        </div>
      </div>

      <div className="topbar-actions">
        <div className={`live-indicator ${step === 6 ? "completed" : ""}`}>
          <span />
          {status}
        </div>

        <Link className="documentation-link" to="/documentation">
          <BookOpen size={15} />
          Documentation
        </Link>

        <button className="reset-button" onClick={onReset}>
          <RotateCcw size={15} />
          Reset
        </button>
      </div>
    </header>
  );
}

export default Header;
