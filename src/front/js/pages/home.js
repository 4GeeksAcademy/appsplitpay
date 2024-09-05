import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import "../../styles/home.css"

function Home() {
  const navigate = useNavigate();

  const handleSignUp = () => {
    navigate('/signup');
  };
  return (
    <div className="home-content">
      <section className="hero-section p-5 d-flex align-items-center justify-content-center flex-column">
        <div className="hero-text text-center mb-5 mt-5 d-flex align-items-center justify-content-center flex-column">
          <h1 className="hero-title mb-4 mt-5">
            <strong>YOUR MONEY WHEN AND WHEREVER YOU NEED IT</strong>
          </h1>
          <h3 className="hero-subtitle w-50 mb-4">
          The account designed to save you time around the world.
          </h3>
          <button
            className="btn text-white signup-button mb-5"
            onClick={handleSignUp}>
            Create Account
          </button>
        </div>
        <div className="hero-image-container w-100 mb-5">
          <img className="rounded-5 img-fluid h-100 hero-image"
            src="https://www.santander.com/content/dam/santander-com/es/stories/contenido-stories/2021/educacionfinanciera/im-storie-guia-para-saber-que-son-las-criptomonedas-3.jpg"
            alt="Imagen supermega arrechisima" />
        </div>
      </section>

      <section className="features-section text-white p-5">
        <div className="d-flex align-items-center justify-content-between">
          <div className="features-text">
            <h1 className="features-title mb-4 mt-5">
              <strong>Your financial life, download our app today.</strong>
            </h1>
            <h2 className="features-subtitle mb-4">
              <strong>Tired of having to generate pending charges to friends for old bills ?</strong>
            </h2>
            <h3 className="mb-4">With our app, sending and receiving money between friends or colleagues has never been easier.
              easy. Connect with your friends around the world, share expenses and save time and money.
              Our platform offers you transparent fees with no surprises, no matter if you send $10 or 10,000 euros.Forget the hassle and discover a new way to send money.
            </h3>
            <button
              className="btn text-white signup-button mb-5"
              onClick={handleSignUp}>
              Crear cuenta
            </button>
          </div>
          <div className="features-image-container p-3">
            <img className="rounded-5 features-image"
              src="https://img.freepik.com/vector-premium/concepto-financiero-exito-financiero-grafico-finanzas-gafas-realidad-virtual-digitaces-desgaste-mujer-hombre_48369-14327.jpg"
              alt="Grupo" />
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
