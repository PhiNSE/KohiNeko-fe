import { DEFAULT_API_URL } from '../utils/appConstants';
export async function forgotPassword(email) {
  const url = `/auth/forgot-password`;
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  };
  const response = await fetch(DEFAULT_API_URL + url, options);
  const data = await response.json();
  // Store the reset token
  const resetToken = data.resetToken;
  return { data, resetToken };
}

export async function resetPassword({ token, password, passwordConfirm }) {
  console.log(token);
  const url = `/auth/reset-password/${token}`;
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ password, passwordConfirm }),
  };
  const response = await fetch(DEFAULT_API_URL + url, options);
  const data = await response.json();
  return data;
}
