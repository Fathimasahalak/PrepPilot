PrepPilot
An AI-powered interview preparation platform that generates personalized practice questions, evaluates your answers with instant feedback, and tracks your progress over time.

Live app: prep-pilot.vercel.app

What it does
Sign up and log in securely (JWT-based authentication)
Tell PrepPilot which role, experience level, target company, and topic you're preparing for
Get 5 AI-generated interview questions tailored to that combination, powered by Google Gemini
Answer each question and receive an instant score (1-10) and feedback
Review your full practice history, with past sessions, questions, answers, and scores saved to your account
Why I built this
I built PrepPilot while preparing for my own placement interviews (Cognizant Java FSE, TCS NQT). Rather than just using ChatGPT/Gemini directly for practice questions, I wanted a tool that:

Generates questions specific to my role, level, and target company's interview style
Gives structured, scored feedback instead of a plain chat response
Remembers my practice history so I can track improvement over time
Tech stack
Frontend

React + TypeScript + Vite
React Router for navigation
Axios for API calls
Custom design system (Lora/Inter/IBM Plex Mono, warm paper palette)
Backend

Java + Spring Boot
Spring Security + JWT for authentication
Spring Data JPA + Hibernate
PostgreSQL (hosted on Render)
Google Gemini API for question generation and answer evaluation
Deployment

Backend: Docker container on Render
Frontend: Vercel
Database: Render PostgreSQL
Architecture
React (Vercel)  →  Spring Boot REST API (Render, Docker)  →  Gemini API
                              ↓
                    PostgreSQL (Render)
JWT tokens issued on login, attached to every request via an Axios interceptor
A Spring Security filter validates the token on each request and identifies the current user
Each practice session (role/level/company/topic) is linked to the logged-in user; each question/answer/score is linked to its session
Key features
Personalized question generation — prompts Gemini with role, experience level, company, and topic to produce realistic, targeted questions
AI-scored feedback — each answer is evaluated and scored out of 10 with a short explanation
Persistent history — every session and Q&A pair is saved per user in PostgreSQL, viewable later
Secure auth — passwords hashed with BCrypt, stateless JWT sessions, protected API routes
Running locally
Backend

cd backend
# add your own Gemini API key + Postgres credentials to
# src/main/resources/application-local.properties
./mvnw spring-boot:run -Dspring-boot.run.profiles=local
Frontend

cd frontend
npm install
npm run dev
Future improvements
Resume-based question generation
Follow-up questions based on the candidate's previous answer
Weak-topic tracking across sessions
Company-specific question style presets
