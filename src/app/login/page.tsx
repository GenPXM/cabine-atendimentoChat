'use client';

import { FormEvent, useState } from 'react';

export default function Login() {
  const [name, setName] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [errorText, setErrorText] = useState(null);

  const handleSendToCabine = (e: FormEvent) => {
    e.preventDefault();

    fetch('/api/pusher', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    })
      .then(() => {
        setShowAlert(true);

        setTimeout(() => {
          setShowAlert(false);
        }, 1000 * 5);
      })
      .catch((err) => {
        setErrorText(err.toString());
        console.log(err);
      });
  };

  return (
    <div className="flex flex-col gap-3 w-full max-w-[80%] md:max-w-[400px]">
      <h2 className="text-fluid-xl font-bold mb-2 text-primary-text uppercase">Login cabine</h2>

      {showAlert && (
        <span className="bg-green-300 border-2 font-semibold text-green-700 py-3 px-5 text-lg rounded-lg mt-4">
          Login enviado com sucesso!
        </span>
      )}

      {errorText && (
        <span className="bg-red-300 font-semibold  border-2 text-red-800 py-3 px-5 text-lg rounded-lg mt-4">
          Falha ao enviar login: {errorText}
        </span>
      )}

      <form onSubmit={handleSendToCabine}>
        <div>
          <label htmlFor="name"></label>
          <input
            className="py-4 px-3 rounded w-full"
            type="text"
            autoComplete="name"
            id="name"
            name="name"
            onChange={(e) => {
              setErrorText(null);
              setName(e.target.value);
            }}
            value={name}
            placeholder="Digite o nome"
          />
        </div>

        <button
          className="bg-primary text-white font-semibold rounded-md text-fluid-base px-6 py-3 mt-5 w-full"
          onClick={handleSendToCabine}
        >
          Enviar para a cabine
        </button>
      </form>
    </div>
  );
}
