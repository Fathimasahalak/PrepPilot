import client from './client';

export async function signup(email: string, password: string, name: string) {
  const response = await client.post('/auth/signup', { email, password, name });
  return response.data;
}

export async function login(email: string, password: string) {
  const response = await client.post('/auth/login', { email, password });
  return response.data;
}