'use client';
import React, { useState } from 'react';

export type ActionControl =
  | 'init'
  | 'reset'
  | 'next-step'
  | 'prev-step'
  | 'new-photo'
  | 'take-photo'
  | 'clean-pad'
  ;

const RemoteControlPage = () => {
  const [errorText, setErrorText] = useState(null);

  const handleAction = (action: ActionControl) => {
    fetch('/api/pusher', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'control', action }),
    })
      .then(() => {
        console.log('sucesso!');
      })
      .catch((err) => {
        setErrorText(err.toString());
        console.log(err);
      });
  };

  return (
    <div className="flex flex-col gap-3 w-full p-3 max-w-md">
      <h2 className="text-fluid-xl font-bold mb-2 text-primary-text uppercase">Controle remoto</h2>

      {errorText && (
        <span className="bg-red-300 font-semibold  border-2 text-red-800 py-3 px-5 text-lg rounded-lg mt-4">
          Falha ao enviar ação: {errorText}
        </span>
      )}

      <button
        className="bg-primary text-white font-semibold rounded-md text-fluid-base px-6 py-3  w-full"
        onClick={() => handleAction('init')}
      >
        Iniciar com Renan
      </button>
      <div className="flex gap-4">
        <button
          className="bg-gray-600 text-white font-semibold rounded-md text-fluid-base px-6 py-3  w-full"
          onClick={() => handleAction('prev-step')}
        >
          Voltar etapa
        </button>

        <button
          className="bg-primary text-white font-semibold rounded-md text-fluid-base px-6 py-3  w-full"
          onClick={() => handleAction('next-step')}
        >
          Proxima etapa / Confirmar
        </button>
      </div>

      <div className="bg-gray-50 p-2 mt-4">
        <span className="font-semibold mb-2 block">Camera</span>
        <div className="flex gap-4 ">
          <button
            className="bg-primary text-white font-semibold rounded-md text-fluid-base px-6 py-3  w-full"
            onClick={() => handleAction('take-photo')}
          >
            Tirar foto
          </button>
          <button
            className="bg-gray-600 text-white font-semibold rounded-md text-fluid-base px-6 py-3  w-full"
            onClick={() => handleAction('new-photo')}
          >
            Nova foto
          </button>
        </div>
      </div>

      <div className="bg-gray-50 p-2 mt-4">
        <span className="font-semibold mb-2 block">Assinatura</span>
        <button
          className="bg-primary text-white font-semibold rounded-md text-fluid-base px-6 py-3  w-full"
          onClick={() => handleAction('clean-pad')}
        >
          Limpar campo assinatura
        </button>
      </div>
    </div>
  );
};

export default RemoteControlPage;
