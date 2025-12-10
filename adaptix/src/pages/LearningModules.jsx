// LearningModules.jsx
// LearningModules.jsx
import React, { useState } from 'react';
import './LearningModules.css';

const subjects = [
  { name: 'English', icon: '📘' },
  { name: 'Math', icon: '🔢' },
  { name: 'Logical Reasoning', icon: '🧠' }
];

const subjectContent = {
  English: [
    {
      topic: 'Grammar Basics',
      explanation:
        "Learn the building blocks of English! Understand what nouns, verbs, and adjectives are, and how to put words together in a sentence.\nExample: 'The cat runs fast.' → 'cat' is a noun, 'runs' is a verb, 'fast' is an adverb."
    },
    {
      topic: 'Vocabulary Builder',
      explanation:
        "Grow your word power! Learn new words, their meanings, and how to use them in real life.\nExample: Word: 'Happy' — Meaning: Feeling good or joyful.\nUse in a sentence: 'I feel happy when I play.'"
    },
    {
      topic: 'Comprehension Practice',
      explanation:
        "Practice reading and understanding short stories or passages. Then, answer questions to show what you've learned.\nExample: Read: 'Ravi went to the park and played with his dog.'\nQuestion: Where did Ravi go? Answer: The park."
    }
  ],
  Math: [
    {
      topic: 'Addition and Subtraction',
      explanation:
        "Learn how to add and subtract numbers step by step.\nExample: Addition → 3 + 2 = 5\nSubtraction → 10 - 4 = 6"
    },
    {
      topic: 'Multiplication & Division',
      explanation:
        "Understand how to multiply and divide numbers with simple examples.\nExample: Multiplication → 4 × 2 = 8\nDivision → 12 ÷ 3 = 4"
    },
    {
      topic: 'Algebra & Word Problems',
      explanation:
        "Solve problems using simple math and letters like x or y.\nExample: If x + 3 = 7, what is x? Answer: x = 4.\nAlso learn how to understand math stories!\nExample: 'Rina has 5 candies. She buys 3 more. How many does she have now?' Answer: 8"
    }
  ],
  'Logical Reasoning': [
    {
      topic: 'Pattern Recognition',
      explanation:
        "Find what comes next in a number or shape pattern.\nExample: 2, 4, 6, ? → Answer: 8 (Add 2 each time)"
    },
    {
      topic: 'Sequencing Problems',
      explanation:
        "Put things in the correct order, like steps or events.\nExample: What do you do first? Wake up → Brush teeth → Eat breakfast"
    },
    {
      topic: 'Matching Shapes',
      explanation:
        "Find shapes that look the same and spot the ones that don’t match.\nExample: 🔺 🟦 🔺 — Match the triangle (🔺) with the other triangle.\nOr, spot the different one: 🟪 🟪 🟨 → Answer: 🟨 is different."
    }
  ]
};

function LearningModules() {
  const [activeSubject, setActiveSubject] = useState(null);

  return (
    <div className="modules-container">
      <h1 className="modules-title">Learning Modules</h1>
      <div className="subjects-grid">
        {subjects.map((subject) => (
          <div
            key={subject.name}
            className={`subject-card ${activeSubject === subject.name ? 'active' : ''}`}
            onClick={() => setActiveSubject(subject.name)}
          >
            <span className="icon">{subject.icon}</span>
            <span>{subject.name}</span>
          </div>
        ))}
      </div>

      {activeSubject && (
        <div className="subject-content">
          <h2>{activeSubject} Content</h2>
          <ul>
            {subjectContent[activeSubject].map((item, index) => (
              <li key={index}>
                <strong>{item.topic}:</strong> <br />{item.explanation.split('\n').map((line, i) => (
                  <div key={i}>{line}</div>
                ))}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default LearningModules;
