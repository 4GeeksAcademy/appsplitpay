import React, { useState, useEffect } from 'react';


const handlePayPalLogin = () => {
  // Inicializa el estado de la aplicación con valores nulos para accessToken, error y userInfo
  const [accessToken, setAccessToken] = useState(null);
  const [error, setError] = useState(null);
  const [userInfo, setUserInfo] = useState(null);

  // Define las constantes para la autenticación con PayPal
  const clientId = 'https://sandbox.paypal.com'; 
  const clientSecret = 'AYAHrre39sJu0_FFsnRKrWr0X4mxM1d5od9RNOIx_oP3gv7jKXHVHBO1lnE4G7LpePT9cEvj3EHxLvJI'; 
  const redirectUri = 'https://ominous-space-telegram-x5rp6rgqvv9pfvp9x-3000.app.github.dev/homeUser/callback'; 
  const scope = 'openid profile email'; // Alcance de la autenticación (openid, perfil y correo electrónico)

  // Define la función handleAuth que redirige al usuario a la página de autenticación de PayPal
  const handleAuth = () => {
    const authUrl = `https://www.sandbox.paypal.com/signin/authorize?client_id=AYAHrre39sJu0_FFsnRKrWr0X4mxM1d5od9RNOIx_oP3gv7jKXHVHBO1lnE4G7LpePT9cEvj3EHxLvJI&response_type=code&redirect_uri=https://ominous-space-telegram-x5rp6rgqvv9pfvp9x-3000.app.github.dev/homeUser/callback&scope=openid+profile+email`;
    // Redirige al usuario a la página de autenticación de PayPal
    window.location.href = authUrl;
  };

  // Define la función handleCallback que maneja la respuesta de la autenticación de PayPal
  const handleCallback = () => {
    // Obtiene el código de autorización de la URL de respuesta
    const code = new URLSearchParams(window.location.search).get('code');
    // Si hay un código de autorización, solicita un token de acceso a PayPal
    if (code) {
      // Envía una solicitud POST a la API de PayPal para obtener un token de acceso
      fetch(`https://api.sandbox.paypal.com/v1/identity/openidconnect/tokenservice`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
        },
        body: `grant_type=authorization_code&code=${code}&redirect_uri=${redirectUri}`,
      })
        // Procesa la respuesta de la API de PayPal
        .then(response => response.json())
        .then(data => {
          // Establece el token de acceso en el estado de la aplicación
          setAccessToken(data.access_token);
          // Solicita información del usuario a la API de PayPal
          fetch(`https://api.sandbox.paypal.com/v1/identity/openidconnect/userinfo`, {
            headers: {
              'Authorization': `Bearer ${data.access_token}`,
            },
          })
            // Procesa la respuesta de la API de PayPal
            .then(response => response.json())
            .then(data => {
              // Establece la información del usuario en el estado de la aplicación
              setUserInfo(data);
            })
            .catch(error => {
              // Establece el error en el estado de la aplicación
              setError(error);
            });
        })
        .catch(error => {
          // Establece el error en el estado de la aplicación
          setError(error);
        });
    }
  };

  // Utiliza el hook useEffect para ejecutar la función handleCallback cuando se monta el componente
  useEffect(() => {
    handleCallback();
  }, []);

  // Renderiza el componente según el estado de la aplicación
  if (accessToken && userInfo) {
    // Si hay un token de acceso y información del usuario, muestra un mensaje de bienvenida
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
        <button 
        className="btn btn-primary" 
        style={{borderRadius: '30px',}} 
        id="paypal-login-btn" 
        onClick={(e) => {
          handleAuth();
          loginPaypal();
        }}
        >
        <i className="fab fa-paypal"></i> Iniciar sesión con Paypal
      </button>
    );
  }
};

export default handlePayPalLogin