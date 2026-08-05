// PyNova AI - Debug Lab & Visual Step Execution Controller

class DebuggerController {
  constructor() {
    this.initElements();
    this.bindEvents();
    this.currentSteps = [];
    this.activeStepIndex = 0;
  }

  initElements() {
    this.editor = document.getElementById("debugger-code-editor");
    this.lineNumbers = document.getElementById("debugger-line-numbers");
    this.console = document.getElementById("debugger-console");
    this.analyzeBtn = document.getElementById("debugger-analyze-btn");
    this.reportContainer = document.getElementById("debugger-report-container");
    this.visualizer = document.getElementById("debugger-visualizer");
    this.stepsRow = document.getElementById("debugger-steps-row");
    this.vizArea = document.getElementById("debugger-viz-area");
  }

  bindEvents() {
    if (this.editor) {
      this.editor.addEventListener("input", () => this.syncLineNumbers());
      this.editor.addEventListener("scroll", () => {
        if (this.lineNumbers) this.lineNumbers.scrollTop = this.editor.scrollTop;
      });
      this.editor.addEventListener("keydown", (e) => this.handleEditorKeys(e));
    }
    
    if (this.analyzeBtn) {
      this.analyzeBtn.addEventListener("click", () => this.analyzeBuggyCode());
    }
  }

  syncLineNumbers() {
    if (!this.editor || !this.lineNumbers) return;
    const lines = this.editor.value.split("\n");
    let numbers = "";
    for (let i = 1; i <= lines.length; i++) {
      numbers += i + "<br>";
    }
    this.lineNumbers.innerHTML = numbers;
  }

  handleEditorKeys(e) {
    if (e.key === "Tab") {
      e.preventDefault();
      const start = this.editor.selectionStart;
      const end = this.editor.selectionEnd;
      this.editor.value = this.editor.value.substring(0, start) + "    " + this.editor.value.substring(end);
      this.editor.selectionStart = this.editor.selectionEnd = start + 4;
      this.syncLineNumbers();
    }
    if (e.key === "Enter") {
      e.preventDefault();
      const start = this.editor.selectionStart;
      const text = this.editor.value;
      const beforeCursor = text.substring(0, start);
      const lines = beforeCursor.split("\n");
      const currentLine = lines[lines.length - 1];
      let indentMatch = currentLine.match(/^(\s*)/);
      let indent = indentMatch ? indentMatch[1] : "";
      if (currentLine.trim().endsWith(":")) {
        indent += "    ";
      }
      this.editor.value = text.substring(0, start) + "\n" + indent + text.substring(this.editor.selectionEnd);
      this.editor.selectionStart = this.editor.selectionEnd = start + 1 + indent.length;
      this.syncLineNumbers();
      this.editor.scrollTop = this.editor.scrollHeight;
    }
  }

  analyzeBuggyCode() {
    const code = this.editor.value;
    if (code.trim() === "") {
      this.console.innerText = "> Error: Please paste some python code first.";
      this.console.classList.add("error");
      return;
    }

    this.console.innerText = "> Running diagnostic scan...";
    this.console.classList.remove("error");
    
    // Log user activity
    window.PyNovaState.incrementDebugCount();
    window.PyNovaState.addActivity("Debugger Run", "Analyzed buggy code inside Debug Lab.");

    setTimeout(() => {
      // 1. Scan for standard errors using naive syntax analyzer
      const issues = this.scanForSyntaxIssues(code);
      this.renderReport(issues);
      
      // 2. Build execution steps
      this.currentSteps = this.generateExecutionSteps(code, issues.hasError);
      this.activeStepIndex = 0;
      
      if (this.currentSteps.length > 0) {
        this.visualizer.style.display = "flex";
        this.renderStepsSelector();
        this.renderActiveStep();
      } else {
        this.visualizer.style.display = "none";
      }

      this.console.innerText = issues.hasError ? "> Scan finished. Issues detected." : "> Scan complete. Code looks correct.";
    }, 600);
  }

  scanForSyntaxIssues(code) {
    const lines = code.split("\n");
    let issues = {
      hasError: false,
      title: "Syntax & Logic Analysis",
      why: "No syntax errors found! The code structure looks correct.",
      how: "Check if the code produces the output you expected. If you need improvements, consider modularizing your logic with functions.",
      corrected: code,
      errorLines: []
    };

    // Rule 1: check for missing colon after if/else/for/while/def
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if ((line.startsWith("if ") || line.startsWith("elif ") || line.startsWith("else") || 
           line.startsWith("for ") || line.startsWith("while ") || line.startsWith("def ")) && !line.endsWith(":")) {
        issues.hasError = true;
        issues.title = "Missing Colon (SyntaxError)";
        issues.why = `Line ${i + 1} contains a block declaration statement: "${line}" but is missing a colon ':' at the end.`;
        issues.how = "Python headers (if, for, while, def) require a colon at the end of the line to identify blocks.";
        
        // Build corrected code
        let newLines = [...lines];
        newLines[i] = lines[i] + ":";
        issues.corrected = newLines.join("\n");
        issues.errorLines.push(i + 1);
        return issues; // Return first error
      }
    }

    // Rule 2: check for assignment vs equality check in 'if'
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line.startsWith("if ") && line.includes("=") && !line.includes("==") && !line.includes("!=") && !line.includes(">=") && !line.includes("<=")) {
        issues.hasError = true;
        issues.title = "Assignment inside Condition (SyntaxError)";
        issues.why = `Line ${i + 1} contains a single equals sign inside condition: "${line}". A single '=' assigns a value, it doesn't compare them.`;
        issues.how = "Replace the single equals sign '=' with double equals '==' to perform comparison.";
        
        let newLines = [...lines];
        newLines[i] = lines[i].replace("=", "==");
        issues.corrected = newLines.join("\n");
        issues.errorLines.push(i + 1);
        return issues;
      }
    }

    // Rule 3: Indentation check
    let currentIndent = 0;
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line.trim() === "") continue;
      
      const indentMatch = line.match(/^(\s*)/);
      const indent = indentMatch ? indentMatch[1].length : 0;
      
      // If previous line ended with colon, this line MUST have higher indent
      if (i > 0) {
        const prevLine = lines[i - 1].trim();
        if (prevLine.endsWith(":") && indent <= currentIndent) {
          issues.hasError = true;
          issues.title = "Indentation Mismatch (IndentationError)";
          issues.why = `Line ${i + 1} follows a block header but has incorrect indentation.`;
          issues.how = "Indent this line with 4 spaces (or one Tab) relative to the preceding header.";
          
          let newLines = [...lines];
          newLines[i] = "    " + lines[i];
          issues.corrected = newLines.join("\n");
          issues.errorLines.push(i + 1);
          return issues;
        }
      }
      currentIndent = indent;
    }

    return issues;
  }

  renderReport(issues) {
    if (issues.hasError) {
      this.reportContainer.innerHTML = `
        <div style="color: var(--accent-red); font-weight: 700; margin-bottom: 8px;">
          <i class="fa-solid fa-triangle-exclamation"></i> ${issues.title}
        </div>
        <p style="margin-bottom: 10px;"><strong>Error details:</strong> ${issues.why}</p>
        <p style="margin-bottom: 10px;"><strong>How to fix:</strong> ${issues.how}</p>
        <div style="background-color: var(--bg-primary); padding: 12px; border-radius: 12px; border: 1px solid var(--border-color); font-family: monospace; position: relative;">
          <div style="font-size: 11px; color: var(--text-muted); margin-bottom: 6px;"># Recommended Correction:</div>
          <span style="color: #a8ff60; white-space: pre-wrap;">${issues.corrected}</span>
        </div>
      `;
    } else {
      this.reportContainer.innerHTML = `
        <div style="color: var(--accent-green); font-weight: 700; margin-bottom: 8px;">
          <i class="fa-solid fa-circle-check"></i> Code Validated Successfully
        </div>
        <p style="margin-bottom: 10px;"><strong>Analysis:</strong> ${issues.why}</p>
        <p>You can see step-by-step how your code executes inside the interactive visualizer below!</p>
      `;
    }
  }

  generateExecutionSteps(code, hasError) {
    // If code has errors, don't simulate steps, focus on correction
    if (hasError) return [];

    const cleanLines = code.split("\n").map(l => l.trim());
    
    // Default fallback steps for loops demonstration if user pastes loop-based math
    // We search for a variable assignment followed by a for loop
    let initVar = "total";
    let initVal = 0;
    let loopVar = "i";
    let rangeStart = 1;
    let rangeEnd = 4;
    
    // Parse custom names where possible
    let hasMatch = false;
    for (let i = 0; i < cleanLines.length; i++) {
      const line = cleanLines[i];
      
      // Look for loop
      if (/^for\s+(\w+)\s+in\s+range\s*\((.*?)\):?$/.test(line)) {
        const match = line.match(/^for\s+(\w+)\s+in\s+range\s*\((.*?)\):?$/);
        loopVar = match[1];
        const rangeArgs = match[2].split(",").map(a => parseInt(a.trim()));
        if (rangeArgs.length === 1) {
          rangeStart = 0;
          rangeEnd = rangeArgs[0];
        } else if (rangeArgs.length === 2) {
          rangeStart = rangeArgs[0];
          rangeEnd = rangeArgs[1];
        }
        hasMatch = true;
      }
      // Look for var assignment
      if (/^(\w+)\s*=\s*(\d+)$/.test(line)) {
        const match = line.match(/^(\w+)\s*=\s*(\d+)$/);
        initVar = match[1];
        initVal = parseInt(match[2]);
      }
    }

    if (!hasMatch) {
      // General non-loop code steps: simulate standard operations
      return [
        { lineNum: 1, desc: "Create and initialize variables.", vars: { info: "Initializing script" } },
        { lineNum: 2, desc: "Execute operations line by line.", vars: { info: "Computing expressions" } },
        { lineNum: code.split("\n").length, desc: "Script complete.", vars: { info: "Console printed" } }
      ];
    }

    // Dynamic steps builder for loops
    let steps = [];
    let currentVal = initVal;

    // Step 1: Init variables
    steps.push({
      lineNum: this.findLineIndex(code, `${initVar} =`),
      desc: `Initialize variable <code>${initVar}</code> to <code>${initVal}</code>.`,
      vars: { [initVar]: currentVal }
    });

    // Loop steps
    for (let i = rangeStart; i < rangeEnd; i++) {
      steps.push({
        lineNum: this.findLineIndex(code, `for ${loopVar} in`),
        desc: `Loop iterator <code>${loopVar}</code> set to <code>${i}</code>.`,
        vars: { [initVar]: currentVal, [loopVar]: i }
      });

      currentVal += i;
      steps.push({
        lineNum: this.findLineIndex(code, `${initVar} =`),
        desc: `Add <code>${loopVar}</code> (${i}) to <code>${initVar}</code>. New total is <code>${currentVal}</code>.`,
        vars: { [initVar]: currentVal, [loopVar]: i }
      });
    }

    // Print step
    steps.push({
      lineNum: this.findLineIndex(code, "print("),
      desc: `Print final value of <code>${initVar}</code> to console. Output: <code>${currentVal}</code>`,
      vars: { [initVar]: currentVal }
    });

    return steps;
  }

  findLineIndex(code, keyword) {
    const lines = code.split("\n");
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes(keyword)) {
        return i + 1; // 1-indexed
      }
    }
    return 1;
  }

  renderStepsSelector() {
    this.stepsRow.innerHTML = "";
    this.currentSteps.forEach((step, idx) => {
      const dot = document.createElement("div");
      dot.className = `step-dot ${idx === 0 ? "active" : ""}`;
      dot.innerText = idx + 1;
      dot.addEventListener("click", () => {
        // Toggle active
        document.querySelectorAll(".step-dot").forEach(d => d.classList.remove("active"));
        dot.classList.add("active");
        this.activeStepIndex = idx;
        this.renderActiveStep();
      });
      this.stepsRow.appendChild(dot);
    });
  }

  renderActiveStep() {
    const step = this.currentSteps[this.activeStepIndex];
    if (!step) return;

    // Highlight line in code visualization
    const code = this.editor.value;
    const lines = code.split("\n");
    
    let codeHtml = "";
    lines.forEach((line, idx) => {
      const lineNum = idx + 1;
      const isActive = lineNum === step.lineNum;
      codeHtml += `<div class="viz-line ${isActive ? "active" : ""}">${this.escapeHtml(line || " ")}</div>`;
    });

    // Populate Variables pane
    let varsHtml = "";
    for (const [key, value] of Object.entries(step.vars)) {
      varsHtml += `
        <div class="var-row">
          <span style="color: var(--accent-cyan); font-weight: 600;">${key}</span>
          <span style="color: #a8ff60;">${value}</span>
        </div>
      `;
    }

    this.vizArea.innerHTML = `
      <div>
        <div class="viz-code-block">${codeHtml}</div>
        <p style="font-size: 13px; color: var(--text-primary); margin-top: 14px; line-height: 1.5;">
          <strong>Action:</strong> ${step.desc}
        </p>
      </div>
      <div class="viz-variables">
        <div class="variables-title">Variables Scope</div>
        ${varsHtml}
      </div>
    `;
  }

  escapeHtml(text) {
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
}

// Expose on load
window.addEventListener("DOMContentLoaded", () => {
  window.PyNovaDebugger = new DebuggerController();
  // sync initial numbers
  if (window.PyNovaDebugger.editor) {
    window.PyNovaDebugger.syncLineNumbers();
  }
});
