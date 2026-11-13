# IPC Visualizer

IPC Visualizer is an interactive educational tool that demonstrates **Inter-Process Communication (IPC)** between a parent process and a child process using a unidirectional pipe.

The application combines a React-based dashboard with an Express backend to simulate the communication lifecycle, from pipe creation and child process creation to writing and reading data. It provides a visual representation of how data travels through a pipe buffer, supported by animated transitions, execution logs, and step-by-step controls.

> **Simulation Note:** This project provides a software-level simulation of IPC concepts. The backend does not create actual operating-system processes or invoke native `pipe()` or `fork()` system calls. Process IDs and file descriptors are simulated values used to demonstrate the communication workflow.

## Features

- **Step-by-Step Execution:** Control each stage of the IPC workflow independently:
  - `pipe()` – Initialize the communication channel.
  - `fork()` – Simulate the creation of a child process.
  - `write()` – Send a message from the parent process.
  - `read()` – Retrieve the message from the pipe buffer in the child process.

- **Animated Process Visualization:** Observe the parent process, pipe channel, buffer, and child process through an interactive dashboard.

- **Live Process Monitoring:** Track simulated process IDs, process states, pipe status, and communication progress.

- **Payload Tracking:** Calculate and display message size in UTF-8 bytes.

- **Execution Log:** View timestamped events, operation statuses, successful operations, and errors throughout the simulation.

- **Documentation:** Access an integrated documentation page explaining IPC fundamentals, pipe communication, and the operations involved.

- **Backend Validation:** Validate incoming messages to ensure they are non-empty and do not exceed the 1023-byte UTF-8 limit.

- **Reset and Replay:** Reset the simulation and execute the complete communication sequence again.

## Technology Stack

| Layer | Technologies |
|---|---|
| Frontend | React 19, Vite 6 |
| Routing | React Router |
| Animations | Framer Motion |
| Icons | Lucide React |
| Backend | Node.js, Express 5 |
| Middleware | CORS |
| Communication | REST API, JSON |

## Project Structure

```text
IPC-Visualizer/
├── backend/
│   ├── routes/
│   │   └── ipcRoutes.js
│   ├── services/
│   │   └── ipcService.js
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── public/
│   │   └── assets/
│   │       └── pipe-icon.svg
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── styles/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
└── README.md
```

## Getting Started

### Prerequisites

Ensure the following are installed:

- Node.js
- npm

### Installation and Execution

The frontend and backend run independently in separate terminals.

**1. Clone the repository**

```bash
git clone <repository-url>
cd IPC-Visualizer
```

**2. Start the backend**

Open the first terminal:

```bash
cd backend
npm install
npm run dev
```

The backend starts on port `5000` by default.

**3. Start the frontend**

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

**4. Open the application**

Navigate to the Vite development URL:

```text
http://localhost:5173
```

The frontend communicates with the backend through:

```text
http://127.0.0.1:5000/api
```

Keep the backend running while using the application. If you change the backend port, update the API base URL in `frontend/src/services/ipcService.js` accordingly.

## IPC Simulation Workflow

The application demonstrates the following communication sequence:

| Step | Operation | Description |
|---|---|---|
| 1 | `pipe()` | Creates a simulated pipe with read (`fd[0]`) and write (`fd[1]`) descriptors. |
| 2 | `fork()` | Simulates child process creation and inheritance of pipe descriptors. |
| 3 | `write()` | Sends the parent process message to the pipe buffer. |
| 4 | `read()` | Simulates the child process reading the message from the pipe buffer. |

The communication follows a unidirectional flow:

```text
Parent Process
      |
      | write(fd[1])
      v
   Pipe Buffer
      |
      | read(fd[0])
      v
  Child Process
```

## API Reference

The Express backend exposes REST endpoints for health monitoring and IPC simulation.

**Base URL**

```text
http://127.0.0.1:5000/api
```

### 1. Health Check

Checks whether the backend service is running.

- **Method:** `GET`
- **Endpoint:** `/health`

```http
GET /api/health
```

### 2. Run IPC Simulation

Executes the backend-side IPC simulation for the supplied message.

- **Method:** `POST`
- **Endpoint:** `/ipc/run`
- **Content-Type:** `application/json`

**Request Body**

```json
{
  "message": "Hello from Parent Process"
}
```

**Response**

A successful response includes:

- The transmitted message.
- Simulated parent and child process IDs.
- UTF-8 byte counts for writing and reading.
- Pipe status.
- The sequence of simulated operations.
- Execution log entries.

**Validation**

The backend rejects:
- Empty or whitespace-only messages.
- Messages exceeding 1023 UTF-8 bytes.
- Invalid request payloads.

## Production Build

To generate an optimized frontend production bundle:

```bash
cd frontend
npm run build
```

The generated production files are available in:

```text
frontend/dist/
```

## Learning Objectives

This project demonstrates the fundamental concepts of inter-process communication, including:

- Communication between parent and child processes.
- Unidirectional data transfer using pipes.
- File descriptor concepts and their roles in pipe operations.
- Message writing and reading through a shared communication channel.
- Pipe buffer behavior during data transfer.
- The relationship between process creation and IPC.

## Limitations

- The application simulates IPC behavior rather than performing native operating-system IPC.
- Process IDs and file descriptors are illustrative values.
- Process creation, descriptor inheritance, and buffer operations are modeled by the backend.
- The project does not implement actual inter-process synchronization or native pipe management.

---

**IPC Visualizer** demonstrates the lifecycle of pipe-based communication through an interactive, step-driven environment, making core operating-system concepts easier to understand and explore.