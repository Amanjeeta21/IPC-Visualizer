
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  CheckCircle2,
  Code2,
  Cpu,
  Database,
  GitBranch,
  Layers,
  Terminal,
  Workflow,
} from "lucide-react";
import { Link } from "react-router-dom";
import "../styles/documentation.css";

const lifecycle = [
  {
    number: "01",
    title: "Create the pipe",
    operation: "pipe()",
    description:
      "The operating system creates a communication channel and returns two file descriptors.",
    detail: "fd[0] = Read end    fd[1] = Write end",
  },
  {
    number: "02",
    title: "Create a child",
    operation: "fork()",
    description:
      "The process creates a child process. The child inherits copies of the parent's open file descriptors.",
    detail: "Parent PID 1024  →  Child PID 1025",
  },
  {
    number: "03",
    title: "Write the message",
    operation: "write()",
    description:
      "The parent sends bytes through the write end of the pipe. The data enters the pipe buffer.",
    detail: "Parent → fd[1] → Pipe buffer",
  },
  {
    number: "04",
    title: "Store the data",
    operation: "PIPE BUFFER",
    description:
      "The pipe temporarily holds the written data until the receiving process reads it.",
    detail: "Message waits inside the buffer",
  },
  {
    number: "05",
    title: "Read the message",
    operation: "read()",
    description:
      "The child reads the available bytes from the read end of the pipe into its buffer.",
    detail: "Pipe buffer → fd[0] → Child",
  },
  {
    number: "06",
    title: "Complete communication",
    operation: "close()",
    description:
      "The processes close the file descriptors when they no longer need the communication channel.",
    detail: "Resources are released",
  },
];

const systemCalls = [
  {
    number: "01",
    name: "pipe()",
    tag: "CHANNEL CREATION",
    description:
      "Creates a unidirectional communication channel and initializes two file descriptors.",
    code: "int fd[2];\npipe(fd);",
    icon: GitBranch,
  },
  {
    number: "02",
    name: "fork()",
    tag: "PROCESS CREATION",
    description:
      "Creates a child process. The child receives copies of the parent's file descriptors.",
    code: "pid_t pid = fork();",
    icon: Cpu,
  },
  {
    number: "03",
    name: "write()",
    tag: "DATA TRANSMISSION",
    description:
      "Writes bytes into the pipe through its write descriptor. The data becomes available to the reader.",
    code: 'write(fd[1], message, strlen(message));',
    icon: ArrowRight,
  },
  {
    number: "04",
    name: "read()",
    tag: "DATA RECEPTION",
    description:
      "Reads bytes from the pipe through its read descriptor into a memory buffer.",
    code: "read(fd[0], buffer, sizeof(buffer));",
    icon: Database,
  },
];

function Documentation() {
  return (
    <div className="app-shell documentation-shell">
      <main className="main-content documentation-main">
        <header className="doc-topbar">
          <Link to="/" className="doc-back-link">
            <ArrowLeft size={16} />
            <span>Back to Visualizer</span>
          </Link>

          <div className="doc-topbar-label">
            <span className="doc-live-dot" />
            TECHNICAL REFERENCE
          </div>
        </header>

        <div className="documentation-page">
          {/* HERO */}
          <section className="doc-hero-new">
            <div className="doc-hero-copy">
              <div className="doc-eyebrow">
                <BookOpen size={14} />
                OPERATING SYSTEMS / INTER-PROCESS COMMUNICATION
              </div>

              <h1>
                Understanding
                <br />
                <span>Pipe Communication.</span>
              </h1>

              <p className="doc-hero-description">
                How two independent processes exchange information through a
                unidirectional communication channel using
                <code> pipe()</code>, <code>fork()</code>, <code>write()</code>,
                and <code>read()</code>.
              </p>

              <div className="doc-hero-actions">
                <Link to="/" className="doc-primary-link">
                  Explore the simulation
                  <ArrowUpRight size={17} />
                </Link>

                <a href="#communication-flow" className="doc-secondary-link">
                  Understand the flow
                  <ArrowRight size={15} />
                </a>
              </div>
            </div>

            <div className="doc-hero-visual">
              <div className="doc-visual-top">
                <span>COMMUNICATION MODEL</span>
                <span className="doc-visual-indicator">01 / 01</span>
              </div>

              <div className="doc-mini-process">
                <div className="doc-mini-node">
                  <div className="doc-mini-icon">
                    <Cpu size={21} />
                  </div>
                  <strong>Parent</strong>
                  <span>PID 1024</span>
                </div>

                <div className="doc-mini-connector">
                  <span>write()</span>
                  <div className="doc-mini-line">
                    <ArrowRight size={15} />
                  </div>
                </div>

                <div className="doc-mini-pipe">
                  <Database size={22} />
                  <strong>PIPE</strong>
                  <span>BUFFER</span>
                </div>

                <div className="doc-mini-connector">
                  <span>read()</span>
                  <div className="doc-mini-line">
                    <ArrowRight size={15} />
                  </div>
                </div>

                <div className="doc-mini-node">
                  <div className="doc-mini-icon child-icon">
                    <Workflow size={21} />
                  </div>
                  <strong>Child</strong>
                  <span>PID 1025</span>
                </div>
              </div>

              <div className="doc-visual-bottom">
                <span>UNIDIRECTIONAL DATA FLOW</span>
                <span>fd[1] → fd[0]</span>
              </div>
            </div>
          </section>

          {/* OVERVIEW */}
          <section className="doc-overview">
            <div className="doc-section-heading">
              <div>
                <span className="doc-section-index">01 — THE CONCEPT</span>
                <h2>What is Inter-Process Communication?</h2>
              </div>
              <span className="doc-section-side-label">OVERVIEW</span>
            </div>

            <div className="doc-overview-layout">
              <div className="doc-overview-main">
                <p>
                  Inter-Process Communication (IPC) is a mechanism that allows
                  separate processes to exchange data and coordinate with one
                  another.
                </p>
                <p>
                  Processes normally operate in separate memory spaces. IPC
                  provides controlled ways for them to communicate without
                  directly accessing each other's memory.
                </p>
              </div>

              <div className="doc-fact-list">
                <div className="doc-fact">
                  <span className="doc-fact-number">01</span>
                  <div>
                    <strong>Communication</strong>
                    <p>Processes can exchange information.</p>
                  </div>
                </div>

                <div className="doc-fact">
                  <span className="doc-fact-number">02</span>
                  <div>
                    <strong>Coordination</strong>
                    <p>Processes can synchronize their activities.</p>
                  </div>
                </div>

                <div className="doc-fact">
                  <span className="doc-fact-number">03</span>
                  <div>
                    <strong>Data exchange</strong>
                    <p>Information can be transferred between processes.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* COMMUNICATION FLOW */}
          <section className="doc-flow-section" id="communication-flow">
            <div className="doc-section-heading">
              <div>
                <span className="doc-section-index">02 — ARCHITECTURE</span>
                <h2>How does a pipe work?</h2>
                <p>
                  A pipe connects the output of one process to the input of
                  another.
                </p>
              </div>
              <span className="doc-section-side-label">DATA PATH</span>
            </div>

            <div className="doc-architecture">
              <div className="doc-architecture-node">
                <div className="doc-architecture-icon">
                  <Cpu size={23} />
                </div>
                <span className="doc-node-type">SENDER</span>
                <strong>Parent Process</strong>
                <span className="doc-node-pid">PID 1024</span>
                <div className="doc-node-descriptor write-descriptor">
                  fd[1] · WRITE
                </div>
              </div>

              <div className="doc-architecture-connection">
                <span>write()</span>
                <div className="doc-connection-line">
                  <ArrowRight size={17} />
                </div>
                <span className="doc-connection-caption">SEND DATA</span>
              </div>

              <div className="doc-architecture-pipe">
                <div className="doc-pipe-symbol">
                  <Database size={27} />
                </div>
                <span className="doc-node-type">KERNEL BUFFER</span>
                <strong>Pipe</strong>
                <span className="doc-pipe-caption">Temporary data storage</span>
                <div className="doc-pipe-direction">
                  <span>fd[1]</span>
                  <ArrowRight size={14} />
                  <span>fd[0]</span>
                </div>
              </div>

              <div className="doc-architecture-connection">
                <span>read()</span>
                <div className="doc-connection-line">
                  <ArrowRight size={17} />
                </div>
                <span className="doc-connection-caption">RECEIVE DATA</span>
              </div>

              <div className="doc-architecture-node">
                <div className="doc-architecture-icon child-node-icon">
                  <Workflow size={23} />
                </div>
                <span className="doc-node-type">RECEIVER</span>
                <strong>Child Process</strong>
                <span className="doc-node-pid">PID 1025</span>
                <div className="doc-node-descriptor read-descriptor">
                  fd[0] · READ
                </div>
              </div>
            </div>

            <div className="doc-flow-note">
              <CheckCircle2 size={17} />
              <p>
                A traditional pipe is unidirectional. Data travels from the
                write end to the read end.
              </p>
            </div>
          </section>

          {/* LIFECYCLE */}
          <section className="doc-lifecycle-section">
            <div className="doc-section-heading">
              <div>
                <span className="doc-section-index">03 — EXECUTION</span>
                <h2>The communication lifecycle</h2>
                <p>
                  Follow the sequence of operations involved in parent-child
                  communication.
                </p>
              </div>
              <span className="doc-section-side-label">6 STAGES</span>
            </div>

            <div className="doc-lifecycle-list">
              {lifecycle.map((item, index) => (
                <div className="doc-lifecycle-item" key={item.number}>
                  <div className="doc-lifecycle-number">{item.number}</div>

                  <div className="doc-lifecycle-content">
                    <div className="doc-lifecycle-heading">
                      <h3>{item.title}</h3>
                      <code>{item.operation}</code>
                    </div>

                    <p>{item.description}</p>

                    <div className="doc-lifecycle-detail">
                      <Terminal size={13} />
                      {item.detail}
                    </div>
                  </div>

                  {index !== lifecycle.length - 1 && (
                    <div className="doc-lifecycle-connector" />
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* SYSTEM CALLS */}
          <section className="doc-calls-section">
            <div className="doc-section-heading">
              <div>
                <span className="doc-section-index">04 — SYSTEM CALLS</span>
                <h2>The four core operations</h2>
                <p>
                  Each operation has a specific responsibility in the
                  communication process.
                </p>
              </div>
              <span className="doc-section-side-label">REFERENCE</span>
            </div>

            <div className="doc-calls-grid">
              {systemCalls.map((call) => {
                const Icon = call.icon;

                return (
                  <article className="doc-call-card" key={call.name}>
                    <div className="doc-call-top">
                      <span>{call.number}</span>
                      <div className="doc-call-icon">
                        <Icon size={19} />
                      </div>
                    </div>

                    <span className="doc-call-tag">{call.tag}</span>
                    <h3>{call.name}</h3>
                    <p>{call.description}</p>

                    <pre className="doc-call-code">
                      <code>{call.code}</code>
                    </pre>
                  </article>
                );
              })}
            </div>
          </section>

          {/* FILE DESCRIPTORS */}
          <section className="doc-descriptor-section">
            <div className="doc-section-heading">
              <div>
                <span className="doc-section-index">05 — FILE DESCRIPTORS</span>
                <h2>Understanding fd[0] and fd[1]</h2>
                <p>
                  The pipe system call returns two file descriptors that
                  represent its communication endpoints.
                </p>
              </div>
            </div>

            <div className="doc-descriptor-layout">
              <div className="doc-descriptor-card read">
                <div className="doc-descriptor-top">
                  <span className="doc-descriptor-label">ENDPOINT 01</span>
                  <Database size={19} />
                </div>
                <strong>fd[0]</strong>
                <h3>Read end</h3>
                <p>
                  Used to receive data from the pipe. The child process reads
                  the message through this descriptor.
                </p>
                <div className="doc-descriptor-code">read(fd[0], buffer, size);</div>
              </div>

              <div className="doc-descriptor-card write">
                <div className="doc-descriptor-top">
                  <span className="doc-descriptor-label">ENDPOINT 02</span>
                  <Terminal size={19} />
                </div>
                <strong>fd[1]</strong>
                <h3>Write end</h3>
                <p>
                  Used to send data into the pipe. The parent process writes
                  the message through this descriptor.
                </p>
                <div className="doc-descriptor-code">
                  write(fd[1], message, length);
                </div>
              </div>
            </div>

            <div className="doc-descriptor-warning">
              <Layers size={18} />
              <p>
                After <code>fork()</code>, both processes inherit copies of
                the pipe descriptors. Each process should close the endpoint
                it does not use.
              </p>
            </div>
          </section>

          {/* CODE */}
          <section className="doc-code-section">
            <div className="doc-section-heading">
              <div>
                <span className="doc-section-index">06 — IMPLEMENTATION</span>
                <h2>Putting it together in C</h2>
                <p>
                  A simplified example of communication between a parent and
                  child process using an unnamed pipe.
                </p>
              </div>
              <span className="doc-section-side-label">C LANGUAGE</span>
            </div>

            <div className="doc-code-window">
              <div className="doc-code-titlebar">
                <div className="doc-window-dots">
                  <span />
                  <span />
                  <span />
                </div>
                <span>pipe_ipc.c</span>
                <span className="doc-code-language">C</span>
              </div>

              <pre>
                <code>{`#include <stdio.h>
#include <unistd.h>
#include <string.h>
#include <sys/wait.h>

int main(void)
{
    int fd[2];
    char message[] = "Hello from Parent Process";
    char buffer[100];

    // Create the pipe
    if (pipe(fd) == -1) {
        perror("pipe");
        return 1;
    }

    // Create the child process
    pid_t pid = fork();

    if (pid < 0) {
        perror("fork");
        return 1;
    }

    if (pid > 0) {
        // Parent process
        close(fd[0]);

        write(fd[1], message, strlen(message) + 1);
        close(fd[1]);

        wait(NULL);
    }
    else {
        // Child process
        close(fd[1]);

        read(fd[0], buffer, sizeof(buffer));
        printf("Child received: %s\\n", buffer);

        close(fd[0]);
    }

    return 0;
}`}</code>
              </pre>

              <div className="doc-code-footer">
                <span>
                  <CheckCircle2 size={14} />
                  Illustrative C implementation
                </span>
                <span>UNIX / LINUX</span>
              </div>
            </div>
          </section>

          {/* SIMULATION NOTE */}
          <section className="doc-simulation-note">
            <div className="doc-simulation-icon">
              <Code2 size={22} />
            </div>

            <div>
              <span className="doc-section-index">ABOUT THIS PROJECT</span>
              <h2>Understanding the visual simulation</h2>
              <p>
                This project demonstrates the concepts of pipe-based
                inter-process communication through a visual, step-by-step
                simulation. Its Node.js backend models the operations and
                returns execution details to the frontend. It does not invoke
                native operating-system <code>pipe()</code> or{" "}
                <code>fork()</code> system calls, or create actual OS
                processes.
              </p>
            </div>
          </section>

          {/* FOOTER CTA */}
          <section className="doc-final-cta">
            <div>
              <span className="doc-section-index">READY TO EXPLORE?</span>
              <h2>See the communication happen.</h2>
              <p>
                Move through each stage and observe how data travels from the
                parent process to the child process.
              </p>
            </div>

            <Link to="/" className="doc-primary-link">
              Launch Visualizer
              <ArrowUpRight size={17} />
            </Link>
          </section>

          <footer className="doc-footer">
            <span>IPC VISUALIZER</span>
            <span>INTER-PROCESS COMMUNICATION · TECHNICAL DOCUMENTATION</span>
            <span>VERSION 1.0.0</span>
          </footer>
        </div>
      </main>
    </div>
  );
}

export default Documentation;
