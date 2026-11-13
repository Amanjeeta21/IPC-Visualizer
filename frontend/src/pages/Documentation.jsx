import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  GitBranch,
  Terminal,
  Workflow,
} from "lucide-react";
import { Link } from "react-router-dom";

function Documentation() {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">
            <GitBranch size={21} strokeWidth={2.5} />
          </div>

          <div>
            <h1>IPC-Visualizer</h1>
            <p>Operating Systems Lab</p>
          </div>
        </div>

        <nav className="navigation">
          <Link className="nav-item" to="/">
            <Workflow size={18} />
            <span>Visualizer</span>
          </Link>

          <Link className="nav-item active" to="/documentation">
            <BookOpen size={18} />
            <span>Documentation</span>
          </Link>
        </nav>

        <div className="sidebar-bottom">
          <div className="system-status">
            <span className="status-dot"></span>

            <div>
              <span className="status-label">SYSTEM STATUS</span>
              <strong>Operational</strong>
            </div>
          </div>

          <div className="version">
            IPC-VISUALIZER v1.0.0
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <div className="breadcrumb">
              <span>OS LAB</span>
              <ArrowLeft size={13} />
              <span className="current">DOCUMENTATION</span>
            </div>

            <h2>Understanding pipe()</h2>

            <p>
              Learn how the operating system enables communication between
              processes.
            </p>
          </div>
        </header>

        <section className="content documentation">
          <div className="doc-hero">
            <span className="section-kicker">INTER-PROCESS COMMUNICATION</span>

            <h3>
              One process writes.
              <br />
              Another process reads.
            </h3>

            <p>
              A pipe is a unidirectional communication channel provided by
              the operating system. It allows data written by one process
              to be read by another process.
            </p>
          </div>

          <div className="documentation-grid">
            <div className="doc-card">
              <div className="doc-icon">
                <GitBranch size={21} />
              </div>

              <span className="section-kicker">01</span>

              <h3>What is IPC?</h3>

              <p>
                Inter-Process Communication allows independent processes
                to exchange information and coordinate their execution.
              </p>
            </div>

            <div className="doc-card">
              <div className="doc-icon">
                <Terminal size={21} />
              </div>

              <span className="section-kicker">02</span>

              <h3>What is pipe()?</h3>

              <p>
                The pipe() system call creates a communication channel
                represented by two file descriptors.
              </p>
            </div>

            <div className="doc-card">
              <div className="doc-icon">
                <Workflow size={21} />
              </div>

              <span className="section-kicker">03</span>

              <h3>How it works</h3>

              <p>
                The parent writes data into the pipe and the child reads
                that data from the other end.
              </p>
            </div>
          </div>

          <div className="flow-card">
            <div className="section-kicker">PIPE COMMUNICATION FLOW</div>

            <div className="doc-flow">
              <div>
                <strong>Parent Process</strong>
                <span>PID 1024</span>
              </div>

              <div className="flow-operation">
                <span>write()</span>
                <div className="flow-arrow"></div>
              </div>

              <div className="pipe-box">
                <GitBranch size={20} />
                <strong>PIPE</strong>
                <span>fd[1] → fd[0]</span>
              </div>

              <div className="flow-operation">
                <span>read()</span>
                <div className="flow-arrow"></div>
              </div>

              <div>
                <strong>Child Process</strong>
                <span>PID 1025</span>
              </div>
            </div>
          </div>

          <div className="descriptor-card">
            <div>
              <span className="section-kicker">FILE DESCRIPTORS</span>
              <h3>The two ends of the pipe</h3>
            </div>

            <div className="descriptor-grid">
              <div>
                <span>fd[0]</span>
                <strong>Read End</strong>
                <p>Used by the receiving process to read data.</p>
              </div>

              <div>
                <span>fd[1]</span>
                <strong>Write End</strong>
                <p>Used by the sending process to write data.</p>
              </div>
            </div>
          </div>

          <div className="code-card">
            <div className="code-header">
              <div>
                <span className="section-kicker">SYSTEM CALL SEQUENCE</span>
                <h3>Core implementation</h3>
              </div>

              <span>C</span>
            </div>

            <pre>
{`int fd[2];

pipe(fd);

pid_t pid = fork();

if (pid > 0) {
    close(fd[0]);
    write(fd[1], message, strlen(message));
    close(fd[1]);
}
else {
    close(fd[1]);
    read(fd[0], buffer, sizeof(buffer));
    close(fd[0]);
}`}
            </pre>
          </div>

          <div className="success-card">
            <CheckCircle2 size={23} />

            <div>
              <strong>Ready to visualize?</strong>
              <p>
                Return to the simulator and execute the complete
                Parent → Pipe → Child communication flow.
              </p>
            </div>

            <Link to="/">
              Open Visualizer
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Documentation;