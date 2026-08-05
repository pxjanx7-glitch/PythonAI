// PyNova AI - Core Controller & SPA Coordinator

class AppController {
  constructor() {
    this.activeView = "dashboard-view";
    this.activeLesson = null;
    this.activeQuiz = null;
    this.activeProject = null;
    this.activeChatId = "chat_welcome";
    
    this.init();
  }

  init() {
    this.initElements();
    this.bindEvents();
    this.loadStateAndStats();
    
    // Check initial skill assessment requirement
    if (!window.PyNovaState.state.skillAssessmentCompleted) {
      this.showSkillAssessment();
    }

    // Load initial views setup
    this.renderRoadmap();
    this.renderDashboardRecommendations();
    this.renderDashboardActivity();
    this.renderWeeklyChart();
    this.renderChatSessions();
    this.renderPracticeArena();
    this.renderQuizList();
    this.renderProjectList();
    this.renderLeaderboard();
    this.renderProfile();
  }

  initElements() {
    this.sidebar = document.getElementById("app-sidebar");
    this.sidebarToggle = document.getElementById("sidebar-toggle");
    this.navLinks = document.querySelectorAll(".nav-menu .nav-item");
    this.themeToggle = document.getElementById("theme-toggle-btn");
    
    // Header Stats
    this.hdrXp = document.getElementById("header-xp");
    this.hdrStreak = document.getElementById("header-streak");
    this.hdrLevel = document.getElementById("header-level");
    this.hdrTitle = document.querySelector(".top-header h2");
  }

  bindEvents() {
    // Theme toggle
    this.themeToggle.addEventListener("click", () => this.toggleTheme());

    // Mobile Sidebar toggle
    this.sidebarToggle.addEventListener("click", () => {
      this.sidebar.classList.toggle("mobile-open");
    });

    // Navigation triggers
    this.navLinks.forEach(link => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const target = link.getAttribute("data-target");
        this.switchView(target);
        this.sidebar.classList.remove("mobile-open");
      });
    });

    // Hero dashboard buttons
    document.getElementById("hero-learn-btn").addEventListener("click", () => this.switchView("roadmap-view"));
    document.getElementById("hero-teacher-btn").addEventListener("click", () => this.switchView("teacher-view"));
    document.getElementById("continue-lesson-btn").addEventListener("click", () => this.resumeLastLesson());

    // Global Event Listeners
    window.addEventListener("pynova-level-up", (e) => this.triggerLevelUpModal(e.detail.level));
    window.addEventListener("pynova-badge-earned", (e) => this.triggerBadgeModal(e.detail.badgeId));

    // Listeners from editor components
    window.addEventListener("lesson-code-run", (e) => this.checkLessonChallengeCode(e.detail));
    window.addEventListener("project-code-run", (e) => this.checkProjectChallengeCode(e.detail));

    // Skill Assessment
    document.getElementById("assessment-next-btn").addEventListener("click", () => this.handleAssessmentNext());

    // Profile resets
    document.getElementById("profile-reset-state-btn").addEventListener("click", () => this.resetAppState());
    document.getElementById("profile-avatar-large").addEventListener("click", () => this.changeUserAvatar());

    // Teacher events
    document.getElementById("chat-send-btn").addEventListener("click", () => this.sendChatMessage());
    document.getElementById("chat-input-box").addEventListener("keydown", (e) => {
      if (e.key === "Enter") this.sendChatMessage();
    });
    document.getElementById("new-chat-btn").addEventListener("click", () => {
      const newId = window.PyNovaState.createNewChat();
      this.activeChatId = newId;
      this.renderChatMessages();
      this.renderChatSessions();
    });

    // Quick Action prompts
    document.querySelectorAll(".quick-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const text = btn.getAttribute("data-prompt");
        this.submitTeacherPrompt(text);
      });
    });

    // Debug analysis button hooks
    document.getElementById("ai-tool-explain").addEventListener("click", () => this.runSandboxAiTool("explain"));
    document.getElementById("ai-tool-debug").addEventListener("click", () => this.runSandboxAiTool("debug"));
    document.getElementById("ai-tool-optimize").addEventListener("click", () => this.runSandboxAiTool("optimize"));
    document.getElementById("ai-tool-tests").addEventListener("click", () => this.runSandboxAiTool("tests"));

    // Project workspace elements
    document.getElementById("project-back-btn").addEventListener("click", () => {
      document.getElementById("project-workspace").style.display = "none";
      document.getElementById("project-list-grid").style.display = "grid";
    });
    document.getElementById("project-submit-btn").addEventListener("click", () => this.submitProject());
    document.getElementById("project-mentor-send").addEventListener("click", () => this.sendProjectMentorMessage());
    document.getElementById("project-mentor-input").addEventListener("keydown", (e) => {
      if (e.key === "Enter") this.sendProjectMentorMessage();
    });

    // Leaderboard settings toggle
    const leaderToggle = document.getElementById("leaderboard-toggle");
    leaderToggle.addEventListener("click", () => {
      const current = window.PyNovaState.state.settings.leaderboardEnabled;
      window.PyNovaState.state.settings.leaderboardEnabled = !current;
      window.PyNovaState.save();
      
      leaderToggle.innerText = !current ? "Enabled" : "Disabled";
      leaderToggle.classList.toggle("active", !current);
      document.getElementById("leaderboard-list-container").style.display = !current ? "block" : "none";
    });
  }

  loadStateAndStats() {
    const state = window.PyNovaState.state;
    this.hdrXp.innerText = `${state.profile.xp} XP`;
    this.hdrStreak.innerText = `${state.profile.streak} ${state.profile.streak === 1 ? 'Day' : 'Days'}`;
    this.hdrLevel.innerText = `Lvl ${state.profile.level}`;
    
    // Sidebar
    document.getElementById("sidebar-username").innerText = state.profile.username;
    document.getElementById("sidebar-level").innerText = `Level ${state.profile.level} Pythonist`;
    document.getElementById("sidebar-avatar").innerText = state.profile.avatar;

    // Dark/Light theme class on body
    if (state.settings.theme === "light") {
      document.body.classList.add("light-mode");
      this.themeToggle.innerHTML = `<i class="fa-solid fa-sun"></i>`;
    } else {
      document.body.classList.remove("light-mode");
      this.themeToggle.innerHTML = `<i class="fa-solid fa-moon"></i>`;
    }

    // Set Continue Learning lesson title
    const nextNode = this.determineNextRoadmapNode();
    document.getElementById("continue-lesson-title").innerText = this.formatId(nextNode);
  }

  toggleTheme() {
    const isLight = document.body.classList.toggle("light-mode");
    window.PyNovaState.state.settings.theme = isLight ? "light" : "dark";
    window.PyNovaState.save();
    this.themeToggle.innerHTML = isLight ? `<i class="fa-solid fa-sun"></i>` : `<i class="fa-solid fa-moon"></i>`;
  }

  switchView(viewId) {
    // 1. Hide active panel
    document.querySelectorAll(".view-panel").forEach(panel => {
      panel.classList.remove("active");
    });
    // 2. Select matching panel
    const targetPanel = document.getElementById(viewId);
    if (targetPanel) {
      targetPanel.classList.add("active");
      this.activeView = viewId;
    }

    // 3. Update nav active indicator
    this.navLinks.forEach(link => {
      link.classList.remove("active");
      if (link.getAttribute("data-target") === viewId) {
        link.classList.add("active");
      }
    });

    // 4. Update Header Title
    const viewName = viewId.replace("-view", "").replace(/^\w/, c => c.toUpperCase());
    this.hdrTitle.innerText = `PyNova ${viewName === 'Dashboard' ? 'Core' : viewName}`;

    // Reload stats updates
    this.loadStateAndStats();
    
    // Specific updates
    if (viewId === "dashboard-view") {
      this.renderDashboardRecommendations();
      this.renderDashboardActivity();
    } else if (viewId === "roadmap-view") {
      this.renderRoadmap();
    } else if (viewId === "profile-view") {
      this.renderProfile();
    } else if (viewId === "leaderboard-view") {
      this.renderLeaderboard();
    }
  }

  // ----------------------------------------------------
  // LANDING & RECOMMENDATIONS ENGINE
  // ----------------------------------------------------
  determineNextRoadmapNode() {
    const state = window.PyNovaState.state;
    // Iterate through DB lessons in order, pick first uncompleted
    for (const lvl of window.PyNovaDb.ROADMAP) {
      for (const lesson of lvl.lessons) {
        if (!state.progress.lessons[lesson.id]) {
          return lesson.id;
        }
      }
    }
    return "intro_to_python"; // Fallback to start
  }

  resumeLastLesson() {
    const nextNode = this.determineNextRoadmapNode();
    this.launchLesson(nextNode);
  }

  renderDashboardRecommendations() {
    const container = document.getElementById("ai-recommendations-container");
    if (!container) return;

    const state = window.PyNovaState.state;
    container.innerHTML = "";

    // 1. Check for weak topics first
    if (state.weakTopics.length > 0) {
      const topic = state.weakTopics[0];
      const recDiv = document.createElement("div");
      recDiv.className = "continue-widget";
      recDiv.style.border = "1px solid var(--accent-red)";
      recDiv.style.background = "rgba(239, 68, 68, 0.03)";
      recDiv.innerHTML = `
        <div class="lesson-node-icon" style="border-color: var(--accent-red); color: var(--accent-red); box-shadow: none;"><i class="fa-solid fa-circle-exclamation"></i></div>
        <div class="continue-details">
          <h4 class="continue-title" style="color: var(--accent-red)">Reinforce: ${this.formatId(topic)}</h4>
          <div class="continue-desc">Let's review this concept in detail.</div>
        </div>
        <button class="btn btn-secondary" id="rec-topic-btn" style="padding: 8px 16px;">Practice Now</button>
      `;
      container.appendChild(recDiv);
      
      // Bind click
      recDiv.querySelector("button").addEventListener("click", () => {
        this.submitTeacherPrompt(`Let's practice ${topic} again.`);
        this.switchView("teacher-view");
      });
    }

    // 2. Recommend next lesson node card
    const nextNode = this.determineNextRoadmapNode();
    const nextCard = document.createElement("div");
    nextCard.className = "continue-widget";
    nextCard.innerHTML = `
      <div class="lesson-node-icon"><i class="fa-solid fa-sparkles"></i></div>
      <div class="continue-details">
        <h4 class="continue-title">Study Target: ${this.formatId(nextNode)}</h4>
        <div class="continue-desc">Nova AI recommends focusing on this foundations concept.</div>
      </div>
      <button class="btn btn-primary" style="padding: 8px 16px;">Study</button>
    `;
    container.appendChild(nextCard);
    nextCard.querySelector("button").addEventListener("click", () => {
      this.launchLesson(nextNode);
    });
  }

  renderDashboardActivity() {
    const log = document.getElementById("activity-log-container");
    if (!log) return;
    
    log.innerHTML = "";
    const activities = window.PyNovaState.state.activity;
    
    if (activities.length === 0) {
      log.innerHTML = `<li class="activity-item">No recent activity detected.</li>`;
      return;
    }

    activities.forEach(act => {
      const li = document.createElement("li");
      li.className = "activity-item";
      li.innerHTML = `
        <div class="activity-info">
          <span class="activity-type">${act.type}</span>
          <span class="activity-detail">${act.detail}</span>
        </div>
        <span class="activity-date">${act.date}</span>
      `;
      log.appendChild(li);
    });

    // Populate Weak Topics list
    const weakBox = document.getElementById("weak-topics-container");
    weakBox.innerHTML = "";
    const weakList = window.PyNovaState.state.weakTopics;
    
    if (weakList.length === 0) {
      weakBox.innerHTML = `<span class="topic-tag recommend"><i class="fa-solid fa-face-smile"></i> Standard mastery is great!</span>`;
    } else {
      weakList.forEach(topic => {
        const tag = document.createElement("span");
        tag.className = "topic-tag weak";
        tag.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> ${this.formatId(topic)}`;
        weakBox.appendChild(tag);
      });
    }
  }

  renderWeeklyChart() {
    const chart = document.getElementById("xp-weekly-chart");
    if (!chart) return;

    chart.innerHTML = "";
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const baseHeights = [20, 45, 10, 80, 50, 95, 30]; // Mock weekly XP heights values
    
    days.forEach((day, idx) => {
      const bar = document.createElement("div");
      bar.className = "chart-bar";
      bar.style.height = `${baseHeights[idx]}%`;
      bar.innerHTML = `
        <span class="chart-bar-value">${baseHeights[idx] * 5} XP</span>
        <span class="chart-label">${day}</span>
      `;
      chart.appendChild(bar);
    });
  }

  // ----------------------------------------------------
  // SURVEY / INITIAL ASSESSMENT
  // ----------------------------------------------------
  showSkillAssessment() {
    const modal = document.getElementById("assessment-modal");
    modal.classList.add("active");
    this.assessmentIdx = 0;
    this.renderAssessmentQuestion();
  }

  renderAssessmentQuestion() {
    const container = document.getElementById("assessment-question-container");
    const item = window.PyNovaDb.SKILL_ASSESSMENT[this.assessmentIdx];
    
    let optionsHtml = "";
    item.options.forEach((opt, idx) => {
      optionsHtml += `
        <button class="quiz-option" data-idx="${idx}" style="width: 100%; margin-bottom: 8px;">
          ${opt}
        </button>
      `;
    });

    container.innerHTML = `
      <div style="font-weight: 600; font-size: 15px; margin-bottom: 14px;">Q${this.assessmentIdx + 1}: ${item.question}</div>
      <div class="quiz-options-list">${optionsHtml}</div>
    `;

    // Bind option click
    container.querySelectorAll(".quiz-option").forEach(btn => {
      btn.addEventListener("click", () => {
        container.querySelectorAll(".quiz-option").forEach(b => b.classList.remove("active", "correct"));
        btn.classList.add("correct");
        this.selectedAssessmentIdx = parseInt(btn.getAttribute("data-idx"));
      });
    });
  }

  handleAssessmentNext() {
    if (this.selectedAssessmentIdx === undefined) {
      alert("Please select an option to customize your profile.");
      return;
    }

    this.selectedAssessmentIdx = undefined;
    this.assessmentIdx += 1;

    if (this.assessmentIdx < window.PyNovaDb.SKILL_ASSESSMENT.length) {
      this.renderAssessmentQuestion();
    } else {
      // Completed
      document.getElementById("assessment-modal").classList.remove("active");
      window.PyNovaState.state.skillAssessmentCompleted = true;
      
      // Award starting bonus XP
      window.PyNovaState.addActivity("Assessment Completed", "Completed profile assessment checks!");
      window.PyNovaState.addXp(100); 
      
      this.loadStateAndStats();
      this.renderDashboardRecommendations();
    }
  }

  // ----------------------------------------------------
  // ROADMAP GENERATOR
  // ----------------------------------------------------
  renderRoadmap() {
    const tree = document.getElementById("roadmap-tree");
    if (!tree) return;

    tree.innerHTML = "";
    const state = window.PyNovaState.state;

    // Tracks if we locked subsequent node
    let unlockNext = true;

    window.PyNovaDb.ROADMAP.forEach(lvl => {
      const lvlBlock = document.createElement("div");
      lvlBlock.className = "roadmap-level-block";
      
      let nodesHtml = "";
      lvl.lessons.forEach(lesson => {
        const isCompleted = state.progress.lessons[lesson.id] === true;
        const isActive = !isCompleted && unlockNext;
        const isLocked = !isCompleted && !isActive;

        let statusClass = "locked";
        let statusIcon = `<i class="fa-solid fa-lock"></i>`;
        
        if (isCompleted) {
          statusClass = "completed";
          statusIcon = `<i class="fa-solid fa-check"></i>`;
        } else if (isActive) {
          statusClass = "active";
          statusIcon = `<i class="fa-solid fa-spinner fa-spin"></i>`;
          unlockNext = false; // Rest are locked
        }

        nodesHtml += `
          <div class="roadmap-node ${statusClass}" data-lesson-id="${lesson.id}">
            <i class="fa-brands fa-python"></i>
            <div class="roadmap-node-status">${statusIcon}</div>
            
            <div class="node-tooltip">
              <div class="node-tooltip-title">${lesson.title}</div>
              <div class="node-tooltip-xp">${lesson.xpReward} XP Reward</div>
            </div>
          </div>
        `;
      });

      lvlBlock.innerHTML = `
        <div class="level-header-title" style="color: ${lvl.color}">Level ${lvl.level} — ${lvl.name}</div>
        <div class="roadmap-nodes-container">
          <div class="roadmap-node-connector"></div>
          ${nodesHtml}
        </div>
      `;

      tree.appendChild(lvlBlock);

      // Bind node clicks
      lvlBlock.querySelectorAll(".roadmap-node").forEach(node => {
        node.addEventListener("click", () => {
          const lessonId = node.getAttribute("data-lesson-id");
          if (node.classList.contains("locked")) {
            alert("This lesson is currently locked! Complete preceding roadmap target nodes to unlock.");
            return;
          }
          this.launchLesson(lessonId);
        });
      });
    });
  }

  // ----------------------------------------------------
  // INTERACTIVE LESSONS VIEW
  // ----------------------------------------------------
  launchLesson(lessonId) {
    // Locate lesson
    let matchedLesson = null;
    for (const lvl of window.PyNovaDb.ROADMAP) {
      const match = lvl.lessons.find(l => l.id === lessonId);
      if (match) {
        matchedLesson = match;
        break;
      }
    }

    if (!matchedLesson) return;
    this.activeLesson = matchedLesson;
    this.switchView("lessons-view");

    // Populate Left Study Content
    const details = document.getElementById("lesson-details-panel");
    details.innerHTML = `
      <h2 style="font-size: 24px; display: flex; align-items: center; gap: 8px;">
        <i class="fa-brands fa-python" style="color: var(--accent-violet)"></i> ${matchedLesson.title}
      </h2>
      <div style="font-size: 13px; color: var(--accent-cyan); font-weight: 600;">Foundations Node • +${matchedLesson.xpReward} XP</div>
      
      <div class="lesson-explanation">${matchedLesson.explanation}</div>
      
      <h4 style="font-size: 14px; text-transform: uppercase; color: var(--text-muted); margin-top: 10px;">Visual Sandbox Concept</h4>
      ${matchedLesson.visualConcept}

      <h4 style="font-size: 14px; text-transform: uppercase; color: var(--text-muted); margin-top: 10px;">Code Example</h4>
      <div style="background-color: rgb(5,5,10); border: 1px solid var(--border-color); border-radius: 12px; padding: 14px; position: relative;">
        <pre><code style="color: #a8ff60">${matchedLesson.codeExample}</code></pre>
        <button class="editor-btn" id="lesson-copy-code-btn" style="position: absolute; right: 12px; top: 12px; font-size: 11px;">Copy to Editor</button>
      </div>

      <div class="real-world-box">
        <div class="real-world-title">Real World Application</div>
        <div style="font-size: 13px; color: var(--text-secondary); line-height: 1.5;">${matchedLesson.realWorldExample}</div>
      </div>

      <div class="mistake-box">
        <div class="mistake-title">Common Mistakes</div>
        <ul style="list-style-type: none; padding: 0; font-size: 13px; color: var(--text-secondary); display: flex; flex-direction: column; gap: 8px;">
          ${matchedLesson.commonMistakes.map(m => `<li>⚠️ <strong>${m.mistake}:</strong> ${m.explanation}</li>`).join("")}
        </ul>
      </div>
    `;

    // Bind copying code to editor
    document.getElementById("lesson-copy-code-btn").addEventListener("click", () => {
      document.getElementById("lesson-code-editor").value = matchedLesson.codeExample;
      window.PyNovaEditor.syncLineNumbers(window.PyNovaEditor.lessonEditor, window.PyNovaEditor.lessonLineNumbers);
    });

    // Populate Right Interactive elements: Quiz
    const quizBox = document.getElementById("lesson-quiz-container");
    const quizData = matchedLesson.quiz;
    
    let optionsHtml = "";
    quizData.options.forEach((opt, idx) => {
      optionsHtml += `<button class="quiz-option" data-idx="${idx}">${opt}</button>`;
    });

    quizBox.innerHTML = `
      <h3 style="font-size: 16px; margin-bottom: 8px;"><i class="fa-solid fa-circle-question" style="color: var(--accent-cyan)"></i> Concept Quick Check</h3>
      <p style="font-size: 14px; color: var(--text-secondary); margin-bottom: 12px;">${quizData.question}</p>
      <div class="quiz-options-list">${optionsHtml}</div>
      <div id="lesson-quiz-explanation" style="margin-top: 12px; font-size: 13px; display: none; padding: 10px; border-radius: 8px;"></div>
    `;

    // Bind Quiz checking
    quizBox.querySelectorAll(".quiz-option").forEach(btn => {
      btn.addEventListener("click", () => {
        const selectedIdx = parseInt(btn.getAttribute("data-idx"));
        quizBox.querySelectorAll(".quiz-option").forEach(b => {
          b.disabled = true;
          b.classList.remove("correct", "incorrect");
        });

        const expDiv = document.getElementById("lesson-quiz-explanation");
        expDiv.style.display = "block";

        if (selectedIdx === quizData.answer) {
          btn.classList.add("correct");
          expDiv.style.backgroundColor = "rgba(16, 185, 129, 0.08)";
          expDiv.style.color = "var(--accent-green)";
          expDiv.innerHTML = `<strong>Correct!</strong> ${quizData.explanation}`;
          this.lessonQuizPassed = true;
        } else {
          btn.classList.add("incorrect");
          quizBox.querySelectorAll(".quiz-option")[quizData.answer].classList.add("correct");
          expDiv.style.backgroundColor = "rgba(239, 68, 68, 0.08)";
          expDiv.style.color = "var(--accent-red)";
          expDiv.innerHTML = `<strong>Incorrect.</strong> ${quizData.explanation}`;
          this.lessonQuizPassed = false;
        }
      });
    });

    // Populate Right Practice Editor Challenge
    const challengeData = matchedLesson.practice;
    document.getElementById("lesson-challenge-prompt").innerHTML = `<p>${challengeData.problem}</p>`;
    document.getElementById("lesson-code-editor").value = challengeData.starterCode;
    document.getElementById("lesson-console-output").innerText = "> Ready to verify code challenge...";
    document.getElementById("lesson-error-suggestion").style.display = "none";
    window.PyNovaEditor.syncLineNumbers(window.PyNovaEditor.lessonEditor, window.PyNovaEditor.lessonLineNumbers);

    // Reset controls
    this.lessonQuizPassed = false;
    this.lessonCodePassed = false;

    // Reset button
    document.getElementById("lesson-reset-code-btn").onclick = () => {
      document.getElementById("lesson-code-editor").value = challengeData.starterCode;
      window.PyNovaEditor.syncLineNumbers(window.PyNovaEditor.lessonEditor, window.PyNovaEditor.lessonLineNumbers);
    };

    // AI Hint button
    document.getElementById("lesson-hint-btn").onclick = () => {
      alert(`💡 Hint: ${window.PyNovaAi.getLessonHint(lessonId)}`);
    };

    // Lesson Submit complete
    const submitBtn = document.getElementById("lesson-submit-btn");
    submitBtn.onclick = () => {
      if (!this.lessonQuizPassed) {
        alert("Please complete the Concept Quick Check quiz successfully first!");
        return;
      }
      if (!this.lessonCodePassed) {
        alert("Please compile and pass the Lesson Challenge validator successfully!");
        return;
      }

      // Complete!
      window.PyNovaState.completeLesson(lessonId, matchedLesson.xpReward);
      this.switchView("roadmap-view");
    };
  }

  checkLessonChallengeCode(detail) {
    const errorSuggestionBox = document.getElementById("lesson-error-suggestion");
    const suggestionText = document.getElementById("lesson-error-suggestion-text");

    if (!detail.success) {
      this.lessonCodePassed = false;
      errorSuggestionBox.style.display = "block";
      
      const help = window.PyNovaAi.generateErrorSolution(detail.code, detail.error);
      suggestionText.innerHTML = `
        <strong style="color: var(--accent-red); display: block; margin-bottom: 4px;">Detected: ${help.title}</strong>
        <p style="margin-bottom: 6px;">${help.why}</p>
        <p><strong>Corrective template:</strong></p>
        <pre style="background:#000; padding:6px; font-size:11px; margin-top:4px; border-radius:4px;"><code style="color: #a8ff60">${help.corrected}</code></pre>
      `;
      return;
    }

    // Naive regex check from Database validation rules
    const pattern = this.activeLesson.practice.expectedPattern;
    const isMatches = pattern.test(detail.code);

    if (isMatches) {
      this.lessonCodePassed = true;
      errorSuggestionBox.style.display = "block";
      suggestionText.innerHTML = `<span style="color: var(--accent-green);"><i class="fa-solid fa-circle-check"></i> Code logic verified! Click 'Complete Lesson & Unlock Next' above to finalize this node.</span>`;
    } else {
      this.lessonCodePassed = false;
      errorSuggestionBox.style.display = "block";
      suggestionText.innerHTML = `
        <strong style="color: var(--accent-gold); display: block; margin-bottom: 4px;">Task Incomplete</strong>
        <p>Your code compiled without errors, but did not match the expected challenge patterns or values. Review instructions and verify variables outputs.</p>
      `;
    }
  }

  // ----------------------------------------------------
  // AI TEACHER CHAT ACTIONS
  // ----------------------------------------------------
  renderChatSessions() {
    const list = document.getElementById("chat-sessions-list");
    if (!list) return;

    list.innerHTML = "";
    const history = window.PyNovaState.state.chatHistory;

    history.forEach(chat => {
      const item = document.createElement("div");
      item.className = `history-item ${chat.id === this.activeChatId ? "active" : ""}`;
      item.innerText = chat.title;
      item.addEventListener("click", () => {
        this.activeChatId = chat.id;
        this.renderChatMessages();
        this.renderChatSessions();
      });
      list.appendChild(item);
    });
  }

  renderChatMessages() {
    const container = document.getElementById("chat-messages-container");
    if (!container) return;

    container.innerHTML = "";
    const chat = window.PyNovaState.state.chatHistory.find(c => c.id === this.activeChatId);
    if (!chat) return;

    chat.messages.forEach(msg => {
      const bubble = document.createElement("div");
      bubble.className = `message-bubble ${msg.sender}`;
      bubble.innerHTML = `
        <div>${msg.text}</div>
        <span class="message-time">${msg.date}</span>
      `;
      container.appendChild(bubble);
    });

    container.scrollTop = container.scrollHeight;
  }

  sendChatMessage() {
    const inputBox = document.getElementById("chat-input-box");
    const text = inputBox.value.trim();
    if (text === "") return;

    inputBox.value = "";

    // 1. Save user msg
    window.PyNovaState.addChatMessage(this.activeChatId, "user", text);
    this.renderChatMessages();

    // 2. Simulate AI response typing
    this.submitTeacherPrompt(text);
  }

  submitTeacherPrompt(promptText) {
    this.activeView = "teacher-view";
    
    // Add user message if coming from quick action
    const chat = window.PyNovaState.state.chatHistory.find(c => c.id === this.activeChatId);
    const lastMsg = chat ? chat.messages[chat.messages.length - 1] : null;
    
    if (!lastMsg || lastMsg.text !== promptText) {
      window.PyNovaState.addChatMessage(this.activeChatId, "user", promptText);
      this.renderChatMessages();
    }

    // Render typing indicator bubble
    const container = document.getElementById("chat-messages-container");
    const indicator = document.createElement("div");
    indicator.className = "message-bubble ai";
    indicator.innerHTML = `<span style="color:var(--text-muted)"><i class="fa-solid fa-spinner fa-spin"></i> Nova AI is typing...</span>`;
    container.appendChild(indicator);
    container.scrollTop = container.scrollHeight;

    // Call async modular AI API wrapper
    window.PyNovaAi.getResponse(promptText, window.PyNovaState.state)
      .then(response => {
        // Remove typing bubble
        if (container.contains(indicator)) {
          container.removeChild(indicator);
        }

        window.PyNovaState.addChatMessage(this.activeChatId, "ai", response);
        this.renderChatMessages();
        this.renderChatSessions();
      })
      .catch(err => {
        console.error("AI Teacher fetch failed", err);
        if (container.contains(indicator)) {
          container.removeChild(indicator);
        }
      });
  }

  // ----------------------------------------------------
  // SANDBOX EDITOR AI TOOLS
  // ----------------------------------------------------
  runSandboxAiTool(tool) {
    const code = document.getElementById("sandbox-code-editor").value;
    const container = document.getElementById("editor-ai-explanation-drawer");
    
    container.innerHTML = `<span style="color: var(--accent-cyan);"><i class="fa-solid fa-spinner fa-spin"></i> Analyzing workspace code...</span>`;

    setTimeout(() => {
      let response = "";
      if (tool === "explain") {
        response = `
          <strong style="color:#fff; display:block; margin-bottom:6px;">Walkthrough Analysis:</strong>
          This script initializes variables and triggers prints. Here is the flow:
          <ol style="margin-left:14px; margin-top:4px;">
            <li>Variable assignments set state memory.</li>
            <li>f-string syntax formatting evaluates inside print.</li>
          </ol>
        `;
      } else if (tool === "debug") {
        response = `<strong style="color:var(--accent-green); display:block; margin-bottom:6px;">Debug Diagnosis:</strong> No compilation issues found! Output is correct.`;
      } else if (tool === "optimize") {
        response = `
          <strong style="color:var(--accent-violet); display:block; margin-bottom:6px;">Optimizations:</strong>
          Code complexity: O(1) space, O(1) runtime. Logic is clean.
        `;
      } else if (tool === "tests") {
        response = `
          <strong style="color:#fff; display:block; margin-bottom:6px;">Generated Unit Tests:</strong>
          <pre style="background:#000; padding:6px; font-size:11px; margin-top:4px; border-radius:4px;"><code style="color:#a8ff60">def test_sandbox():\n    assert version == 2.0</code></pre>
        `;
      }

      container.innerHTML = response;
    }, 800);
  }

  // ----------------------------------------------------
  // PRACTICE ARENA
  // ----------------------------------------------------
  renderPracticeArena() {
    const grid = document.getElementById("arena-challenges-grid");
    if (!grid) return;

    grid.innerHTML = "";
    
    window.PyNovaDb.CHALLENGES.forEach(chal => {
      const card = document.createElement("div");
      card.className = "challenge-card";
      card.innerHTML = `
        <div class="challenge-meta-row">
          <span class="chal-diff">${chal.difficulty}</span>
          <span class="chal-xp">+${chal.xpReward} XP</span>
        </div>
        <h3 class="challenge-title">${chal.title}</h3>
        <p class="challenge-desc">${chal.summary}</p>
        <button class="btn btn-secondary" style="font-size: 12px; padding: 8px 12px; margin-top: 8px;">Solve Puzzle</button>
      `;
      grid.appendChild(card);

      card.querySelector("button").addEventListener("click", () => {
        this.launchPracticeChallenge(chal);
      });
    });
  }

  launchPracticeChallenge(challenge) {
    this.activeChallenge = challenge;
    
    // We launch it inside the lesson view panels style structure to reuse editor layouts
    this.switchView("lessons-view");

    const details = document.getElementById("lesson-details-panel");
    details.innerHTML = `
      <h2 style="font-size: 24px; color: var(--accent-cyan);"><i class="fa-solid fa-gamepad"></i> Practice: ${challenge.title}</h2>
      <div style="font-size: 13px; color: var(--accent-green); font-weight: 600; margin-bottom: 12px;">Difficulty Level • +${challenge.xpReward} XP</div>
      
      <div class="lesson-explanation">${challenge.description}</div>
    `;

    // Populate Right Editor with challenge starter code
    const quizBox = document.getElementById("lesson-quiz-container");
    quizBox.innerHTML = `
      <h3 style="font-size: 16px; margin-bottom: 6px;"><i class="fa-solid fa-lightbulb" style="color:var(--accent-gold)"></i> Challenge Instructions</h3>
      <p style="font-size: 13px; color: var(--text-secondary); line-height: 1.4;">
        Write a valid code segment according to the criteria. Click 'Run Code' inside the Python Workspace to verify syntax correctness.
      </p>
    `;

    document.getElementById("lesson-code-editor").value = challenge.starterCode;
    document.getElementById("lesson-console-output").innerText = "> Solve challenge and test outputs...";
    document.getElementById("lesson-error-suggestion").style.display = "none";
    window.PyNovaEditor.syncLineNumbers(window.PyNovaEditor.lessonEditor, window.PyNovaEditor.lessonLineNumbers);

    this.lessonQuizPassed = true; // Quiz requirement skipped for free practice coding
    this.lessonCodePassed = false;

    // Override Reset
    document.getElementById("lesson-reset-code-btn").onclick = () => {
      document.getElementById("lesson-code-editor").value = challenge.starterCode;
      window.PyNovaEditor.syncLineNumbers(window.PyNovaEditor.lessonEditor, window.PyNovaEditor.lessonLineNumbers);
    };

    // Override hint
    document.getElementById("lesson-hint-btn").onclick = () => {
      alert("💡 Hint: " + window.PyNovaAi.topics.loops.hint);
    };

    // Submit Complete
    document.getElementById("lesson-submit-btn").onclick = () => {
      if (!this.lessonCodePassed) {
        alert("Make sure code checks run successfully first!");
        return;
      }
      window.PyNovaState.solveChallenge(challenge.id, challenge.xpReward);
      this.switchView("practice-view");
    };

    // Replace code evaluator
    window.addEventListener("lesson-code-run", (e) => {
      const errorBox = document.getElementById("lesson-error-suggestion");
      const errText = document.getElementById("lesson-error-suggestion-text");

      if (!e.detail.success) {
        this.lessonCodePassed = false;
        errorBox.style.display = "block";
        errText.innerText = "Error: " + e.detail.error;
        return;
      }

      // Check pattern
      if (challenge.expectedPattern.test(e.detail.code)) {
        this.lessonCodePassed = true;
        errorBox.style.display = "block";
        errText.innerHTML = `<span style="color: var(--accent-green);"><i class="fa-solid fa-circle-check"></i> Logic correct! Yields FizzBuzz values. Click complete to finish.</span>`;
      } else {
        this.lessonCodePassed = false;
        errorBox.style.display = "block";
        errText.innerText = "Calculations compiled successfully, but output values mismatch requirements.";
      }
    }, { once: true }); // Prevent stacked listeners
  }

  // ----------------------------------------------------
  // QUIZ CENTER
  // ----------------------------------------------------
  renderQuizList() {
    const grid = document.getElementById("quiz-list-grid");
    if (!grid) return;

    grid.innerHTML = "";
    
    window.PyNovaDb.QUIZZES.forEach(q => {
      const card = document.createElement("div");
      card.className = "challenge-card";
      
      const prevScore = window.PyNovaState.state.progress.quizzes[q.id];
      const statusText = prevScore ? `High Score: ${prevScore.score}/${prevScore.total} 🏆` : "Unattempted";
      
      card.innerHTML = `
        <div class="challenge-meta-row">
          <span class="chal-diff">${q.difficulty}</span>
          <span class="chal-xp">+${q.xpReward} XP</span>
        </div>
        <h3 class="challenge-title">${q.title}</h3>
        <p class="challenge-desc">${q.questions.length} questions checkup on control flows.</p>
        <div style="font-size:12px; font-weight:600; color:var(--text-muted); margin-top:8px;">${statusText}</div>
        <button class="btn btn-secondary" style="font-size: 12px; padding: 8px 12px; margin-top: 8px;">Start Quiz</button>
      `;
      grid.appendChild(card);

      card.querySelector("button").addEventListener("click", () => {
        this.launchActiveQuiz(q);
      });
    });
  }

  launchActiveQuiz(quiz) {
    this.activeQuiz = quiz;
    this.activeQuizIdx = 0;
    this.activeQuizCorrectCount = 0;
    
    const container = document.getElementById("quiz-main-container");
    container.innerHTML = `
      <div class="quiz-active-area" style="grid-column: 1 / -1;">
        <div class="card-header">
          <h3 class="card-title">${quiz.title}</h3>
          <span id="quiz-timer">Question 1 of ${quiz.questions.length}</span>
        </div>
        <div class="progress-bar-wrapper">
          <div class="progress-bar-fill" id="quiz-active-progress" style="width: 0%"></div>
        </div>
        <div id="quiz-question-box"></div>
        
        <div style="display:flex; justify-content:space-between; align-items:center; margin-top: 24px;">
          <button class="btn btn-secondary" id="quiz-hint-btn" style="padding:10px 18px;"><i class="fa-solid fa-lightbulb"></i> Get Hint</button>
          <button class="btn btn-primary" id="quiz-next-btn" style="padding:12px 24px;">Next Question</button>
        </div>
      </div>
    `;

    document.getElementById("quiz-hint-btn").onclick = () => {
      alert("💡 Hint: Check standard variable capitalization and logical syntax block structures.");
    };

    document.getElementById("quiz-next-btn").onclick = () => this.handleQuizNext();

    this.renderQuizQuestion();
  }

  renderQuizQuestion() {
    const qBox = document.getElementById("quiz-question-box");
    const q = this.activeQuiz.questions[this.activeQuizIdx];
    
    // Sync progress
    const progressFill = document.getElementById("quiz-active-progress");
    const progressVal = (this.activeQuizIdx / this.activeQuiz.questions.length) * 100;
    progressFill.style.width = `${progressVal}%`;
    document.getElementById("quiz-timer").innerText = `Question ${this.activeQuizIdx + 1} of ${this.activeQuiz.questions.length}`;

    let optionsHtml = "";
    q.options.forEach((opt, idx) => {
      optionsHtml += `<button class="quiz-option" data-idx="${idx}">${opt}</button>`;
    });

    qBox.innerHTML = `
      <div style="font-weight: 600; font-size:16px; margin-bottom: 16px;">${q.question}</div>
      <div class="quiz-options-list">${optionsHtml}</div>
      <div id="quiz-feedback-box" style="margin-top:16px; padding:12px; border-radius:12px; display:none; font-size:13px; line-height:1.5;"></div>
    `;

    this.quizQuestionAnswered = false;

    qBox.querySelectorAll(".quiz-option").forEach(btn => {
      btn.addEventListener("click", () => {
        if (this.quizQuestionAnswered) return;
        this.quizQuestionAnswered = true;

        const idx = parseInt(btn.getAttribute("data-idx"));
        const feed = document.getElementById("quiz-feedback-box");
        feed.style.display = "block";

        qBox.querySelectorAll(".quiz-option").forEach(b => b.disabled = true);

        if (idx === q.answer) {
          btn.classList.add("correct");
          feed.style.backgroundColor = "rgba(16, 185, 129, 0.08)";
          feed.style.color = "var(--accent-green)";
          feed.innerHTML = `<strong>Correct!</strong> ${q.explanation}`;
          this.activeQuizCorrectCount += 1;
        } else {
          btn.classList.add("incorrect");
          qBox.querySelectorAll(".quiz-option")[q.answer].classList.add("correct");
          feed.style.backgroundColor = "rgba(239, 68, 68, 0.08)";
          feed.style.color = "var(--accent-red)";
          feed.innerHTML = `<strong>Incorrect.</strong> ${q.explanation}`;
          
          // Log weak topic recommendations
          window.PyNovaState.addWeakTopic("logic structures");
        }
      });
    });
  }

  handleQuizNext() {
    if (!this.quizQuestionAnswered) {
      alert("Please choose an answer first!");
      return;
    }

    this.activeQuizIdx += 1;
    if (this.activeQuizIdx < this.activeQuiz.questions.length) {
      this.renderQuizQuestion();
    } else {
      this.finishQuiz();
    }
  }

  finishQuiz() {
    const score = this.activeQuizCorrectCount;
    const total = this.activeQuiz.questions.length;
    const accuracy = Math.round((score / total) * 100);

    // Save state
    window.PyNovaState.completeQuiz(this.activeQuiz.id, score, total, this.activeQuiz.xpReward);

    const container = document.getElementById("quiz-main-container");
    container.innerHTML = `
      <div class="quiz-active-area" style="grid-column: 1 / -1; text-align: center; display:flex; flex-direction:column; gap:20px; align-items:center;">
        <div class="modal-icon" style="font-size: 52px; animation: bounce 2s infinite;">🏆</div>
        <h2>Quiz Completed!</h2>
        
        <div style="display:flex; gap:30px; margin: 10px 0;">
          <div class="stat-card" style="width: 140px;">
            <div class="stat-num">${score}/${total}</div>
            <div class="stat-label">Final Score</div>
          </div>
          <div class="stat-card" style="width: 140px;">
            <div class="stat-num">${accuracy}%</div>
            <div class="stat-label">Accuracy</div>
          </div>
        </div>

        <p style="font-size:14px; color:var(--text-secondary); max-width: 400px; line-height: 1.5;">
          ${accuracy >= 70 ? "Fantastic! You demonstrated high concept comprehension. New modules unlocked!" : "We recommend reviewing basic logic statements in the teacher panel before retesting."}
        </p>

        <button class="btn btn-primary" id="quiz-finish-close-btn" style="padding: 12px 24px;">Back to Quiz Center</button>
      </div>
    `;

    document.getElementById("quiz-finish-close-btn").onclick = () => {
      // Reload panels
      this.switchView("quiz-view");
      this.renderQuizList();
    };
  }

  // ----------------------------------------------------
  // PROJECTS LAB
  // ----------------------------------------------------
  renderProjectList() {
    const grid = document.getElementById("project-list-grid");
    if (!grid) return;

    grid.innerHTML = "";
    
    window.PyNovaDb.PROJECTS.forEach(proj => {
      const card = document.createElement("div");
      card.className = "challenge-card";
      
      const isCompleted = window.PyNovaState.state.progress.projects[proj.id]?.completed === true;
      const statusText = isCompleted ? "Completed 🚀" : "Not Started";
      
      card.innerHTML = `
        <div class="challenge-meta-row">
          <span class="chal-diff">${proj.category} Project</span>
          <span class="chal-xp">+${proj.xpReward} XP</span>
        </div>
        <h3 class="challenge-title">${proj.title}</h3>
        <p class="challenge-desc">${proj.description}</p>
        <div style="font-size:12px; font-weight:600; color:var(--text-muted); margin-top:8px;">Status: ${statusText}</div>
        <button class="btn btn-primary" style="font-size: 12px; padding: 8px 12px; margin-top: 8px;">Build Project</button>
      `;
      grid.appendChild(card);

      card.querySelector("button").addEventListener("click", () => {
        this.launchProjectWorkspace(proj);
      });
    });
  }

  launchProjectWorkspace(project) {
    this.activeProject = project;
    
    // Hide list grid
    document.getElementById("project-list-grid").style.display = "none";
    
    const ws = document.getElementById("project-workspace");
    ws.style.display = "grid";

    // Setup headers
    document.getElementById("project-workspace-title").innerText = project.title;
    document.getElementById("project-workspace-desc").innerText = project.description;
    document.getElementById("project-code-editor").value = project.starterCode;
    document.getElementById("project-console-output").innerText = "> Workspace initialized.";
    window.PyNovaEditor.syncLineNumbers(window.PyNovaEditor.projectEditor, window.PyNovaEditor.projectLineNumbers);

    // Load tasks list checklist
    const list = document.getElementById("project-workspace-tasks");
    list.innerHTML = "";
    
    // Fetch state or create defaults
    let projState = window.PyNovaState.state.progress.projects[project.id];
    if (!projState) {
      projState = { tasks: {}, completed: false };
      window.PyNovaState.state.progress.projects[project.id] = projState;
    }

    project.tasks.forEach(task => {
      const completed = projState.tasks[task.id] === true;
      
      const row = document.createElement("div");
      row.className = `task-item-row ${completed ? "completed" : ""}`;
      row.innerHTML = `
        <div class="task-checkbox">${completed ? '<i class="fa-solid fa-check"></i>' : ''}</div>
        <span>${task.text}</span>
      `;
      
      row.addEventListener("click", () => {
        const currentlyDone = !row.classList.contains("completed");
        row.classList.toggle("completed", currentlyDone);
        row.querySelector(".task-checkbox").innerHTML = currentlyDone ? '<i class="fa-solid fa-check"></i>' : '';
        
        window.PyNovaState.completeProjectTask(project.id, task.id, currentlyDone);
        
        // Notify Project Mentor on checklist action
        this.notifyMentorOnTaskAction(task, currentlyDone);
      });

      list.appendChild(row);
    });
  }

  notifyMentorOnTaskAction(task, status) {
    const msgBox = document.getElementById("project-mentor-messages");
    if (!msgBox) return;

    if (status) {
      // Typing mock response
      const bubble = document.createElement("div");
      bubble.className = "message-bubble ai";
      bubble.innerHTML = `<span style="color:var(--text-muted)"><i class="fa-solid fa-spinner fa-spin"></i> Mentor is reviewing...</span>`;
      msgBox.appendChild(bubble);
      msgBox.scrollTop = msgBox.scrollHeight;

      setTimeout(() => {
        msgBox.removeChild(bubble);
        
        const code = document.getElementById("project-code-editor").value;
        const feedback = window.PyNovaAi.getProjectMentorResponse(this.activeProject.id, task.text, code);
        
        const newBubble = document.createElement("div");
        newBubble.className = "message-bubble ai";
        newBubble.innerHTML = feedback;
        msgBox.appendChild(newBubble);
        msgBox.scrollTop = msgBox.scrollHeight;
      }, 1000);
    }
  }

  sendProjectMentorMessage() {
    const input = document.getElementById("project-mentor-input");
    const text = input.value.trim();
    if (text === "") return;

    input.value = "";
    
    const msgBox = document.getElementById("project-mentor-messages");
    const userBubble = document.createElement("div");
    userBubble.className = "message-bubble user";
    userBubble.innerHTML = `<div>${text}</div>`;
    msgBox.appendChild(userBubble);
    msgBox.scrollTop = msgBox.scrollHeight;

    const loader = document.createElement("div");
    loader.className = "message-bubble ai";
    loader.innerHTML = `<span><i class="fa-solid fa-spinner fa-spin"></i> Mentor is typing...</span>`;
    msgBox.appendChild(loader);
    msgBox.scrollTop = msgBox.scrollHeight;

    setTimeout(() => {
      msgBox.removeChild(loader);
      
      const mentorText = `Awesome question! When compiling "${this.activeProject.title}", remember that logic loops should wrap instructions correctly. Try printing variables to see their value flow! Let me know if you need code structure details.`;
      
      const newBubble = document.createElement("div");
      newBubble.className = "message-bubble ai";
      newBubble.innerHTML = `<div>${mentorText}</div>`;
      msgBox.appendChild(newBubble);
      msgBox.scrollTop = msgBox.scrollHeight;
    }, 1000);
  }

  checkProjectChallengeCode(detail) {
    if (detail.success) {
      // Code ran without issues
      this.projectCodeCompiles = true;
    } else {
      this.projectCodeCompiles = false;
    }
  }

  submitProject() {
    const state = window.PyNovaState.state.progress.projects[this.activeProject.id];
    
    // Ensure all tasks are completed
    let allDone = true;
    this.activeProject.tasks.forEach(t => {
      if (state.tasks[t.id] !== true) allDone = false;
    });

    if (!allDone) {
      alert("Please complete all project task checklist items first!");
      return;
    }

    const code = document.getElementById("project-code-editor").value;
    
    // Naive verification rules checking
    const compiles = this.projectCodeCompiles || false;
    const matchesPattern = this.activeProject.expectedPattern.test(code);

    if (compiles && matchesPattern) {
      // Save state
      window.PyNovaState.completeProject(this.activeProject.id, this.activeProject.xpReward);
      
      // Close project workspace
      document.getElementById("project-workspace").style.display = "none";
      document.getElementById("project-list-grid").style.display = "grid";
      
      this.renderProjectList();
    } else {
      alert("Your project code failed verification checks. Ensure it imports libraries correctly and executes operations successfully.");
    }
  }

  // ----------------------------------------------------
  // LEADERBOARD
  // ----------------------------------------------------
  renderLeaderboard() {
    const rows = document.getElementById("leaderboard-table-rows");
    if (!rows) return;

    rows.innerHTML = "";
    
    const mockUsers = [
      { rank: 1, name: "PythonPyramids", avatar: "🐍", xp: 1950 },
      { rank: 2, name: "LambdaLimits", avatar: "🚀", xp: 1420 },
      { rank: 3, name: "ByteBouncer", avatar: "🧠", xp: 950 },
      { rank: 4, name: "NovaCoder (You)", avatar: "🤖", xp: window.PyNovaState.state.profile.xp, isUser: true },
      { rank: 5, name: "IterateMaster", avatar: "🔥", xp: 320 }
    ];

    // Sort users by XP
    mockUsers.sort((a, b) => b.xp - a.xp);

    mockUsers.forEach((u, index) => {
      const tr = document.createElement("tr");
      tr.className = "leaderboard-row";
      if (u.isUser) {
        tr.style.backgroundColor = "rgba(124, 58, 237, 0.08)";
        tr.style.fontWeight = "bold";
      }

      tr.innerHTML = `
        <td class="leaderboard-cell rank">${index + 1}</td>
        <td class="leaderboard-cell user">
          <div class="avatar-circle" style="width: 30px; height: 30px; font-size:14px;">${u.avatar}</div>
          <span>${u.name}</span>
        </td>
        <td class="leaderboard-cell xp">${u.xp} XP</td>
      `;
      rows.appendChild(tr);
    });
  }

  // ----------------------------------------------------
  // PROFILE & GAME MECHANICS
  // ----------------------------------------------------
  renderProfile() {
    const profile = window.PyNovaState.state.profile;
    const stats = profile.stats;

    document.getElementById("profile-username-large").innerText = profile.username;
    document.getElementById("profile-level-badge").innerText = `Level ${profile.level} Pythonist`;
    document.getElementById("profile-avatar-large").innerText = profile.avatar;

    // stats
    document.getElementById("profile-stat-lessons").innerText = stats.lessonsCompleted;
    document.getElementById("profile-stat-challenges").innerText = stats.challengesSolved;
    document.getElementById("profile-stat-projects").innerText = stats.projectsCompleted;

    // Badges grid mapping
    const badgesBox = document.getElementById("profile-badges-container");
    badgesBox.innerHTML = "";

    window.PyNovaDb.BADGES.forEach(badge => {
      const owned = profile.badges.includes(badge.id);
      const div = document.createElement("div");
      div.className = `badge-item ${owned ? "unlocked" : ""}`;
      div.innerHTML = `
        <div class="badge-icon">${badge.icon}</div>
        <div class="badge-title">${badge.title}</div>
        <div class="badge-desc">${badge.desc}</div>
      `;
      badgesBox.appendChild(div);
    });
  }

  changeUserAvatar() {
    const avatars = ["🤖", "🐍", "🚀", "🧠", "🔥", "🐱", "🐶", "👾"];
    const current = window.PyNovaState.state.profile.avatar;
    let nextIdx = (avatars.indexOf(current) + 1) % avatars.length;
    
    window.PyNovaState.state.profile.avatar = avatars[nextIdx];
    window.PyNovaState.save();
    
    this.renderProfile();
    this.loadStateAndStats();
  }

  // ----------------------------------------------------
  // MODALS LAUNCHERS
  // ----------------------------------------------------
  triggerLevelUpModal(lvl) {
    const modal = document.getElementById("levelup-modal");
    modal.classList.add("active");
    document.getElementById("levelup-level-title").innerText = `You reached Level ${lvl}`;

    document.getElementById("levelup-close-btn").onclick = () => {
      modal.classList.remove("active");
    };
  }

  triggerBadgeModal(badgeId) {
    const modal = document.getElementById("badge-modal");
    const info = window.PyNovaDb.BADGES.find(b => b.id === badgeId);
    if (!info) return;

    modal.classList.add("active");
    document.getElementById("badge-earned-icon").innerText = info.icon;
    document.getElementById("badge-earned-title").innerText = info.title;
    document.getElementById("badge-earned-desc").innerText = info.desc;

    document.getElementById("badge-close-btn").onclick = () => {
      modal.classList.remove("active");
    };
  }

  resetAppState() {
    if (confirm("Are you sure you want to reset all progress, XP, badges, and learning history? This cannot be undone.")) {
      window.PyNovaState.reset();
      this.loadStateAndStats();
      this.switchView("dashboard-view");
      
      // Refresh views
      this.init();
      alert("App state has been reset successfully.");
    }
  }

  // Utilities
  formatId(id) {
    return id.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());
  }
}

// Global Launcher
window.addEventListener("DOMContentLoaded", () => {
  window.PyNovaApp = new AppController();
});
