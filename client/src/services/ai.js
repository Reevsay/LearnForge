import axios from 'axios';

export const generateLearningPathContent = async (topic) => {
  try {
    const response = await axios.post('http://localhost:5000/api/ai/generate', { topic });
    console.log('Backend AI response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error generating learning path:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    throw error;
  }
};

export const generateAIContent = async (type, topic, customPrompt = null) => {
  try {
    let prompt;
    if (customPrompt) {
      prompt = customPrompt;
    } else if (type === 'quiz') {
      prompt = `Create exactly 10 multiple choice questions specifically about ${topic}. 
      Each question should have exactly 4 options (A, B, C, D), clearly indicate the correct answer, and provide a detailed explanation for why that answer is correct.
      Format each question as:
      Question 1: [question text]
      A) [option 1]
      B) [option 2] 
      C) [option 3]
      D) [option 4]
      Correct Answer: [A/B/C/D]
      Explanation: [Detailed explanation of why this answer is correct and why other options are wrong]
      
      Make sure all questions are directly related to ${topic} and cover different aspects of the topic. Provide educational explanations that help users learn.`;
    } else {
      prompt = `Generate content about ${topic}`;
    }

    const response = await axios.post('http://localhost:5000/api/ai/generate', { 
      topic,
      prompt,
      type 
    });
    
    console.log('AI Content response:', response.data);
    
    // For quiz type, return structured quiz data
    if (type === 'quiz') {
      return {
        questions: parseQuizFromText(response.data.content || response.data.text || '', topic)
      };
    }
    
    return response.data;
  } catch (error) {
    console.error('Error generating AI content:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    throw error;
  }
};

// Helper function to parse quiz questions from AI response
const parseQuizFromText = (text, topic) => {
  try {
    // Try to parse as JSON first
    if (text.includes('{') || text.includes('[')) {
      const jsonMatch = text.match(/\[.*\]|\{.*\}/s);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        if (Array.isArray(parsed)) return parsed;
        if (parsed.questions) return parsed.questions;
      }
    }

    // Fallback: Parse text format
    const questions = [];
    const lines = text.split('\n').filter(line => line.trim());
    
    let currentQuestion = null;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Question pattern (starts with Question or number)
      if (/^(Question\s*\d+[:.]*|^\d+[.)]*)/i.test(line)) {
        // Save previous question if exists
        if (currentQuestion && currentQuestion.options.length === 4) {
          questions.push(currentQuestion);
        }
        
        // Start new question
        currentQuestion = {
          question: line.replace(/^(Question\s*\d+[:.]*|\d+[.)]*)/i, '').trim(),
          options: [],
          correct_answer: '',
          explanation: ''
        };
      }
      // Option pattern (A), B), C), D))
      else if (/^[A-D][.)]/i.test(line) && currentQuestion) {
        const option = line.replace(/^[A-D][.)]/i, '').trim();
        currentQuestion.options.push(option);
      }
      // Correct answer pattern
      else if (/correct\s*answer[:\s]*[A-D]/i.test(line) && currentQuestion) {
        const answerMatch = line.match(/[A-D]/i);
        if (answerMatch && currentQuestion.options.length > 0) {
          const answerIndex = answerMatch[0].toUpperCase().charCodeAt(0) - 65;
          if (answerIndex >= 0 && answerIndex < currentQuestion.options.length) {
            currentQuestion.correct_answer = currentQuestion.options[answerIndex];
          }
        }
      }
      // Explanation pattern
      else if (/explanation[:\s]/i.test(line) && currentQuestion) {
        currentQuestion.explanation = line.replace(/explanation[:\s]*/i, '').trim();
      }
    }
    
    // Add the last question
    if (currentQuestion && currentQuestion.options.length === 4) {
      if (!currentQuestion.correct_answer) {
        currentQuestion.correct_answer = currentQuestion.options[0];
      }
      questions.push(currentQuestion);
    }
    
    // Generate sample questions if parsing failed or not enough questions
    if (questions.length < 5) {
      console.log('Generating sample questions for topic:', topic);
      return generateSampleQuestions(topic);
    }
    
    return questions.slice(0, 10); // Return maximum 10 questions
  } catch (error) {
    console.error('Error parsing quiz:', error);
    return generateSampleQuestions(topic);
  }
};

// Generate sample questions as fallback
const generateSampleQuestions = (topic) => {
  const topicLower = topic.toLowerCase();
  
  if (topicLower.includes('python')) {
    return [
      {
        question: `What is Python?`,
        options: [
          'A programming language',
          'A type of snake',
          'A web browser',
          'An operating system'
        ],
        correct_answer: 'A programming language',
        explanation: 'Python is a high-level, interpreted programming language known for its simple syntax and versatility. It was created by Guido van Rossum and first released in 1991.'
      },
      {
        question: `Which of the following is the correct syntax to print in Python?`,
        options: [
          'print("Hello World")',
          'console.log("Hello World")',
          'System.out.println("Hello World")',
          'echo "Hello World"'
        ],
        correct_answer: 'print("Hello World")',
        explanation: 'In Python, print() is the built-in function used to display output. console.log() is JavaScript, System.out.println() is Java, and echo is used in shell scripting and PHP.'
      },
      {
        question: `What is the file extension for Python files?`,
        options: [
          '.py',
          '.python',
          '.pt',
          '.pyt'
        ],
        correct_answer: '.py',
        explanation: 'Python source files use the .py extension. This is the standard and recognized extension for Python scripts and modules.'
      },
      {
        question: `Which of these is a Python data type?`,
        options: [
          'List',
          'Array',
          'Vector',
          'Collection'
        ],
        correct_answer: 'List',
        explanation: 'List is a built-in data type in Python that can store multiple items. Arrays and Vectors are not built-in Python types (though arrays exist in numpy), and Collection is a more general programming concept.'
      },
      {
        question: `How do you create a comment in Python?`,
        options: [
          '# This is a comment',
          '// This is a comment',
          '/* This is a comment */',
          '<!-- This is a comment -->'
        ],
        correct_answer: '# This is a comment',
        explanation: 'Python uses the hash symbol (#) for single-line comments. // is used in C/C++/Java, /* */ is for multi-line comments in C/Java, and <!-- --> is for HTML comments.'
      },
      {
        question: `What does 'len()' function do in Python?`,
        options: [
          'Returns the length of an object',
          'Creates a new list',
          'Converts to lowercase',
          'Loops through items'
        ],
        correct_answer: 'Returns the length of an object',
        explanation: 'The len() function returns the number of items in an object. It works with strings, lists, tuples, dictionaries, and other sequence types.'
      },
      {
        question: `Which operator is used for exponentiation in Python?`,
        options: [
          '**',
          '^',
          'exp()',
          'pow()'
        ],
        correct_answer: '**',
        explanation: 'Python uses ** for exponentiation (power). For example, 2**3 equals 8. The ^ operator is used for bitwise XOR, not exponentiation.'
      },
      {
        question: `What is the correct way to create a function in Python?`,
        options: [
          'def myFunction():',
          'function myFunction():',
          'create myFunction():',
          'func myFunction():'
        ],
        correct_answer: 'def myFunction():',
        explanation: 'Python uses the "def" keyword to define functions, followed by the function name and parentheses. "function" is used in JavaScript, not Python.'
      },
      {
        question: `Which of these is used to handle exceptions in Python?`,
        options: [
          'try-except',
          'try-catch',
          'handle-error',
          'catch-throw'
        ],
        correct_answer: 'try-except',
        explanation: 'Python uses try-except blocks for exception handling. "try-catch" is used in Java and C#, while "handle-error" and "catch-throw" are not standard exception handling syntax.'
      },
      {
        question: `What is the result of 3 * 4 ** 2 in Python?`,
        options: [
          '48',
          '144',
          '24',
          '36'
        ],
        correct_answer: '48',
        explanation: 'Due to operator precedence, ** (exponentiation) is evaluated before * (multiplication). So 4**2 = 16, then 3*16 = 48. If you wanted (3*4)**2, you would need parentheses.'
      }
    ];
  }
  
  // Default questions for any other topic
  return [
    {
      question: `What is an important fundamental concept in ${topic}?`,
      options: [
        'Basic principles and foundations',
        'Advanced complex theories',
        'Historical background only',
        'Future speculation'
      ],
      correct_answer: 'Basic principles and foundations'
    },
    {
      question: `Which approach is most effective when learning ${topic}?`,
      options: [
        'Combining theory with practical application',
        'Only theoretical study',
        'Only practical work',
        'Memorizing without understanding'
      ],
      correct_answer: 'Combining theory with practical application'
    },
    {
      question: `What skill is essential for mastering ${topic}?`,
      options: [
        'Problem-solving and critical thinking',
        'Pure memorization',
        'Speed without accuracy',
        'Following instructions blindly'
      ],
      correct_answer: 'Problem-solving and critical thinking'
    },
    {
      question: `How should you approach challenges in ${topic}?`,
      options: [
        'Break them down into smaller, manageable parts',
        'Try to solve everything at once',
        'Avoid difficult problems',
        'Give up when stuck'
      ],
      correct_answer: 'Break them down into smaller, manageable parts'
    },
    {
      question: `What is the best way to stay updated with ${topic}?`,
      options: [
        'Continuous learning and practice',
        'Learn once and never update',
        'Only follow outdated resources',
        'Ignore new developments'
      ],
      correct_answer: 'Continuous learning and practice'
    }
  ];
};