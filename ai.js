// PyNova AI - Dynamic Teacher & Mentor Response Generator

class AiTeacher {
  constructor() {
    this.lastTopic = null; // Track active conversation context for follow-up questions
    this.initTopicDatabase();
    this.initErrorDatabase();
  }

  initTopicDatabase() {
    this.topics = {
      variables: {
        title: "Variables and Memory",
        keywords: ["variable", "variables", "assign", "assignment", "memory", "store", "name", "="],
        explanation: `<h3>Variables & Memory Assignment</h3>
        <p>In Python, a <strong>variable</strong> is a named reference that points to a value stored in your computer's memory. You create them using the single equals sign (<code>=</code>), which is the <strong>assignment operator</strong>.</p>
        <pre><code class="python-code"># Assigning value to a variable
score = 100
user_name = "Nova"</code></pre>
        <p><strong>Line-by-line explanation:</strong></p>
        <ul>
          <li><code>score = 100</code>: Python allocates space in memory for the integer <code>100</code> and binds the name <code>score</code> to it.</li>
          <li><code>user_name = "Nova"</code>: Python allocates memory for the text sequence <code>"Nova"</code> and binds the name <code>user_name</code> to it.</li>
        </ul>`,
        example: `xp = 50
xp = xp + 10 # Re-assigning: updates xp to 60
print(f"Current XP: {xp}")`,
        beginner: "Imagine a variable as a storage drawer. You write a label on the drawer, say 'score', and drop a note inside that says '100'. Whenever you ask Python for 'score', it opens the drawer and reads you the note!",
        hint: "Variable names must start with a letter or underscore, cannot contain spaces or dashes, and are case-sensitive (score and Score are different!).",
        followups: ["What are the variable naming rules?", "How does memory allocation work in Python?"]
      },
      data_types: {
        title: "Data Types",
        keywords: ["data type", "data types", "type", "int", "float", "str", "string", "bool", "boolean", "typecast", "casting"],
        explanation: `<h3>Python Primitive Data Types</h3>
        <p>Every value in Python has a data type. Python detects this automatically (dynamic typing). The primary primitives are:</p>
        <ul>
          <li><strong>int:</strong> Integers (whole numbers), e.g., <code>score = 42</code></li>
          <li><strong>float:</strong> Decimals, e.g., <code>pi = 3.14</code></li>
          <li><strong>str:</strong> String (text values in quotes), e.g., <code>msg = "Hello"</code></li>
          <li><strong>bool:</strong> Booleans (truth values), either <code>True</code> or <code>False</code></li>
        </ul>
        <p>Use the <code>type()</code> function to inspect a value's data type, and cast types using constructor functions like <code>int()</code>, <code>float()</code>, or <code>str()</code>.</p>`,
        example: `# Check type and cast
value = "42"
num = int(value) # Cast string to integer
print(type(num)) # Outputs <class 'int'>`,
        beginner: "Think of data types like types of cargo. Water needs a tank (float), boxes need a crate (strings), and counts need a counter (integers). Python automatically labels the container for you!",
        hint: "Boolean values in Python must always be capitalized: True or False. Writing true or false in lowercase will raise a NameError.",
        followups: ["What is typecasting?", "What happens if I add a string and a number?"]
      },
      input: {
        title: "Input and Output",
        keywords: ["input", "input()", "user input", "keyboard", "prompt", "print"],
        explanation: `<h3>User Interactive Input & Output</h3>
        <p>To capture user input from the keyboard, use the <code>input()</code> function. It pauses execution, displays a prompt, and returns the entered value.</p>
        <p><strong>Crucial Rule:</strong> <code>input()</code> always returns data as a string (<code>str</code>). If you need a number, you must cast it immediately.</p>`,
        example: `# Capture age and check
age_input = input("Enter your age: ") # e.g. "18"
age = int(age_input) # Convert string to integer
next_year = age + 1
print(f"Next year you will be {next_year}")`,
        beginner: "Think of input() as a waiter taking your order. They write everything down as text (a string) on their notepad. If you order '3' burgers, you have to tell the kitchen it's the number 3, not the word '3'!",
        hint: "Always wrap numeric input prompts in casting: <code>age = int(input('Age: '))</code> to avoid type mismatches.",
        followups: ["Why does input() always return a string?", "How do f-strings help with output formatting?"]
      },
      operators: {
        title: "Arithmetic Operators",
        keywords: ["operator", "operators", "math", "add", "subtract", "multiply", "divide", "modulo", "remainder", "exponent", "power", "+", "-", "*", "/", "//", "%", "**"],
        explanation: `<h3>Python Operators</h3>
        <p>Operators perform mathematical and logical calculations on variables. The primary arithmetic operators are:</p>
        <ul>
          <li><code>+</code>, <code>-</code>, <code>*</code>: Addition, subtraction, multiplication</li>
          <li><code>/</code>: Division (always returns a decimal float!)</li>
          <li><code>//</code>: Floor Division (divides and discards decimal part, rounding down)</li>
          <li><code>%</code>: Modulo (returns division remainder)</li>
          <li><code>**</code>: Exponentiation (raises to a power)</li>
        </ul>`,
        example: `print(10 / 3)   # 3.3333333333333335 (Float Division)
print(10 // 3)  # 3 (Floor Division)
print(10 % 3)   # 1 (Remainder)
print(2 ** 3)   # 8 (2 raised to the power of 3)`,
        beginner: "Think of modulo (%) as distributing items. If you have 10 cookies and divide them among 3 friends, each gets 3 cookies, and 1 cookie is left over. 10 % 3 is 1!",
        hint: "Modulo (%) is extremely useful to check if a number is even or odd: <code>number % 2 == 0</code> returns True for even numbers.",
        followups: ["What is floor division?", "How do I check if a number is divisible by 5?"]
      },
      logic: {
        title: "Control Flow Logic",
        keywords: ["if", "else", "elif", "condition", "conditional", "comparison", "compare", "logical", "and", "or", "not", "==", "!=", ">", "<", ">=", "<="],
        explanation: `<h3>If, Elif, and Else Conditions</h3>
        <p>Conditions steer your program's direction. Python evaluates expressions to <code>True</code> or <code>False</code> using comparison and logical operators:</p>
        <ul>
          <li><strong>Comparison:</strong> <code>==</code> (equals), <code>!=</code> (not equal), <code>&gt;</code>, <code>&lt;</code>, <code>&gt;=</code>, <code>&lt;=</code></li>
          <li><strong>Logical:</strong> <code>and</code> (both must be true), <code>or</code> (at least one must be true), <code>not</code> (inverts value)</li>
        </ul>
        <pre><code class="python-code">score = 85
if score >= 90:
    print("Grade A")
elif score >= 70:
    print("Grade B")
else:
    print("Grade C")</code></pre>`,
        example: `# Compound operators check
age = 20
has_ticket = True
if age >= 18 and has_ticket:
    print("Welcome to PyNova Cinema!")
else:
    print("Access Denied.")`,
        beginner: "Imagine a flowchart or fork in the road. You ask a question: 'Do I have keys?' If Yes, open the door. If No, check the window (elif). If all else fails, wait outside (else)!",
        hint: "Do not confuse the assignment operator '=' with the equality comparison operator '=='. A single '=' sets values; double '==' compares them.",
        followups: ["What is the difference between '=' and '=='?", "Can I nest if statements inside each other?"]
      },
      loops: {
        title: "Loops & Iteration",
        keywords: ["loop", "loops", "for", "while", "range", "break", "continue", "nest", "nested loop", "iteration"],
        explanation: `<h3>For Loops, While Loops, and Ranges</h3>
        <p>Loops repeat code blocks. Python supports two main types:</p>
        <ul>
          <li><strong>For Loops:</strong> Iterates over a sequence (e.g. lists, ranges, or strings). Used when you know how many times to repeat.</li>
          <li><strong>While Loops:</strong> Repeats as long as a condition is <code>True</code>. Used when number of iterations is unknown.</li>
        </ul>
        <p>Use <code>break</code> to exit a loop immediately, and <code>continue</code> to skip the rest of the current iteration and jump to the next.</p>`,
        example: `# Loop 3 times using range
for i in range(1, 4):
    if i == 2:
        continue # Skips printing 2
    print(f"Iteration {i}")`,
        beginner: "A loop is like running laps. A for loop says: 'Run exactly 5 laps.' A while loop says: 'Run laps as long as it is not raining.' If it starts raining, you stop (break)!",
        hint: "Always ensure your <code>while</code> loop condition eventually becomes False, or update loop counters, to avoid an <strong>infinite loop</strong> that crashes your program.",
        followups: ["How does range() work?", "What is an infinite loop and how do I fix it?"]
      },
      strings: {
        title: "Strings and Text",
        keywords: ["string", "strings", "char", "text", "concat", "slice", "slicing", "format", "substring", "f-string"],
        explanation: `<h3>String Manipulation & Slicing</h3>
        <p>Strings are sequences of characters. In Python, you can manipulate strings using slicing and built-in methods:</p>
        <ul>
          <li><strong>Slicing:</strong> Extract parts of a string using indexes <code>string[start:stop:step]</code>.</li>
          <li><strong>Formatting:</strong> Inject variables using f-strings: <code>f"Value is {var}"</code>.</li>
        </ul>`,
        example: `text = "PythonCode"
print(text[0:6])   # Outputs "Python" (slice from index 0 up to 6)
print(text.lower()) # Outputs "pythoncode"
print("Py" in text) # Outputs True (substring checking)`,
        beginner: "Think of a string as a string of alphabet beads. You can count the beads starting at index 0, cut a slice of the beads (slicing), or paint them uppercase!",
        hint: "Python indexes start at 0. So in <code>word = 'Python'</code>, <code>word[0]</code> is 'P' and <code>word[-1]</code> is the last letter 'n'.",
        followups: ["What does negative index mean in slicing?", "How do string methods like .strip() and .replace() work?"]
      },
      lists: {
        title: "Lists",
        keywords: ["list", "lists", "append", "pop", "insert", "remove", "index", "sort", "array", "extend"],
        explanation: `<h3>Python Lists</h3>
        <p>Lists are ordered, mutable collections of items. You can store values of different types in a single list.</p>
        <ul>
          <li><code>list.append(x)</code>: Adds item <code>x</code> to the end.</li>
          <li><code>list.pop(i)</code>: Removes and returns item at index <code>i</code>.</li>
          <li><code>list.sort()</code>: Sorts elements in place.</li>
        </ul>`,
        example: `skills = ["Python", "JS"]
skills.append("AI")
skills.pop(1) # Removes "JS"
print(skills) # Outputs ["Python", "AI"]`,
        beginner: "A list is like a grocery list. You can write items down, add new items to the bottom (append), scratch items off (remove), or change 'milk' to 'almond milk'!",
        hint: "Lists are mutable, meaning you can edit their contents without creating a new list. Use lists when order matters and contents will change.",
        followups: ["How do I slice a list?", "What is the difference between append() and extend()?"]
      },
      tuples: {
        title: "Tuples",
        keywords: ["tuple", "tuples", "immutable", "unchangeable", "parentheses"],
        explanation: `<h3>Python Tuples</h3>
        <p>Tuples are ordered, **immutable** sequences of elements. Once created, you cannot add, remove, or modify their contents. They are defined using parentheses <code>()</code>.</p>
        <pre><code class="python-code"># Defining a tuple
coordinates = (40.7128, -74.0060)</code></pre>`,
        example: `my_tuple = (10, 20)
# my_tuple[0] = 99 # Throws a TypeError!
print(len(my_tuple)) # Outputs 2`,
        beginner: "A tuple is like a sealed document. You can read the information inside as much as you want, but you cannot write over it, erase it, or insert new lines!",
        hint: "Use tuples instead of lists for data that should not change throughout your program (like calendar months or database configs) to prevent accidental edits.",
        followups: ["Why use a tuple instead of a list?", "What is tuple unpacking?"]
      },
      sets: {
        title: "Sets",
        keywords: ["set", "sets", "unique", "union", "intersection", "difference", "duplicates"],
        explanation: `<h3>Python Sets</h3>
        <p>Sets are unordered collections of **unique** elements. Duplicates are automatically removed. Sets are defined using curly braces <code>{}</code> and are useful for mathematical set operations.</p>`,
        example: `numbers = {1, 2, 2, 3}
print(numbers) # Outputs {1, 2, 3} (duplicate 2 removed)
numbers.add(4)
print(2 in numbers) # Outputs True`,
        beginner: "Imagine a bag of marbles where every marble must be a different color. If you try to drop another red marble in, the bag spits it out. Every marble inside is unique!",
        hint: "Sets do not support indexing because they are unordered. Writing <code>my_set[0]</code> will raise a TypeError.",
        followups: ["What are union and intersection operations in sets?", "How do I remove duplicates from a list using a set?"]
      },
      dictionaries: {
        title: "Dictionaries",
        keywords: ["dictionary", "dictionaries", "dict", "key", "value", "keys", "values", "items", "lookup"],
        explanation: `<h3>Dictionaries (Key-Value Pairs)</h3>
        <p>Dictionaries are unordered, mutable mappings of keys to values. Keys must be unique and immutable (like strings or numbers).</p>
        <pre><code class="python-code"># Dictionary definition
student = {
    "name": "Nova",
    "level": 42
}
print(student["name"]) # Outputs "Nova"</code></pre>`,
        example: `profile = {"username": "NovaCoder", "xp": 100}
profile["xp"] += 50 # Updating key
profile["badge"] = "Beginner" # Adding key
print(profile)`,
        beginner: "A dictionary works just like a real-world dictionary. You search for a word (the Key) to find its definition (the Value). You cannot have the same word twice with different pages!",
        hint: "Use the <code>.get()</code> method to retrieve a key's value safely: <code>profile.get('age', 18)</code> returns 18 if 'age' doesn't exist, preventing crashes.",
        followups: ["How does .get() prevent errors?", "How do I loop through dictionary keys and values?"]
      },
      functions: {
        title: "Functions",
        keywords: ["function", "functions", "def", "return", "argument", "arguments", "parameter", "parameters", "scope", "lambda"],
        explanation: `<h3>Functions & Variable Scope</h3>
        <p>A function is a reusable block of code that runs only when called. You define it with <code>def</code>, pass inputs (parameters), and return outputs with <code>return</code>.</p>
        <pre><code class="python-code">def greet(name):
    return f"Hello, {name}!"

message = greet("Nova")
print(message)</code></pre>`,
        example: `# Function with default arguments & lambda
def add(a, b=10):
    return a + b

square = lambda x: x ** 2
print(add(5))       # Outputs 15
print(square(4))    # Outputs 16`,
        beginner: "A function is like a juicer machine. You feed in fruits (arguments), it runs internal mechanisms, and pours out juice (returns a value)!",
        hint: "Variables created inside a function are in <strong>local scope</strong> and cannot be accessed outside the function. Returning them transfers their value.",
        followups: ["What is local scope vs global scope?", "What is a lambda function?"]
      },
      file_handling: {
        title: "File Handling",
        keywords: ["file", "files", "open", "read", "write", "close", "file handling", "with open", "txt"],
        explanation: `<h3>File I/O operations</h3>
        <p>Python allows reading and writing external files. The safest method is using the <code>with</code> statement, which guarantees that the file closes automatically when the block finishes.</p>
        <ul>
          <li>Mode <code>"r"</code>: Read mode (default)</li>
          <li>Mode <code>"w"</code>: Write mode (overwrites file!)</li>
          <li>Mode <code>"a"</code>: Append mode (appends to end of file)</li>
        </ul>`,
        example: `# Writing and Reading a file
with open("notes.txt", "w") as file:
    file.write("PyNova AI platform is active.")

with open("notes.txt", "r") as file:
    content = file.read()
    print(content)`,
        beginner: "Think of file handling like opening a physical folder. 'with open' pulls the drawer open and holds the notebook. Once your pen is down, the folder automatically slides shut!",
        hint: "Always open text files using the <code>with</code> context manager so that system resources are freed even if your code crashes middle-operation.",
        followups: ["What does 'with' do behind the scenes?", "What is the difference between write ('w') and append ('a') modes?"]
      },
      exceptions: {
        title: "Exception Handling",
        keywords: ["exception", "exceptions", "try", "except", "finally", "error handling", "try-except", "raise"],
        explanation: `<h3>Exception Handling (try-except)</h3>
        <p>Exceptions are errors detected during execution. We handle them using <code>try</code> and <code>except</code> blocks to prevent the program from crashing.</p>
        <pre><code class="python-code">try:
    num = 10 / 0
except ZeroDivisionError:
    print("Cannot divide by zero!")</code></pre>`,
        example: `try:
    val = int(input("Enter number: "))
except ValueError:
    print("That was not a valid integer!")
finally:
    print("Operation attempt finished.")`,
        beginner: "Exceptions are like safety nets for acrobats. If your code trips (e.g. divides by zero), it falls into the 'except' net instead of hitting the floor (crashing)!",
        hint: "Avoid using generic catch-all <code>except:</code> statements. Specifying the exact error (like ValueError) helps write safer, clearer code.",
        followups: ["What is the finally block used for?", "How do I raise a custom error in Python?"]
      },
      modules: {
        title: "Modules and Packages",
        keywords: ["module", "modules", "import", "package", "packages", "pip", "from"],
        explanation: `<h3>Python Modules & Package Managers</h3>
        <p>A **module** is a file containing Python code (functions, classes). A **package** is a directory of modules. We import libraries using the <code>import</code> keyword.</p>
        <pre><code class="python-code">import math
print(math.sqrt(16)) # Outputs 4.0</code></pre>
        <p>External packages are installed using Python's package installer, **pip**.</p>`,
        example: `from random import randint
num = randint(1, 100) # Import specific function
print(f"Random number: {num}")`,
        beginner: "A module is like a pre-made tool kit. Instead of building a screwdriver from scratch, you import it from the toolbox module to tighten a screw immediately!",
        hint: "You can rename modules during import using <code>as</code> to make code cleaner: <code>import pandas as pd</code>.",
        followups: ["How does pip install packages?", "What is the difference between 'import module' and 'from module import'?"]
      },
      oop: {
        title: "Object-Oriented Programming",
        keywords: ["class", "classes", "object", "objects", "oop", "method", "methods", "constructor", "__init__", "self", "inheritance", "inheritance", "polymorphism", "encapsulation", "super"],
        explanation: `<h3>Object-Oriented Programming (OOP)</h3>
        <p>OOP is a programming paradigm based on <strong>Classes</strong> (blueprints) and <strong>Objects</strong> (instances built from blueprints). It relies on four pillars: Inheritance, Polymorphism, Encapsulation, and Abstraction.</p>
        <ul>
          <li><code>__init__</code>: The constructor method. Initializes object properties when instances are created.</li>
          <li><code>self</code>: Represents the active instance of the class.</li>
        </ul>
        <pre><code class="python-code">class Robot:
    def __init__(self, name):
        self.name = name
    def speak(self):
        return f"Beep! I am {self.name}"

my_bot = Robot("Nova")
print(my_bot.speak())</code></pre>`,
        example: `# Inheritance example
class Animal:
    def speak(self): return "Generic sound"

class Dog(Animal): # Dog inherits from Animal
    def speak(self): return "Woof!"

my_dog = Dog()
print(my_dog.speak()) # Outputs "Woof!"`,
        beginner: "A class is like an architectural blueprint for a house. An object is the actual brick-and-mortar house built from it. You can build 100 distinct houses (objects) from one blueprint (class)!",
        hint: "Instance attributes are created inside <code>__init__</code> with <code>self.attribute_name = value</code> so each object maintains its own individual state.",
        followups: ["What does the self keyword do?", "What is inheritance and how do we use super()?"]
      }
    };
  }

  initErrorDatabase() {
    this.errors = {
      colon: {
        title: "Missing Colon Error (SyntaxError)",
        why: "In Python, header statements (like if, elif, else, for, while, and def) MUST end with a colon (:). This tells Python that a block of indented code is starting.",
        how: "Add a colon ':' at the end of the line preceding the indented block.",
        corrected: "if score >= 50:\n    print('You passed!')"
      },
      indent: {
        title: "Indentation Error (IndentationError)",
        why: "Python uses indentation (spaces) to group blocks of code. Unlike other languages that use curly braces {}, Python requires consistent spacing (usually 4 spaces).",
        how: "Make sure all code lines inside a block (such as an 'if' body or loop body) are indented exactly by the same amount.",
        corrected: "for i in range(3):\n    print(i) # indented by 4 spaces"
      },
      name: {
        title: "Variable Not Found (NameError)",
        why: "You are trying to use a variable or function name that has not been defined or spelled correctly.",
        how: "Verify that the variable was assigned before this line, check for capitalization issues (e.g. Print vs print), and fix spelling.",
        corrected: "message = 'Hello'\nprint(message) # Matches definition spellings!"
      }
    };
  }

  // ----------------------------------------------------
  // PUBLIC API INTERACTION
  // ----------------------------------------------------
  // Returning a promise makes it modular so a real API call (fetch) can replace it seamlessly later!
  async getResponse(userPrompt, userState) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const responseText = this.generateResponseInternal(userPrompt, userState);
        resolve(responseText);
      }, 50); // Small delay to simulate processing
    });
  }

  // Legacy sync wrapper to prevent breaking interface before update
  generateResponse(userPrompt, userState) {
    return this.generateResponseInternal(userPrompt, userState);
  }

  generateResponseInternal(userPrompt, userState) {
    const prompt = userPrompt.toLowerCase().trim();
    const userLevel = userState.profile.level;
    const modifier = userLevel > 3 ? "intermediate" : "beginner";

    // 1. Handle Greetings
    if (this.isGreeting(prompt)) {
      return `<h3>Hello! 🤖</h3>
      <p>I am your **PyNova AI Teacher**. I'm ready to explain Python concepts simply, review your code, and recommend what to learn next.</p>
      <p>Which topic are we exploring today? You can ask me about details like <strong>Loops</strong>, <strong>Lists</strong>, <strong>Dictionaries</strong>, or <strong>OOP</strong>! Let me know.</p>`;
    }

    // 2. Check for action requests in follow-ups
    if (this.lastTopic) {
      const activeTopic = this.topics[this.lastTopic];
      if (prompt.includes("example") || prompt.includes("code")) {
        return `<h4>Code Example for ${activeTopic.title}:</h4>
        <pre><code class="python-code">${activeTopic.example}</code></pre>
        <p>Try running this in the <strong>Live Editor</strong> to see how variables change!</p>`;
      }
      if (prompt.includes("beginner") || prompt.includes("simple") || prompt.includes("analogy") || prompt.includes("explain like i'm a beginner")) {
        return `<h4>Analogy for ${activeTopic.title}:</h4>
        <p>${activeTopic.beginner}</p>
        <p>Does this visual concept clarify it for you?</p>`;
      }
      if (prompt.includes("hint") || prompt.includes("tip")) {
        return `<h4>Teacher Tip for ${activeTopic.title}:</h4>
        <p>💡 ${activeTopic.hint}</p>`;
      }
    }

    // 3. Scan database for topic match
    let bestTopic = null;
    let maxMatches = 0;
    
    for (const [topicKey, topicData] of Object.entries(this.topics)) {
      let matches = 0;
      topicData.keywords.forEach(kw => {
        // Match exact word patterns or expressions
        const regex = new RegExp("\\b" + kw.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') + "\\b", "i");
        if (regex.test(prompt)) {
          matches += 1;
        }
      });

      if (matches > maxMatches) {
        maxMatches = matches;
        bestTopic = topicKey;
      }
    }

    if (bestTopic) {
      this.lastTopic = bestTopic;
      return this.formatTopicResponse(this.topics[bestTopic], modifier);
    }

    // 4. Action requests without active topic
    if (prompt.includes("example") || prompt.includes("sample")) {
      return `Here is a basic Python script showing a greeting and arithmetic:
      <pre><code class="python-code"># Basic template\nname = "Pythonist"\nscore = 10 + 20\nprint(f"Hello {name}, your score is {score}")</code></pre>
      Ask me about any specific keyword in this code (like <strong>f-string</strong>, <strong>variables</strong>, or <strong>operators</strong>) to dive deeper!`;
    }
    if (prompt.includes("hint")) {
      return `💡 **Nova AI Hint:** Break down your learning targets. Follow the active node on the **Roadmap** dashboard. If you're writing code, test variables one by one using <code>print()</code>.`;
    }
    if (prompt.includes("quiz me")) {
      return `Sure! Let's check variables knowledge. What is the output of this Python command?
      <br><pre><code>x = 5\nx = x + 2\nprint(x)</code></pre>
      Type your answer below!`;
    }
    
    // Check if user replied to variables check quiz
    if (prompt === "7") {
      return `🎉 **Correct!** <code>x = x + 2</code> updates <code>x</code> to 7. Excellent logic check! What topic should we study next?`;
    }

    // 5. Friendly Fallback
    return `<h3>Learning Assistant Analysis</h3>
    <p>I processed your query: "<em>${userPrompt}</em>". While my local core compiler is offline, here is how you can proceed:</p>
    <ul>
      <li>To study specific syntax, ask me: <strong>"Explain lists"</strong>, <strong>"How do dictionaries work?"</strong>, or <strong>"What is class inheritance?"</strong></li>
      <li>To get code solutions, paste your code block inside the **AI Debug Lab** for syntax inspections.</li>
      <li>To build apps, go to the **Project Lab** to open task checklists.</li>
    </ul>
    <p>What Python topic can I search or simplify for you next?</p>`;
  }

  formatTopicResponse(topic, modifier) {
    let resp = `<h3>Nova AI Teacher: ${topic.title}</h3>`;
    
    // Inject beginner explanation
    if (modifier === "beginner") {
      resp += `<p style="background: rgba(var(--accent-violet-rgb), 0.08); border-left: 3px solid var(--accent-violet); padding: 10px 14px; margin-bottom: 12px; border-radius: 4px; line-height: 1.5;">💡 <strong>Simple Analogy:</strong> ${topic.beginner}</p>`;
    }
    
    resp += topic.explanation;
    resp += `<br><h4>Code Snippet:</h4><pre><code class="python-code">${topic.example}</code></pre>`;
    
    // Inject follow-up recommendations buttons
    resp += `<br><div style="border-top: 1px dashed var(--border-color); padding-top: 12px; margin-top: 12px;">
      <span style="font-size:12px; color:var(--text-muted); font-weight:700; text-transform:uppercase;">Recommended Follow-ups:</span>
      <div style="display:flex; gap:8px; flex-wrap:wrap; margin-top:8px;">
        ${topic.followups.map(f => `<button class="quick-btn" onclick="window.PyNovaApp.submitTeacherPrompt('${f}')" style="background: var(--bg-active); border: 1px solid var(--border-color); color: var(--accent-cyan); padding: 5px 10px; border-radius:12px; font-size:11px; font-weight:600; cursor:pointer;">${f}</button>`).join("")}
      </div>
    </div>`;

    return resp;
  }

  generateErrorSolution(code, errorMessage) {
    const msg = errorMessage.toLowerCase();
    
    if (msg.includes("colon") || msg.includes("expected ':'") || msg.includes("unexpected token ':'")) {
      return this.errors.colon;
    }
    if (msg.includes("indent") || msg.includes("indentation") || msg.includes("unexpected indent")) {
      return this.errors.indent;
    }
    if (msg.includes("not defined") || msg.includes("nameerror") || msg.includes("is not defined")) {
      return this.errors.name;
    }

    return {
      title: "Syntax or Runtime Error",
      why: `Your code failed with a runtime exception: "${errorMessage}". This happens when Python executes code that violates runtime syntax or looks up invalid identifiers.`,
      how: "Carefully inspect the line number mentioned in the console error, look for missing colons, typos in names, or wrong indentations.",
      corrected: "# Double check brackets & structures:\nprint('Check your quotes and brackets')"
    };
  }

  getLessonHint(lessonId) {
    if (lessonId === "intro_to_python") {
      return "To print a greeting, call the print() function with the greeting text inside quotes. E.g. print(\"Hello\")";
    }
    if (lessonId === "print_function") {
      return "Use comma-separated strings inside print(), and pass sep=', ' as the last argument to configure the outputs.";
    }
    if (lessonId === "variables") {
      return "Set score equal to 100 on the first line (score = 100). On the second line, write print(score). Do not use quotes around score in print!";
    }
    return "Check your lesson explanation on the left panel! Follow the variables naming rules and check for indentation.";
  }

  getProjectMentorResponse(projectId, taskText, userCode) {
    return `
      <h4>Nova AI Project Mentor</h4>
      <p>I reviewed your progress on task: <strong>"${taskText}"</strong>.</p>
      <p>Your workspace contains some code structure. To complete this task successfully:</p>
      <ul>
        <li>Double check that variables match names in instructions.</li>
        <li>Make sure calculations are handled correctly (e.g. dividing by zero should print 'Error!').</li>
        <li>Keep it simple. You don't need a complex backend, focus on core arithmetic first!</li>
      </ul>
      <p>Let me know if you want me to write a structure template or debug a syntax error.</p>
    `;
  }

  isGreeting(text) {
    const greetings = ["hello", "hi", "hey", "greetings", "good morning", "good afternoon", "welcome", "yo"];
    return greetings.includes(text);
  }
}

window.PyNovaAi = new AiTeacher();
