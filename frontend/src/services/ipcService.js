const API_BASE_URL = "http://127.0.0.1:5000/api";

export async function runPipeIPC(message) {
  try {
    const response = await fetch(`${API_BASE_URL}/ipc/run`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "IPC simulation failed.");
    }

    return data;
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(
        "Unable to connect to the backend. Make sure the backend server is running on port 5000."
      );
    }

    throw error;
  }
}