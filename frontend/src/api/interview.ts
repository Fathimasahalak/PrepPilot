import client from './client';

export async function generateQuestions(role: string, level: string, company: string, topic: string) {
  const response = await client.post('/generate-questions', { role, level, company, topic });
  return response.data;
}

export async function evaluateAnswer(sessionId: number, question: string, userAnswer: string) {
  const response = await client.post('/evaluate-answer', { sessionId, question, userAnswer });
  return response.data;
}

export async function getSessions() {
  const response = await client.get('/sessions');
  return response.data;
}