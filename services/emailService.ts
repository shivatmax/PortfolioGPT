import { PROFILE } from '../constants';

export interface EmailPayload {
  name: string;
  email: string;
  message: string;
}

export const sendEmail = async ({ name, email, message }: EmailPayload): Promise<boolean> => {
  // Call the Vercel Serverless Function
  try {
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        email,
        message,
        to: PROFILE.email
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to send email');
    }

    return true;
  } catch (error) {
    console.error('Email sending failed:', error);
    return false;
  }
};
