// PyNova AI - Learning Database (Lessons, Quizzes, Challenges, Projects, Badges)

const ROADMAP = [
  {
    level: 1,
    name: "Python Foundations",
    description: "Get started with the basics of Python syntax, variables, types, and inputs.",
    color: "var(--accent-cyan)",
    lessons: [
      {
        id: "intro_to_python",
        title: "Introduction to Python",
        xpReward: 50,
        summary: "Discover what Python is and why it's the world's most popular programming language.",
        explanation: "<h3>Welcome to Python!</h3><p>Python is a high-level, interpreted programming language known for its readability, simplicity, and versatility. Created by Guido van Rossum and released in 1991, Python is used for everything from web development and automation to data science, artificial intelligence, and scientific research.</p><h4>Key Features of Python:</h4><ul><li><strong>Readable Syntax:</strong> Feels like writing structured English.</li><li><strong>Interpreted:</strong> Code is executed line-by-line, making testing and debugging fast.</li><li><strong>Multi-paradigm:</strong> Supports procedural, functional, and object-oriented programming.</li></ul>",
        visualConcept: `<div class="visual-concept-card"><div class="visual-flow"><div class="flow-box py-code">code.py</div><div class="flow-arrow">➔</div><div class="flow-box py-engine">Python Interpreter</div><div class="flow-arrow">➔</div><div class="flow-box py-output">Screen Output</div></div></div>`,
        codeExample: `# This is your first Python program!
print("Hello, PyNova Universe!")
# Run it to see the greeting!`,
        realWorldExample: "Google uses Python for web search systems, YouTube was largely built with it, and NASA uses it for scientific calculations. It powers the backends of modern platforms you use daily.",
        commonMistakes: [
          { mistake: "Confusing Python with Java/JavaScript", explanation: "Python is a distinct language with its own runtime and indentation-based structure. It doesn't use semicolons or curly braces for code blocks." },
          { mistake: "Typo in print statements", explanation: "Remember that Python is case-sensitive. 'Print()' will result in a NameError. It must be lowercase 'print()'." }
        ],
        quiz: {
          question: "Which of the following is NOT a feature of Python?",
          options: ["Requires semicolons at the end of every line", "Highly readable syntax", "Interpreted execution", "Supports Object-Oriented programming"],
          answer: 0,
          explanation: "Python does NOT require semicolons. It uses newlines to end statements, keeping code clean and readable."
        },
        practice: {
          problem: "Write a program that uses print() to output 'PyNova is awesome!' to the console.",
          starterCode: "# Write your code here\n",
          expectedPattern: /print\s*\(\s*['"]PyNova is awesome!['"]\s*\)/
        }
      },
      {
        id: "installing_python",
        title: "Installing Python & Setup",
        xpReward: 50,
        summary: "Learn how Python runs on your machine and setting up environments.",
        explanation: "<h3>Setting up Python</h3><p>To run Python locally on your computer, you need the Python interpreter installed. You can download the latest version from python.org. Programmers typically write Python in Editors or Integrated Development Environments (IDEs) like VS Code, PyCharm, or right here inside PyNova AI!</p><h4>The Interactive REPL:</h4><p>Python offers a Read-Eval-Print Loop. Typing `python` in a terminal opens a shell where commands execute immediately.</p>",
        visualConcept: `<div class="visual-concept-card"><div class="terminal-mock"><span>$ python --version</span><br><span style="color: var(--accent-cyan)">Python 3.12.4</span></div></div>`,
        codeExample: `# Python has a built-in help function
# run this to see details about print
help(print)`,
        realWorldExample: "DevOps engineers install Python on web servers to automatically run utility scripts that backup systems or monitor network traffic.",
        commonMistakes: [
          { mistake: "Not adding Python to PATH during installation", explanation: "On Windows, make sure to check 'Add python.exe to PATH' so you can run the 'python' command from your command prompt." }
        ],
        quiz: {
          question: "Where is the official website to download Python?",
          options: ["python.com", "python.org", "python.net", "github.com/python"],
          answer: 1,
          explanation: "The official non-profit repository for Python downloads and documentation is python.org."
        },
        practice: {
          problem: "Print the phrase 'System Ready' to test your basic environmental setup.",
          starterCode: "# Print 'System Ready'\n",
          expectedPattern: /print\s*\(\s*['"]System Ready['"]\s*\)/
        }
      },
      {
        id: "print_function",
        title: "The print() Function",
        xpReward: 50,
        summary: "Display data, text, and variables on the screen.",
        explanation: "<h3>The print() Function</h3><p>The `print()` function is the primary way Python outputs data. You can pass it strings (text enclosed in quotes), numbers, expressions, or variable names. By default, `print()` outputs a newline at the end, but you can customize this behavior using parameters like `end` and `sep`.</p><h4>Examples:</h4><ul><li>`print(\"Hello\")` -> Outputs Hello</li><li>`print(\"A\", \"B\", sep=\"-\")` -> Outputs A-B</li><li>`print(\"Hi\", end=\"!\")` -> Outputs Hi! without starting a new line.</li></ul>",
        visualConcept: `<div class="visual-concept-card"><div class="console-box"><div class="console-line">&gt; print("Hello", "World", sep=" 🚀 ")</div><div class="console-output">Hello 🚀 World</div></div></div>`,
        codeExample: `print("Hello", "Universe")
print("Loading", end="...")
print("Complete")
print("Python", "AI", "Learning", sep=" | ")`,
        realWorldExample: "Logging messages in microservices. Applications print messages to a console log so developers can monitor operations and trace errors.",
        commonMistakes: [
          { mistake: "Mixing quote styles", explanation: "Ensure string quotes match. print('Hello\") is invalid. Use either print('Hello') or print(\"Hello\")." }
        ],
        quiz: {
          question: "What will print('A', 'B', sep='*') output?",
          options: ["A B sep='*'", "A*B", "AB*", "*AB"],
          answer: 1,
          explanation: "The sep parameter specifies the separator between items. 'A' and 'B' are combined with '*' in between, producing 'A*B'."
        },
        practice: {
          problem: "Write a program that prints 'Apple', 'Banana', and 'Cherry' separated by commas (', ').",
          starterCode: "# Output: Apple, Banana, Cherry\n# Hint: Use the sep parameter!\n",
          expectedPattern: /print\s*\(\s*['"]Apple['"]\s*,\s*['"]Banana['"]\s*,\s*['"]Cherry['"]\s*,\s*sep\s*=\s*['"],\s*['"]\s*\)/
        }
      },
      {
        id: "comments",
        title: "Writing Comments",
        xpReward: 50,
        summary: "Document code and exclude lines from running.",
        explanation: "<h3>Why Write Comments?</h3><p>Comments are annotations in code that are ignored by the Python interpreter. They are crucial for explaining *why* code was written a certain way, leaving TODO notes, or debugging by temporarily disabling lines of code.</p><h4>Types of Comments:</h4><ul><li><strong>Single-line comments:</strong> Start with a hash symbol `#`.</li><li><strong>Multi-line/Docstrings:</strong> Enclosed inside triple quotes `'''` or `\"\"\"`. Usually used for function and class documentation.</li></ul>",
        visualConcept: `<div class="visual-concept-card"><div class="code-flow-annotated"><div class="code-line"><span class="code-comment"># Compute score:</span></div><div class="code-line">score = 10 + 20 <span class="code-comment"># adding points</span></div></div></div>`,
        codeExample: `# This is a comment. The interpreter skips it!
print("This line runs!") # This is an inline comment
'''
This is a multi-line comment or docstring.
It is extremely useful for explaining long,
complex processes in your code.
'''
print("So does this!")`,
        realWorldExample: "When working in programming teams, comments act as direct messages to your future self and teammates, ensuring code maintains readability and is easy to update.",
        commonMistakes: [
          { mistake: "Over-commenting the obvious", explanation: "Avoid write-ups for obvious code: e.g., 'x = 10 # Assign 10 to x'. Comment on the 'why' rather than the 'what'." }
        ],
        quiz: {
          question: "Which symbol is used for single-line comments in Python?",
          options: ["//", "/*", "#", "<!--"],
          answer: 2,
          explanation: "# is used for single-line comments. // is used in languages like JS or C++."
        },
        practice: {
          problem: "Create a single-line comment stating 'AI is loading', and on the next line print 'Active'.",
          starterCode: "",
          expectedPattern: /#\s*AI is loading\s*\n\s*print\s*\(\s*['"]Active['"]\s*\)/
        }
      },
      {
        id: "variables",
        title: "Variables and Memory",
        xpReward: 60,
        summary: "Store data and references dynamically in memory.",
        explanation: "<h3>Understanding Variables</h3><p>A variable is a named storage location that holds a value. In Python, variables are created dynamically when you assign a value to them using the single equals sign `=` (the assignment operator). Python is dynamically typed, meaning you don't need to specify the data type of the variable beforehand.</p><h4>Naming Rules:</h4><ul><li>Must start with a letter or underscore `_`.</li><li>Can contain alphanumeric characters and underscores.</li><li>Case-sensitive (`age`, `Age`, and `AGE` are different).</li><li>Cannot be Python keywords (like `if`, `class`, `import`).</li></ul>",
        visualConcept: `<div class="visual-concept-card"><div class="box-grid"><div class="variable-box"><div class="box-name">username</div><div class="box-value">"Nova"</div></div><div class="variable-box"><div class="box-name">level</div><div class="box-value">42</div></div></div></div>`,
        codeExample: `username = "Nova"
xp = 150
print("Username:", username)
print("Current XP:", xp)

# Reassigning variables
xp = xp + 50
print("Updated XP:", xp)`,
        realWorldExample: "A game engine stores variables for player_health, inventory_items, and level_score. These update in real-time as the player moves and fights.",
        commonMistakes: [
          { mistake: "Using = instead of == for comparison", explanation: "Use '=' to assign values. Use '==' to check if two values are equal. Writing 'if score = 10:' is a syntax error." },
          { mistake: "Variable assignment direction", explanation: "Variables must always be on the left of '='. Write 'x = 5', never '5 = x'." }
        ],
        quiz: {
          question: "Which of the following is a valid variable name in Python?",
          options: ["2player", "player-score", "player_score", "player score"],
          answer: 2,
          explanation: "player_score is valid. Variables cannot start with digits, cannot contain spaces, and cannot contain hyphens."
        },
        practice: {
          problem: "Create a variable named 'score' and set it to 100, then print it.",
          starterCode: "# Create variable and print it\n",
          expectedPattern: /score\s*=\s*100\s*\n\s*print\s*\(\s*score\s*\)/
        }
      },
      {
        id: "data_types",
        title: "Data Types",
        xpReward: 60,
        summary: "Explore strings, integers, floats, and booleans.",
        explanation: "<h3>Python Data Types</h3><p>Every value in Python has a data type. Python detects this automatically. The key primitive data types are:</p><ul><li><strong>int:</strong> Integers (whole numbers), e.g., `42`, `-5`.</li><li><strong>float:</strong> Floating-point numbers (decimals), e.g., `3.14`, `-0.01`.</li><li><strong>str:</strong> String (text in quotes), e.g., `\"Python\"`.</li><li><strong>bool:</strong> Boolean (truth values), either `True` or `False`.</li></ul><p>Use `type(variable)` to check what data type Python has inferred.</p>",
        visualConcept: `<div class="visual-concept-card"><div class="type-table"><div><span>"Hello"</span> -> <strong style="color: var(--accent-violet)">str</strong></div><div><span>42</span> -> <strong style="color: var(--accent-violet)">int</strong></div><div><span>3.14</span> -> <strong style="color: var(--accent-violet)">float</strong></div><div><span>True</span> -> <strong style="color: var(--accent-violet)">bool</strong></div></div></div>`,
        codeExample: `name = "Nova AI"
version = 2.0
is_active = True
lessons_count = 35

print(type(name))
print(type(version))
print(type(is_active))
print(type(lessons_count))`,
        realWorldExample: "Financial apps use floats to represent monetary transactions (e.g. $19.99), ints for transactions volume, and booleans for verification indicators.",
        commonMistakes: [
          { mistake: "Capitalization of Booleans", explanation: "In Python, booleans must be capitalized: 'True' and 'False'. Writing 'true' or 'false' (lowercase) will cause a NameError." }
        ],
        quiz: {
          question: "What is the return type of the statement type(9.99) in Python?",
          options: ["int", "double", "float", "decimal"],
          answer: 2,
          explanation: "Decimals in Python are classified as 'float'. Python does not have a separate 'double' primitive type."
        },
        practice: {
          problem: "Create a float variable named 'pi' set to 3.14159, and check its type using print(type(pi)).",
          starterCode: "# Define pi and print its type\n",
          expectedPattern: /pi\s*=\s*3\.14159\s*\n\s*print\s*\(\s*type\s*\(\s*pi\s*\)\s*\)/
        }
      },
      {
        id: "input_output",
        title: "Input and Output",
        xpReward: 60,
        summary: "Interact with users by collecting and formatting input.",
        explanation: "<h3>Interactive Input</h3><p>To receive input from the user via the keyboard, Python provides the `input()` function. It pauses execution and waits for user keystrokes. **CRITICAL:** `input()` always returns user input as a string (`str`). If you need numeric values, you must convert them (typecast) using functions like `int()` or `float()`.</p><h4>Formatting:</h4><p>We format output using f-strings (formatted string literals): `f\"Hello, {name}\"`. Code inside `{}` is executed and converted to string automatically.</p>",
        visualConcept: `<div class="visual-concept-card"><div class="input-cast"><div class="terminal-mock">Input: "15" (str) ➔ int() ➔ 15 (int)</div></div></div>`,
        codeExample: `# Simple greeting program
name = "Student" # simulated input
print(f"Welcome, {name}!")

# Converting numeric input
age_str = "18" # simulated input
age = int(age_str)
next_year = age + 1
print(f"Next year you will be {next_year} years old.")`,
        realWorldExample: "A terminal command-line tool asking you: 'Are you sure you want to delete this file? (yes/no)'. It parses the output using input().",
        commonMistakes: [
          { mistake: "Adding numbers directly from input", explanation: "If you do x = input() (user enters 5) and y = input() (user enters 6), x + y yields '56' (string concatenation). Cast them: int(x) + int(y) is 11." }
        ],
        quiz: {
          question: "What data type does the input() function always return by default?",
          options: ["int", "str", "float", "dynamic"],
          answer: 1,
          explanation: "input() always returns a string (str). You must cast it if you need numbers."
        },
        practice: {
          problem: "Write a program that uses an f-string to print 'Score: 95/100' where the numbers come from variables score=95 and total=100.",
          starterCode: "score = 95\ntotal = 100\n# Use f-string to print 'Score: 95/100'\n",
          expectedPattern: /print\s*\(\s*f['"]Score:\s*\{\s*score\s*\}\/\{\s*total\s*\}['"]\s*\)/
        }
      },
      {
        id: "operators",
        title: "Python Operators",
        xpReward: 60,
        summary: "Perform calculations and basic arithmetic.",
        explanation: "<h3>Operators</h3><p>Operators are special symbols used to perform calculations. Python includes:</p><ul><li>`+` Addition, `-` Subtraction, `*` Multiplication</li><li>`/` Division (always returns float)</li><li>`//` Floor Division (rounds down division result to nearest integer)</li><li>`%` Modulo (returns division remainder)</li><li>`**` Exponentiation (power)</li></ul>",
        visualConcept: `<div class="visual-concept-card"><div class="mod-viz">11 % 3 = <strong>2</strong> (remainder of 11 / 3)</div></div>`,
        codeExample: `a = 15
b = 4

print("Addition:", a + b)
print("Float Division:", a / b)
print("Floor Division:", a // b)
print("Remainder (Modulo):", a % b)
print("Exponent (Power):", b ** 2)`,
        realWorldExample: "Calculating coordinates, measuring game ticks, or determining if a number is even or odd (e.g. `num % 2 == 0`).",
        commonMistakes: [
          { mistake: "Division producing float", explanation: "Even if you do '10 / 2', Python outputs '5.0' (float) instead of '5' (int). Use floor division '//' if you strictly require an integer output." }
        ],
        quiz: {
          question: "What operator is used for exponentiation (raising to a power) in Python?",
          options: ["^", "**", "pow", "*^"],
          answer: 1,
          explanation: "** is the exponentiation operator. ^ is the bitwise XOR operator in Python."
        },
        practice: {
          problem: "Write a program that calculates the remainder of 25 divided by 4 using the modulo operator and prints it.",
          starterCode: "# Output remainder of 25 / 4\n",
          expectedPattern: /print\s*\(\s*25\s*%\s*4\s*\)/
        }
      }
    ]
  },
  {
    level: 2,
    name: "Control Logic",
    description: "Learn to steer your program's flow with conditions and comparisons.",
    color: "var(--accent-violet)",
    lessons: [
      {
        id: "if_statements",
        title: "If Statements & Comparison",
        xpReward: 70,
        summary: "Make decisions in code based on comparisons.",
        explanation: "<h3>Making Decisions</h3><p>We use conditional statements to run blocks of code only if specific statements are true. Python uses `if` combined with indents to define conditional code paths.</p><h4>Comparison Operators:</h4><ul><li>`==` Equals, `!=` Not Equals</li><li>`>` Greater than, `<` Less than</li><li>`>=` Greater or equal, `<=` Less or equal</li></ul>",
        visualConcept: `<div class="visual-concept-card"><div class="decision-tree"><span>Is score &gt;= 50?</span><div class="branches"><div class="branch-yes">Yes ➔ Print Pass</div><div class="branch-no">No ➔ Skip</div></div></div></div>`,
        codeExample: `score = 85
if score >= 50:
    print("Test passed!")
    print("Congratulations!")
print("This line always prints.")`,
        realWorldExample: "Authenticating users: checking if variable `password_entered == stored_password` before granting profile access.",
        commonMistakes: [
          { mistake: "Missing colon", explanation: "Always add a colon ':' at the end of the 'if' condition statement." },
          { mistake: "IndentationError", explanation: "All lines of code inside the 'if' block must be indented by the same spacing (usually 4 spaces)." }
        ],
        quiz: {
          question: "Which of the following is correct syntax for an if statement?",
          options: ["if x > 5 print(x)", "if x > 5: print(x)", "if (x > 5) { print(x) }", "if x > 5; print(x)"],
          answer: 1,
          explanation: "Python conditional syntax requires a colon ':' at the end of the condition and indentation for the block."
        },
        practice: {
          problem: "Create an if statement that checks if x is greater than 10. If true, print 'Greater'.",
          starterCode: "x = 12\n# Write if statement here\n",
          expectedPattern: /if\s+x\s*>\s*10\s*:\s*\n\s+print\s*\(\s*['"]Greater['"]\s*\)/
        }
      },
      {
        id: "elif_else",
        title: "elif and else",
        xpReward: 70,
        summary: "Handle multiple alternative conditions.",
        explanation: "<h3>Alternative Branches</h3><p>When you have multiple mutually exclusive pathways, you chain conditions using `elif` (short for else-if) and `else` (default fallback block).</p><h4>Execution Flow:</h4><p>Python runs conditions top to bottom. As soon as ONE condition evaluates to `True`, Python runs its block and skips the rest of the chain.</p>",
        visualConcept: `<div class="visual-concept-card"><div class="chain-flow"><div class="chain-node">if (score &gt; 90)</div><div class="chain-arrow">➔ No</div><div class="chain-node">elif (score &gt; 50)</div><div class="chain-arrow">➔ No</div><div class="chain-node">else (Fail)</div></div></div>`,
        codeExample: `score = 75
if score >= 90:
    print("Grade: A")
elif score >= 70:
    print("Grade: B")
elif score >= 50:
    print("Grade: C")
else:
    print("Grade: F")`,
        realWorldExample: "A shopping cart application calculating discounts: if purchase > $100 (20% off), elif purchase > $50 (10% off), else (no discount).",
        commonMistakes: [
          { mistake: "Using 'else if'", explanation: "Python doesn't have an 'else if' keyword. You must write 'elif'." },
          { mistake: "Condition in else block", explanation: "An 'else' block takes no condition. Write 'else:', not 'else condition:'." }
        ],
        quiz: {
          question: "Can an 'else' block be executed without an 'if' statement?",
          options: ["Yes, if it's chained to another else", "No, else must follow an if/elif structure", "Yes, in loop statements", "Only inside functions"],
          answer: 1,
          explanation: "In standard control logic, else must be paired with an initial if statement to establish the condition chain."
        },
        practice: {
          problem: "Write an if-else chain. If level is 10, print 'Master'. Else, print 'Learner'.",
          starterCode: "level = 5\n# Write logic below\n",
          expectedPattern: /if\s+level\s*==\s*10\s*:\s*\n\s+print\s*\(\s*['"]Master['"]\s*\)\s*\n\s*else\s*:\s*\n\s+print\s*\(\s*['"]Learner['"]\s*\)/
        }
      }
    ]
  },
  {
    level: 3,
    name: "Loops & Iterations",
    description: "Master repeating processes in Python code.",
    color: "var(--accent-purple)",
    lessons: [
      {
        id: "for_loops",
        title: "For Loops & ranges",
        xpReward: 80,
        summary: "Iterate through lists, sequences, and ranges.",
        explanation: "<h3>For Loops</h3><p>A `for` loop is used to iterate over a sequence (like a list, tuple, dictionary, or string) or a range of numbers. It executes a block of code a set number of times.</p><h4>Using range():</h4><p>`range(start, stop, step)` generates a sequence of numbers from `start` up to (but not including) `stop` incremented by `step`.</p>",
        visualConcept: `<div class="visual-concept-card"><div class="loop-viz"><span>range(0, 3)</span>➔ <strong>0</strong> ➔ <strong>1</strong> ➔ <strong>2</strong></div></div>`,
        codeExample: `print("Looping through a range:")
for i in range(1, 4):
    print(f"Iteration {i}")

print("Looping through a text:")
for char in "Python":
    print(char)`,
        realWorldExample: "Sending promotional emails to a list of subscribers. The program loops through each email address and transmits the content.",
        commonMistakes: [
          { mistake: "Off-by-one errors with range()", explanation: "Remember range(1, 5) runs for values 1, 2, 3, and 4. It excludes the upper bound (5)." }
        ],
        quiz: {
          question: "How many times will a loop with range(0, 5) run?",
          options: ["4 times", "5 times", "6 times", "Infinite times"],
          answer: 1,
          explanation: "range(0, 5) generates values 0, 1, 2, 3, and 4, executing exactly 5 times."
        },
        practice: {
          problem: "Write a for loop that prints the numbers 0, 1, 2 using range(3).",
          starterCode: "# Write loop using range(3)\n",
          expectedPattern: /for\s+\w+\s+in\s+range\s*\(\s*3\s*\)\s*:\s*\n\s+print\s*\(\s*\w+\s*\)/
        }
      }
    ]
  }
];

const CHALLENGES = [
  {
    id: "challenge_fizzbuzz",
    title: "The Classic FizzBuzz",
    category: "Beginner",
    difficulty: "🟢 Easy",
    xpReward: 100,
    summary: "Solve the classic coding interview challenge using conditions and modulo.",
    description: `<h3>FizzBuzz Challenge</h3>
    <p>Write a program that checks an integer variable <code>num</code>:</p>
    <ul>
      <li>If <code>num</code> is divisible by 3, print <strong>"Fizz"</strong>.</li>
      <li>If <code>num</code> is divisible by 5, print <strong>"Buzz"</strong>.</li>
      <li>If <code>num</code> is divisible by both 3 and 5, print <strong>"FizzBuzz"</strong>.</li>
      <li>Otherwise, print the number itself.</li>
    </ul>`,
    starterCode: `num = 15
# Write your FizzBuzz code below:
`,
    expectedPattern: /if\s+num\s*%\s*3\s*==\s*0\s+and\s+num\s*%\s*5\s*==\s*0\s*:\s*\n\s+print\s*\(\s*['"]FizzBuzz['"]\s*\)/i,
    mockOutput: "FizzBuzz\n"
  },
  {
    id: "challenge_even_odd",
    title: "Even or Odd Tracker",
    category: "Beginner",
    difficulty: "🟢 Easy",
    xpReward: 80,
    summary: "Determine if a user's input value is even or odd.",
    description: `<h3>Even or Odd</h3>
    <p>Check variable <code>val</code>. If it's even, print <strong>"Even"</strong>. If it is odd, print <strong>"Odd"</strong>.</p>`,
    starterCode: `val = 7
# Check even or odd
`,
    expectedPattern: /if\s+val\s*%\s*2\s*==\s*0\s*:\s*\n\s+print\s*\(\s*['"]Even['"]\s*\)\s*\n\s*else\s*:\s*\n\s+print\s*\(\s*['"]Odd['"]\s*\)/i,
    mockOutput: "Odd\n"
  },
  {
    id: "challenge_sum_list",
    title: "Sum of a List",
    category: "Intermediate",
    difficulty: "🟡 Medium",
    xpReward: 150,
    summary: "Iterate through elements and calculate running totals.",
    description: `<h3>Sum a List</h3>
    <p>Loop through the list <code>numbers = [5, 10, 15, 20]</code>, calculate their sum, and print the final total.</p>`,
    starterCode: `numbers = [5, 10, 15, 20]
total = 0
# Loop and add to total:
`,
    expectedPattern: /for\s+\w+\s+in\s+numbers\s*:\s*\n\s+total\s*(?:\+=\s*\w+|=\s*total\s*\+\s*\w+)/,
    mockOutput: "50\n"
  }
];

const QUIZZES = [
  {
    id: "quiz_basics",
    title: "Python Basics Check",
    category: "Beginner",
    difficulty: "🟢 Easy",
    xpReward: 80,
    questions: [
      {
        question: "Which of the following is correct string syntax in Python?",
        options: ["'Hello'", "\"Hello\"", "'''Hello'''", "All of the above"],
        answer: 3,
        explanation: "Python accepts single quotes, double quotes, and triple quotes for strings."
      },
      {
        question: "How do you cast an input string '5' into an integer?",
        options: ["float('5')", "int('5')", "str(5)", "convert('5', int)"],
        answer: 1,
        explanation: "The int() function takes a numeric string or float and casts it to an integer."
      },
      {
        question: "What is the output of print(10 // 3) in Python?",
        options: ["3.333", "3", "1", "4"],
        answer: 1,
        explanation: "// is the floor division operator. It divides and rounds down to the nearest integer, which is 3."
      }
    ]
  },
  {
    id: "quiz_conditionals",
    title: "Control Flow Checkup",
    category: "Beginner",
    difficulty: "🟢 Easy",
    xpReward: 100,
    questions: [
      {
        question: "What keyword is the shortcut for 'else if' in Python?",
        options: ["elseif", "elsif", "elif", "else if"],
        answer: 2,
        explanation: "Python uses 'elif' to chain sequential conditions."
      },
      {
        question: "What does code output when if conditions are not met and no else is specified?",
        options: ["Throws an error", "Skips block and continues execution", "Crashes the application", "Prints None"],
        answer: 1,
        explanation: "If no conditions are met, Python skips the block entirely and executes subsequent code lines."
      }
    ]
  }
];

const PROJECTS = [
  {
    id: "project_calculator",
    title: "Smart Command Calculator",
    category: "Beginner",
    xpReward: 250,
    skills: ["Variables", "Operators", "If-Else conditions", "Input validation"],
    description: "Build a CLI calculator that takes numeric inputs and an operator, computes the result, and outputs it safely.",
    tasks: [
      { id: "calc_t1", text: "Create variable 'num1' and 'num2' with float numbers.", completed: false },
      { id: "calc_t2", text: "Define an 'operator' variable containing standard signs ('+', '-', '*', '/').", completed: false },
      { id: "calc_t3", text: "Create an if-elif-else logic chain to evaluate the selection and print results.", completed: false },
      { id: "calc_t4", text: "Handle zero-division exceptions (e.g. dividing by zero prints 'Error!').", completed: false }
    ],
    starterCode: `num1 = 12.5
num2 = 4.0
operator = "/"

# Write your calculator engine logic here
`,
    expectedPattern: /if\s+operator\s*==\s*['"]\/['"]\s*:\s*\n\s+if\s+num2\s*==\s*0/
  },
  {
    id: "project_pass_gen",
    title: "Dynamic Password Generator",
    category: "Intermediate",
    xpReward: 400,
    skills: ["Loops", "Random module", "Strings", "Functions"],
    description: "Generate a randomized, secure password based on length configurations and custom character sets.",
    tasks: [
      { id: "pass_t1", text: "Import the standard 'random' library.", completed: false },
      { id: "pass_t2", text: "Define character banks (letters, digits, symbols).", completed: false },
      { id: "pass_t3", text: "Implement a function 'generate_password(length)' returning a randomized string.", completed: false },
      { id: "pass_t4", text: "Use a loop to select random indices from the characters bank.", completed: false }
    ],
    starterCode: `import random

def generate_password(length):
    # Add logic here
    return ""

print(generate_password(8))
`,
    expectedPattern: /import\s+random/
  }
];

const BADGES = [
  { id: "badge_beg", title: "Python Beginner", icon: "🐍", desc: "Completed Level 1 Foundations" },
  { id: "badge_code", title: "First Program", icon: "💻", desc: "Executed code successfully in Live Editor" },
  { id: "badge_streak", title: "Streak Champion", icon: "🔥", desc: "Maintained a 7-day learning streak" },
  { id: "badge_quiz", title: "Quiz Master", icon: "🧠", desc: "Scored 100% on any Quiz check" },
  { id: "badge_bug", title: "Bug Hunter", icon: "🐛", desc: "Resolved an error inside the Debug Lab" },
  { id: "badge_project", title: "Project Builder", icon: "🚀", desc: "Finished first Project Lab challenge" },
  { id: "badge_master", title: "Python Expert", icon: "🏆", desc: "Earned 2000 total Experience Points (XP)" }
];

const SKILL_ASSESSMENT = [
  {
    question: "How comfortable are you with programming concepts in general?",
    options: [
      "I am a complete beginner - never written code before",
      "I know simple concepts (variables, print statements)",
      "I have experience in other languages (JavaScript, C++, Java, etc.)",
      "I am already intermediate and looking to master advanced Python"
    ]
  },
  {
    question: "What is your main goal for learning Python?",
    options: [
      "Web development or scripting automation",
      "Data analysis, Artificial Intelligence, and ML",
      "Passing university exams or coding interviews",
      "Building general coding projects for fun"
    ]
  },
  {
    question: "Predict the output of: print(3 + 2 * 5)",
    options: ["25", "13", "10", "Error"],
    answer: 1
  }
];

// Export to window for SPA dynamic accessibility without complex modules
window.PyNovaDb = {
  ROADMAP,
  CHALLENGES,
  QUIZZES,
  PROJECTS,
  BADGES,
  SKILL_ASSESSMENT
};
