import React, { useState } from 'react';

function AtivarGeolocalizacao() {
  const [localizacao, setLocalizacao] = useState(null);
  const [status, setStatus] = useState('Geolocalização inativa');

  const ativarGeolocalizacao = () => {
    if (!navigator.geolocation) {
      setStatus('Geolocalização não é suportada pelo seu navegador');
    } else {
      setStatus('Localizando...');
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocalizacao({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
          setStatus('Localização encontrada');
        },
        () => {
          setStatus('Não foi possível acessar a geolocalização');
        }
      );
    }
  };

  return (
    <div className="geolocalizacao-container">
      <h4>Ativar Geolocalização</h4>
      <button className="geolocalizacao-botao" onClick={ativarGeolocalizacao}>
        Ativar Geolocalização
      </button>
      <p className="geolocalizacao-resultado">{status}</p>
      {localizacao && (
        <div>
          <p>Latitude: {localizacao.latitude}</p>
          <p>Longitude: {localizacao.longitude}</p>
        </div>
      )}
    </div>
  );
}

export default AtivarGeolocalizacao;
