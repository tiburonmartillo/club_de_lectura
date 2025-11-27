import { projectId, publicAnonKey } from './info';

const BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-984e3078`;

export async function get(key: string): Promise<any> {
  try {
    const response = await fetch(`${BASE_URL}/kv/get`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`
      },
      body: JSON.stringify({ key })
    });

    if (!response.ok) {
      console.error('KV Get failed:', await response.text());
      return null;
    }

    const data = await response.json();
    return data.value;
  } catch (error) {
    console.error('KV Get error:', error);
    return null;
  }
}

export async function set(key: string, value: any): Promise<void> {
  try {
    const response = await fetch(`${BASE_URL}/kv/set`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`
      },
      body: JSON.stringify({ key, value })
    });

    if (!response.ok) {
      console.error('KV Set failed:', await response.text());
    }
  } catch (error) {
    console.error('KV Set error:', error);
  }
}
