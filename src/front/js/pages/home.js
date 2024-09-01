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
            <strong>TU DINERO, DONDE Y CUANDO QUIERAS</strong>
          </h1>
          <h3 className="hero-subtitle w-50 mb-4">
            La cuenta diseñada para hacerte ahorrar tiempo en todo el mundo.
          </h3>
          <button
            className="btn text-white signup-button mb-5"
            onClick={handleSignUp}>
            Crear cuenta
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
              <strong>tu vida financiera, descarga nuestra app hoy mismo.</strong>
            </h1>
            <h2 className="features-subtitle mb-4">
              <strong>¿Estás cansado de lidiar con comisiones altas y procesos complicados para enviar dinero
                al extranjero?</strong>
            </h2>
            <h3 className="mb-4">Con nuestra app, enviar y recibir dinero entre amigos o colegas nunca ha sido tan
              fácil. Conéctate con tus amigos en todo el mundo, comparte gastos y ahorra tiempo y dinero.
              Nuestra plataforma te ofrece tarifas transparentes y sin sorpresas, sin importar si envías 10
              dólares o 10,000 euros. Olvídate de las complicaciones y descubre una nueva forma de enviar dinero.
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
