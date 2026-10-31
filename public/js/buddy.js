/**
 * buddy.js — AI Buddy response engine
 *
 * Generates contextual onboarding responses for the chat module.
 * Uses a keyword-based rule engine with a friendly fallback.
 */

(function () {
  "use strict";

  const responses = [
    {
      keywords: ["hello", "hi", "hey", "good morning", "good afternoon", "good evening"],
      replies: [
        "Hey there! 👋 Welcome to BuddyUp! I'm Buddy, your onboarding assistant. How can I help you today?",
        "Hello! Great to see you here. I'm here to guide you through your onboarding journey. What would you like to know?",
      ],
    },
    {
      keywords: ["checklist", "task", "tasks", "todo", "to-do", "complete"],
      replies: [
        "Your onboarding checklist is visible on the dashboard. Make sure to tick off each task as you complete it — your progress is saved automatically! ✅",
        "Great question! Head over to the Checklist tab to see all your onboarding tasks. Each item syncs in real-time across devices.",
      ],
    },
    {
      keywords: ["contract", "sign", "employment", "agreement"],
      replies: [
        "Your employment contract needs to be signed and submitted to HR. You'll find it in the checklist under 'Sign Employment Contract'. 📄",
        "Please ensure you sign your employment contract within your first 3 days. If you have questions, contact HR directly.",
      ],
    },
    {
      keywords: ["ktp", "id", "national id", "identification", "identity card"],
      replies: [
        "Please submit a clear copy of your National ID (KTP) to HR. A scanned copy or clear photo is acceptable. 🪪",
        "Your KTP copy is needed for the company records. Submit it to the HR team at your earliest convenience.",
      ],
    },
    {
      keywords: ["npwp", "tax", "taxation", "tax id", "pajak"],
      replies: [
        "Your NPWP (Tax Identification Number) is required for payroll setup. Please submit a copy to HR as part of your onboarding. 📋",
        "The NPWP submission is one of the key onboarding tasks. Make sure to complete it within your first week.",
      ],
    },
    {
      keywords: ["email", "it", "equipment", "laptop", "computer", "setup"],
      replies: [
        "Your company email and IT equipment request should be coordinated with the IT department. Check your checklist for the IT setup tasks. 💻",
        "For IT setup, fill out the Equipment Request Form and submit it to IT Support. They'll get back to you within 1-2 business days.",
      ],
    },
    {
      keywords: ["team", "meet", "colleague", "manager", "boss", "supervisor"],
      replies: [
        "Meeting your team is an important part of onboarding! Your manager will introduce you to the team in the first week. 🤝",
        "Don't hesitate to introduce yourself to your colleagues. Building connections early makes the onboarding experience much smoother!",
      ],
    },
    {
      keywords: ["handbook", "policy", "policies", "rules", "regulation", "company rules"],
      replies: [
        "The Company Handbook covers all the important policies and procedures. Make sure to read it carefully and acknowledge receipt in your checklist. 📖",
        "Our policies are designed to create a great workplace for everyone. The handbook is available in your onboarding documents section.",
      ],
    },
    {
      keywords: ["training", "privacy", "security", "data protection"],
      replies: [
        "Data Privacy & Security training is mandatory for all new employees. It only takes about 30 minutes and helps protect both you and the company. 🔐",
        "Please complete the security training as soon as possible. It covers how we handle sensitive data and the best practices for cybersecurity.",
      ],
    },
    {
      keywords: ["emergency", "contact", "emergency contact"],
      replies: [
        "Please provide your emergency contact details to HR. This is kept strictly confidential and only used in emergencies. 🚨",
        "Your emergency contact information is an important part of our employee records. Please submit it to HR at your earliest convenience.",
      ],
    },
    {
      keywords: ["help", "support", "assist", "question", "problem", "issue"],
      replies: [
        "I'm here to help! You can ask me about your onboarding tasks, company policies, or anything else related to getting started. What's on your mind? 😊",
        "Of course! What do you need help with? I can guide you through your checklist, explain policies, or point you to the right department.",
      ],
    },
    {
      keywords: ["progress", "percentage", "percent", "how much", "how far"],
      replies: [
        "Check your dashboard for a real-time progress bar showing how many onboarding tasks you've completed. Keep going — you're doing great! 📊",
        "Your progress is tracked automatically. Head to the dashboard to see your completion percentage. The more tasks you complete, the closer you are to being fully onboarded!",
      ],
    },
    {
      keywords: ["thanks", "thank you", "thank", "appreciate"],
      replies: [
        "You're very welcome! 😊 I'm always here if you have more questions. Good luck with your onboarding!",
        "Happy to help! Don't hesitate to come back if you need anything else. Welcome to the team! 🎉",
      ],
    },
    {
      keywords: ["bye", "goodbye", "see you", "later"],
      replies: [
        "Goodbye! Feel free to come back anytime you have questions. Have a great day! 👋",
        "Take care! Remember, I'm always here to help with your onboarding journey. See you soon! 😊",
      ],
    },
  ];

  const fallbacks = [
    "That's a great question! For detailed information, I'd recommend checking with your HR representative or browsing the Company Handbook. Is there anything else I can help you with? 😊",
    "I'm not sure I have the exact answer for that, but your HR team would be the best person to ask. In the meantime, have you checked your onboarding checklist for any pending tasks?",
    "Hmm, I don't have specific information on that. Try reaching out to your manager or HR for clarification. I'm here to help with your general onboarding journey! 🌟",
    "Good question! I'd suggest checking the Company Handbook for that. Is there anything else about your onboarding tasks I can help you with?",
  ];

  /**
   * Generate a reply for the given user message.
   * @param {string} userMessage
   * @returns {string}
   */
  window.buddyReply = function (userMessage) {
    const lower = userMessage.toLowerCase();

    for (const rule of responses) {
      if (rule.keywords.some((kw) => lower.includes(kw))) {
        const pool = rule.replies;
        return pool[Math.floor(Math.random() * pool.length)];
      }
    }

    return fallbacks[Math.floor(Math.random() * fallbacks.length)];
  };
})();
