// PyNova AI - Global State Management

const DEFAULT_STATE = {
  profile: {
    username: "NovaCoder",
    avatar: "🤖",
    level: 1,
    xp: 0,
    streak: 1,
    lastActiveDate: new Date().toDateString(),
    badges: ["badge_code"], // Default starting badge
    stats: {
      lessonsCompleted: 0,
      challengesSolved: 0,
      quizzesCompleted: 0,
      debugsRun: 0,
      projectsCompleted: 0
    }
  },
  progress: {
    lessons: {},       // lessonId: true/false
    quizzes: {},       // quizId: { score, total, date }
    challenges: {},    // challengeId: true/false
    projects: {}       // projectId: { tasks: { taskId: boolean }, completed: boolean }
  },
  weakTopics: [],      // array of strings
  activity: [],        // array of { type, detail, date }
  chatHistory: [
    {
      id: "chat_welcome",
      title: "Welcome to PyNova",
      messages: [
        { sender: "ai", text: "Hello! I am your PyNova AI Teacher. Let's learn Python together. How can I help you today?", date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
      ]
    }
  ],
  activeRoadmapNode: "intro_to_python",
  skillAssessmentCompleted: false,
  settings: {
    leaderboardEnabled: true,
    theme: "dark"
  }
};

class StateManager {
  constructor() {
    this.key = "pynova_user_state";
    this.state = null;
    this.listeners = [];
    this.init();
  }

  init() {
    const saved = localStorage.getItem(this.key);
    if (saved) {
      try {
        this.state = JSON.parse(saved);
        // Ensure backwards compatibility if schema changes
        this.state = { ...DEFAULT_STATE, ...this.state };
        this.state.profile = { ...DEFAULT_STATE.profile, ...this.state.profile };
        this.state.progress = { ...DEFAULT_STATE.progress, ...this.state.progress };
        this.state.settings = { ...DEFAULT_STATE.settings, ...this.state.settings };
      } catch (e) {
        console.error("Failed to parse saved state, resetting...", e);
        this.state = JSON.parse(JSON.stringify(DEFAULT_STATE));
      }
    } else {
      this.state = JSON.parse(JSON.stringify(DEFAULT_STATE));
      // Pre-add a welcome activity
      this.addActivity("Account Created", "Welcome to PyNova AI!");
    }
    this.updateStreak();
    this.save();
  }

  save() {
    localStorage.setItem(this.key, JSON.stringify(this.state));
    this.notifyListeners();
  }

  reset() {
    this.state = JSON.parse(JSON.stringify(DEFAULT_STATE));
    this.save();
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notifyListeners() {
    this.listeners.forEach(listener => listener(this.state));
  }

  updateStreak() {
    const today = new Date().toDateString();
    const lastActive = this.state.profile.lastActiveDate;

    if (lastActive !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      if (lastActive === yesterday.toDateString()) {
        this.state.profile.streak += 1;
        this.addActivity("Streak Maintained", `You're on a ${this.state.profile.streak}-day learning streak! 🔥`);
        if (this.state.profile.streak >= 7) {
          this.awardBadge("badge_streak");
        }
      } else {
        // Streak broken
        this.state.profile.streak = 1;
      }
      this.state.profile.lastActiveDate = today;
    }
  }

  addXp(amount) {
    const oldLevel = this.state.profile.level;
    this.state.profile.xp += amount;
    
    // XP progression formula: Level = Math.floor(Math.sqrt(xp / 100)) + 1
    // Level 1: 0 XP
    // Level 2: 100 XP
    // Level 3: 400 XP
    // Level 4: 900 XP
    // Level 5: 1600 XP
    // etc.
    const newLevel = Math.floor(Math.sqrt(this.state.profile.xp / 100)) + 1;
    
    this.addActivity("XP Earned", `+${amount} XP gained`);

    if (this.state.profile.xp >= 2000) {
      this.awardBadge("badge_master");
    }

    if (newLevel > oldLevel) {
      this.state.profile.level = newLevel;
      this.addActivity("Level Up", `Congratulations! You reached Level ${newLevel}! 🏆`);
      
      // Fire level up modal event
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent("pynova-level-up", { detail: { level: newLevel } }));
      }, 500);
    }
    
    this.save();
  }

  getXpProgress() {
    const lvl = this.state.profile.level;
    const currentLevelXp = (lvl - 1) * (lvl - 1) * 100;
    const nextLevelXp = lvl * lvl * 100;
    const xpInLevel = this.state.profile.xp - currentLevelXp;
    const xpNeededForLevel = nextLevelXp - currentLevelXp;
    const percentage = Math.min(100, Math.max(0, (xpInLevel / xpNeededForLevel) * 100));

    return {
      currentLevelXp,
      nextLevelXp,
      xpInLevel,
      xpNeededForLevel,
      percentage
    };
  }

  completeLesson(lessonId, xpReward = 50) {
    if (!this.state.progress.lessons[lessonId]) {
      this.state.progress.lessons[lessonId] = true;
      this.state.profile.stats.lessonsCompleted += 1;
      this.addActivity("Lesson Completed", `Finished lesson: ${this.formatId(lessonId)}`);
      
      // Award beginner badge on first lesson completed
      if (this.state.profile.stats.lessonsCompleted === 1) {
        this.awardBadge("badge_beg");
      }
      
      this.addXp(xpReward);
      this.save();
    }
  }

  completeQuiz(quizId, score, total, xpReward = 80) {
    const existing = this.state.progress.quizzes[quizId];
    if (!existing || score > existing.score) {
      this.state.progress.quizzes[quizId] = { score, total, date: new Date().toDateString() };
      this.state.profile.stats.quizzesCompleted += 1;
      this.addActivity("Quiz Completed", `Scored ${score}/${total} on ${this.formatId(quizId)}`);

      if (score === total) {
        this.awardBadge("badge_quiz");
      }

      this.addXp(xpReward);
      this.save();
    }
  }

  solveChallenge(challengeId, xpReward = 100) {
    if (!this.state.progress.challenges[challengeId]) {
      this.state.progress.challenges[challengeId] = true;
      this.state.profile.stats.challengesSolved += 1;
      this.addActivity("Challenge Solved", `Solved code arena: ${this.formatId(challengeId)}`);
      this.addXp(xpReward);
      this.save();
    }
  }

  completeProjectTask(projectId, taskId, status) {
    if (!this.state.progress.projects[projectId]) {
      this.state.progress.projects[projectId] = { tasks: {}, completed: false };
    }
    this.state.progress.projects[projectId].tasks[taskId] = status;
    this.save();
  }

  completeProject(projectId, xpReward = 250) {
    if (!this.state.progress.projects[projectId]) {
      this.state.progress.projects[projectId] = { tasks: {}, completed: false };
    }
    if (!this.state.progress.projects[projectId].completed) {
      this.state.progress.projects[projectId].completed = true;
      this.state.profile.stats.projectsCompleted += 1;
      this.addActivity("Project Built", `Completed project: ${this.formatId(projectId)} 🚀`);
      
      this.awardBadge("badge_project");
      this.addXp(xpReward);
      this.save();
    }
  }

  incrementDebugCount() {
    this.state.profile.stats.debugsRun += 1;
    if (this.state.profile.stats.debugsRun === 1) {
      this.awardBadge("badge_bug");
    }
    this.save();
  }

  awardBadge(badgeId) {
    if (!this.state.profile.badges.includes(badgeId)) {
      this.state.profile.badges.push(badgeId);
      this.addActivity("Badge Earned", `Unlocked badge: ${badgeId}`);
      this.save();
      
      // Dispatch badge event
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent("pynova-badge-earned", { detail: { badgeId } }));
      }, 500);
    }
  }

  addActivity(type, detail) {
    this.state.activity.unshift({
      type,
      detail,
      date: new Date().toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
    });
    // Keep last 15 items
    if (this.state.activity.length > 15) {
      this.state.activity.pop();
    }
  }

  addWeakTopic(topic) {
    if (!this.state.weakTopics.includes(topic)) {
      this.state.weakTopics.push(topic);
      this.save();
    }
  }

  removeWeakTopic(topic) {
    this.state.weakTopics = this.state.weakTopics.filter(t => t !== topic);
    this.save();
  }

  addChatMessage(chatId, sender, text) {
    let chat = this.state.chatHistory.find(c => c.id === chatId);
    if (!chat) {
      chat = { id: chatId, title: text.substring(0, 25) + "...", messages: [] };
      this.state.chatHistory.unshift(chat);
    }
    chat.messages.push({
      sender,
      text,
      date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
    // If chat title was default, update it with a snippet of the first message
    if (chat.messages.length === 2 && chat.id !== 'chat_welcome') {
      chat.title = chat.messages[0].text.substring(0, 25) + "...";
    }
    this.save();
  }

  createNewChat() {
    const id = "chat_" + Date.now();
    const newChat = {
      id,
      title: "New AI Teacher Session",
      messages: [
        { sender: "ai", text: "Hello! I'm ready for another study session. Ask me any Python question, or select a lesson topic you want to dive into!", date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
      ]
    };
    this.state.chatHistory.unshift(newChat);
    this.save();
    return id;
  }

  formatId(id) {
    return id.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());
  }
}

window.PyNovaState = new StateManager();
