// Python AI - Live Code Editor & Pyodide Python Runtime Engine

class PyodideRunner {
  constructor() {
    this.pyodide = null;
    this.loading = false;
    this.loaded = false;
    this.loadError = null;
  }

  async ensureLoaded() {
    if (this.loaded && this.pyodide) return true;
    if (this.loading) {
      // Wait for existing load to complete
      while (this.loading) {
        await new Promise(r => setTimeout(r, 100));
      }
      return this.loaded;
    }

    this.loading = true;
    try {
      // Check if loadPyodide is available (CDN script loaded)
      if (typeof loadPyodide === "undefined") {
        throw new Error("Pyodide CDN script not loaded. Check your internet connection.");
      }

      this.pyodide = await loadPyodide({
        indexURL: "https://cdn.jsdelivr.net/pyodide/v0.27.7/full/"
      });

      // Setup input() override and stdout capture helpers
      await this.pyodide.runPythonAsync(`
import sys, io
from js import prompt as js_prompt

def _custom_input(p=''):
    result = js_prompt(str(p))
    if result is None:
        raise EOFError('Input cancelled by user')
    return result

import builtins
builtins.input = _custom_input
`);

      this.loaded = true;
      this.loading = false;

      // Update status indicator if present
      const statusEl = document.getElementById("pyodide-status");
      if (statusEl) {
        statusEl.textContent = "Runtime: Ready ✓";
        statusEl.style.color = "var(--accent-green)";
      }

      return true;
    } catch (err) {
      this.loadError = err.message || "Failed to load Python runtime.";
      this.loading = false;
      this.loaded = false;

      const statusEl = document.getElementById("pyodide-status");
      if (statusEl) {
        statusEl.textContent = "Runtime: Error";
        statusEl.style.color = "var(--accent-red)";
      }

      return false;
    }
  }

  async runCode(code) {
    const isFirstLoad = !this.loaded;

    const ok = await this.ensureLoaded();
    if (!ok) {
      return {
        success: false,
        output: "",
        errorName: "RuntimeError",
        errorMessage: this.loadError || "Python runtime could not be loaded. Please check your internet connection and reload the page."
      };
    }

    try {
      // Redirect stdout/stderr to a StringIO buffer
      await this.pyodide.runPythonAsync(`
import sys, io
_stdout_buffer = io.StringIO()
_stderr_buffer = io.StringIO()
sys.stdout = _stdout_buffer
sys.stderr = _stderr_buffer
`);

      // Execute user code with a timeout
      const timeoutMs = 10000;
      const execPromise = this.pyodide.runPythonAsync(code);

      const result = await Promise.race([
        execPromise,
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("TIMEOUT")), timeoutMs)
        )
      ]);

      // Capture output
      const stdout = this.pyodide.runPython(`_stdout_buffer.getvalue()`);
      const stderr = this.pyodide.runPython(`_stderr_buffer.getvalue()`);

      // Reset stdout/stderr
      this.pyodide.runPython(`
sys.stdout = sys.__stdout__
sys.stderr = sys.__stderr__
`);

      const output = stdout + (stderr ? "\n" + stderr : "");
      return {
        success: true,
        output: output || "Code ran successfully (no output)."
      };

    } catch (err) {
      // Reset stdout/stderr even on error
      try {
        const partialOut = this.pyodide.runPython(`_stdout_buffer.getvalue()`);
        this.pyodide.runPython(`
sys.stdout = sys.__stdout__
sys.stderr = sys.__stderr__
`);

        if (err.message === "TIMEOUT") {
          return {
            success: false,
            output: partialOut || "",
            errorName: "TimeoutError",
            errorMessage: "Execution exceeded 10 seconds. Your code may contain an infinite loop. Add a break condition or reduce iterations."
          };
        }

        // Extract Python traceback from PythonError
        let errorStr = err.message || String(err);

        // Pyodide wraps Python exceptions - extract the traceback
        let pyTraceback = "";
        let errorName = "Error";
        let errorMessage = errorStr;

        if (errorStr.includes("Traceback")) {
          pyTraceback = errorStr;
          // Extract just the last line (the actual error)
          const lines = errorStr.trim().split("\n");
          const lastLine = lines[lines.length - 1];
          const colonIdx = lastLine.indexOf(":");
          if (colonIdx > 0) {
            errorName = lastLine.substring(0, colonIdx).trim();
            errorMessage = lastLine.substring(colonIdx + 1).trim();
          } else {
            errorMessage = lastLine;
          }
        } else {
          // Simple error without traceback
          const colonIdx = errorStr.indexOf(":");
          if (colonIdx > 0 && colonIdx < 30) {
            errorName = errorStr.substring(0, colonIdx).trim();
            errorMessage = errorStr.substring(colonIdx + 1).trim();
          }
        }

        return {
          success: false,
          output: partialOut || "",
          errorName,
          errorMessage,
          traceback: pyTraceback
        };

      } catch (resetErr) {
        return {
          success: false,
          output: "",
          errorName: "InternalError",
          errorMessage: "An internal error occurred while handling the Python error: " + (err.message || String(err))
        };
      }
    }
  }
}

// Global Pyodide runner instance
const pyodideRunner = new PyodideRunner();

class EditorController {
  constructor() {
    this.defaultSandboxCode = `# Python AI - Live Python Editor
print("Welcome to Python AI Live Editor!")

# Try real Python!
name = input("What is your name? ")
print(f"Hello, {name}! Welcome aboard.")
`;
    this.initElements();
    this.bindEvents();
  }

  initElements() {
    // Sandbox Elements
    this.sandboxEditor = document.getElementById("sandbox-code-editor");
    this.sandboxLineNumbers = document.getElementById("sandbox-line-numbers");
    this.sandboxConsole = document.getElementById("sandbox-console-log");
    this.sandboxRunBtn = document.getElementById("sandbox-run-btn");
    this.sandboxResetBtn = document.getElementById("sandbox-reset-btn");
    this.sandboxClearBtn = document.getElementById("sandbox-clear-btn");

    // Lesson Elements
    this.lessonEditor = document.getElementById("lesson-code-editor");
    this.lessonLineNumbers = document.getElementById("lesson-line-numbers");
    this.lessonConsole = document.getElementById("lesson-console-output");
    this.lessonRunBtn = document.getElementById("lesson-run-code-btn");
    this.lessonResetBtn = document.getElementById("lesson-reset-code-btn");

    // Project Elements
    this.projectEditor = document.getElementById("project-code-editor");
    this.projectLineNumbers = document.getElementById("project-line-numbers");
    this.projectConsole = document.getElementById("project-console-output");
    this.projectRunBtn = document.getElementById("project-run-btn");
    this.projectResetBtn = document.getElementById("project-reset-btn");
  }

  bindEvents() {
    // Sync line numbers for each editor
    const editors = [
      [this.sandboxEditor, this.sandboxLineNumbers],
      [this.lessonEditor, this.lessonLineNumbers],
      [this.projectEditor, this.projectLineNumbers]
    ];

    editors.forEach(([textarea, lineDiv]) => {
      if (!textarea || !lineDiv) return;
      textarea.addEventListener("input", () => this.syncLineNumbers(textarea, lineDiv));
      textarea.addEventListener("scroll", () => this.syncScroll(textarea, lineDiv));
      textarea.addEventListener("keydown", (e) => this.handleEditorKeys(e, textarea, lineDiv));
    });

    // Run Code Triggers
    if (this.sandboxRunBtn) this.sandboxRunBtn.addEventListener("click", () => this.runSandboxCode());
    if (this.lessonRunBtn) this.lessonRunBtn.addEventListener("click", () => this.runLessonCode());
    if (this.projectRunBtn) this.projectRunBtn.addEventListener("click", () => this.runProjectCode());

    // Auxiliary Triggers
    if (this.sandboxClearBtn) {
      this.sandboxClearBtn.addEventListener("click", () => {
        this.sandboxEditor.value = "";
        this.syncLineNumbers(this.sandboxEditor, this.sandboxLineNumbers);
        this.sandboxConsole.innerText = "> Workspace cleared.";
        this.sandboxConsole.classList.remove("error");
      });
    }
    if (this.sandboxResetBtn) {
      this.sandboxResetBtn.addEventListener("click", () => {
        this.sandboxEditor.value = this.defaultSandboxCode;
        this.syncLineNumbers(this.sandboxEditor, this.sandboxLineNumbers);
        this.sandboxConsole.innerText = "> Workspace reset to default.";
        this.sandboxConsole.classList.remove("error");
      });
    }
  }

  syncLineNumbers(textarea, lineNumbersDiv) {
    if (!textarea || !lineNumbersDiv) return;
    const lines = textarea.value.split("\n");
    let numbers = "";
    for (let i = 1; i <= lines.length; i++) {
      numbers += i + "<br>";
    }
    lineNumbersDiv.innerHTML = numbers;
  }

  syncScroll(textarea, lineNumbersDiv) {
    if (!textarea || !lineNumbersDiv) return;
    lineNumbersDiv.scrollTop = textarea.scrollTop;
  }

  handleEditorKeys(e, textarea, lineNumbersDiv) {
    // Handle Tab Press
    if (e.key === "Tab") {
      e.preventDefault();
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      textarea.value = textarea.value.substring(0, start) + "    " + textarea.value.substring(end);
      textarea.selectionStart = textarea.selectionEnd = start + 4;
      this.syncLineNumbers(textarea, lineNumbersDiv);
    }
    // Handle Enter Auto-Indentation
    if (e.key === "Enter") {
      e.preventDefault();
      const start = textarea.selectionStart;
      const text = textarea.value;
      const beforeCursor = text.substring(0, start);
      const lines = beforeCursor.split("\n");
      const currentLine = lines[lines.length - 1];

      const indentMatch = currentLine.match(/^(\s*)/);
      let indent = indentMatch ? indentMatch[1] : "";

      if (currentLine.trim().endsWith(":")) {
        indent += "    ";
      }

      textarea.value = text.substring(0, start) + "\n" + indent + text.substring(textarea.selectionEnd);
      textarea.selectionStart = textarea.selectionEnd = start + 1 + indent.length;
      this.syncLineNumbers(textarea, lineNumbersDiv);
      textarea.scrollTop = textarea.scrollHeight;
    }
  }

  // --------------------------------------------------
  // CODE EXECUTION VIA PYODIDE
  // --------------------------------------------------
  async runSandboxCode() {
    const code = this.sandboxEditor.value;
    this.sandboxConsole.classList.remove("error");

    if (!pyodideRunner.loaded) {
      this.sandboxConsole.innerText = "> Loading Python runtime (first time only)...";
    } else {
      this.sandboxConsole.innerText = "> Running Python code...";
    }

    // Disable button during execution
    this.sandboxRunBtn.disabled = true;
    this.sandboxRunBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Running...`;

    // Track stats
    if (window.PyNovaState) {
      window.PyNovaState.addActivity("Sandbox Execution", "Ran Python code in live sandbox.");
      window.PyNovaState.awardBadge("badge_code");
    }

    const result = await pyodideRunner.runCode(code);

    this.sandboxRunBtn.disabled = false;
    this.sandboxRunBtn.innerHTML = `<i class="fa-solid fa-play"></i> Run Code`;

    if (result.success) {
      this.sandboxConsole.classList.remove("error");
      this.sandboxConsole.innerText = result.output;
    } else {
      this.sandboxConsole.classList.add("error");
      let errorDisplay = "";
      if (result.output) errorDisplay += result.output + "\n";
      if (result.traceback) {
        errorDisplay += result.traceback;
      } else {
        errorDisplay += `${result.errorName}: ${result.errorMessage}`;
      }
      this.sandboxConsole.innerText = errorDisplay;
    }
  }

  async runLessonCode() {
    const code = this.lessonEditor.value;
    this.lessonConsole.classList.remove("error");

    if (!pyodideRunner.loaded) {
      this.lessonConsole.innerText = "> Loading Python runtime...";
    } else {
      this.lessonConsole.innerText = "> Running code challenge check...";
    }

    const result = await pyodideRunner.runCode(code);

    if (result.success) {
      this.lessonConsole.classList.remove("error");
      this.lessonConsole.innerText = result.output;
      window.dispatchEvent(new CustomEvent("lesson-code-run", {
        detail: { code, output: result.output, success: true }
      }));
    } else {
      this.lessonConsole.classList.add("error");
      const errMsg = result.traceback || `${result.errorName}: ${result.errorMessage}`;
      this.lessonConsole.innerText = errMsg;
      window.dispatchEvent(new CustomEvent("lesson-code-run", {
        detail: { code, error: result.errorMessage, success: false }
      }));
    }
  }

  async runProjectCode() {
    const code = this.projectEditor.value;
    this.projectConsole.classList.remove("error");

    if (!pyodideRunner.loaded) {
      this.projectConsole.innerText = "> Loading Python runtime...";
    } else {
      this.projectConsole.innerText = "> Compiling project execution script...";
    }

    const result = await pyodideRunner.runCode(code);

    if (result.success) {
      this.projectConsole.classList.remove("error");
      this.projectConsole.innerText = result.output;
      window.dispatchEvent(new CustomEvent("project-code-run", {
        detail: { code, output: result.output, success: true }
      }));
    } else {
      this.projectConsole.classList.add("error");
      const errMsg = result.traceback || `${result.errorName}: ${result.errorMessage}`;
      this.projectConsole.innerText = errMsg;
      window.dispatchEvent(new CustomEvent("project-code-run", {
        detail: { code, error: result.errorMessage, success: false }
      }));
    }
  }
}

// Instantiate and expose
window.addEventListener("DOMContentLoaded", () => {
  window.PyNovaEditor = new EditorController();
  if (window.PyNovaEditor.sandboxEditor) {
    window.PyNovaEditor.syncLineNumbers(window.PyNovaEditor.sandboxEditor, window.PyNovaEditor.sandboxLineNumbers);
  }
});
