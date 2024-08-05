import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
    return (
        <div className="home-content">
            <section className="p-5 d-flex align-items-center justify-content-center flex-column">
                <div className="text-center mb-3 mt-5 d-flex align-items-center justify-content-center flex-column">
                    <h1 className="mb-5 mt-5" style={{ fontSize: '64px', fontFamily: 'Trebuchet MS'}}>
                        TU DINERO, DONDE Y CUANDO QUIERAS
                    </h1>
                    <h3 className="w-50 mb-3" style={{fontFamily: 'Trebuchet MS'}}>
                        La cuenta diseñada para hacerte ahorrar tiempo en todo el mundo.
                    </h3>
                    <Link
                        className="btn text-white"
                        style={{ backgroundColor: '#003459',fontFamily: 'Trebuchet MS' }}
                        type="button"
                        to= "/signup"
                    >
                      Crear cuenta
                    </Link>
                </div>
                <div className="w-100" style={{ height: '380px',fontFamily: 'Trebuchet MS' }}>
                    <img
                        className="rounded-5 img-fluid h-100"
                        src="https://www.santander.com/content/dam/santander-com/es/stories/contenido-stories/2021/educacionfinanciera/im-storie-guia-para-saber-que-son-las-criptomonedas-3.jpg"
                        alt="Imagen supermega arrechisima"
                        style={{ width: '100% !important' }}
                    />
                </div>
            </section>

            <section className="text-white p-5" style={{ backgroundColor: '#145180' }}>
                <div className="d-flex">
                    <div>
                        <h1 className="mb-5 mt-5" style={{ fontSize: '64px',fontFamily: 'Trebuchet MS' }}>
                            Ahorra tiempo al pagar tus cuentas compartidas con amigos
                        </h1>
                        <h4 style={{fontFamily: 'Trebuchet MS'}}>
                            Explicación breve del sistema y de las funciones que ofrece y el porqué el usuario debe utilizar
                            nuestros servicios
                        </h4>
                    </div>
                    <div className="p-3">
                        <img
                            className="rounded-5"
                            src="https://img.freepik.com/vector-premium/concepto-financiero-exito-financiero-grafico-finanzas-gafas-realidad-virtual-digitaces-desgaste-mujer-hombre_48369-14327.jpg"
                            alt="Grupo"
                        />
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Home;