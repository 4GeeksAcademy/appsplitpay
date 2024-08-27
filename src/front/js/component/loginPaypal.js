import React, { useState, useEffect } from 'react';

const loginPaypal = () => {
  const [accessToken, setAccessToken] = useState(null);
  const [error, setError] = useState(null);
  const [userInfo, setUserInfo] = useState(null);

  const clientId = 'https://sandbox.paypal.com';
  const clientSecret = 'AYAHrre39sJu0_FFsnRKrWr0X4mxM1d5od9RNOIx_oP3gv7jKXHVHBO1lnE4G7LpePT9cEvj3EHxLvJI';
  const redirectUri = 'https://ominous-space-telegram-x5rp6rgqvv9pfvp9x-3000.app.github.dev/homeUser/callback';
  const scope = 'openid profile email';

  const handleAuth = () => {
    const authUrl = `https://www.sandbox.paypal.com/signin/authorize?client_id=AYAHrre39sJu0_FFsnRKrWr0X4mxM1d5od9RNOIx_oP3gv7jKXHVHBO1lnE4G7LpePT9cEvj3EHxLvJI&response_type=code&redirect_uri=https://ominous-space-telegram-x5rp6rgqvv9pfvp9x-3000.app.github.dev/homeUser/callback&scope=openid+profile+email`;
    window.location.href = authUrl;
  };

  const handleCallback = () => {
    const code = new URLSearchParams(window.location.search).get('code');
    if (code) {
      fetch(`https://api.sandbox.paypal.com/v1/identity/openidconnect/tokenservice`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
        },
        body: `grant_type=authorization_code&code=${code}&redirect_uri=${redirectUri}`,
      })
        .then(response => response.json())
        .then(data => {
          setAccessToken(data.access_token);
          fetch(`https://api.sandbox.paypal.com/v1/identity/openidconnect/userinfo`, {
            headers: {
              'Authorization': `Bearer ${data.access_token}`,
            },
          })
            .then(response => response.json())
            .then(data => {
              setUserInfo(data);
            })
            .catch(error => {
              setError(error);
            });
        })
        .catch(error => {
          setError(error);
        });
    }
  };

  useEffect(() => {
    handleCallback();
  }, []);

  if (accessToken && userInfo) {
    return (
      <div>
        <h1>Bienvenido, {userInfo.name}!</h1>
        <p>Tu email es: {userInfo.email}</p>
        <p>Tu token de acceso es: {accessToken}</p>
      </div>
    );
  } else if (error) {
    return (
      <div>
        <h1>Error al autenticar</h1>
        <p>{error.message}</p>
      </div>
    );
  } else {
    return (
        <button className="btn btn-primary" style={{borderRadius: '30px',}} id="paypal-login-btn" onClick={handleAuth}>
        <i className="fab fa-paypal"></i> Iniciar sesión con Paypal
      </button>
    );
  }
};

export default loginPaypal