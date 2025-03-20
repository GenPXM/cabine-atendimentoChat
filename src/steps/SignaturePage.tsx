import { useEffect, useRef, useState } from 'react';
import { UserData } from '../types/user.types';
import Pusher from 'pusher-js';
import { ActionControl } from '../app/remote-control/page';
import { useIdleTimer } from 'react-idle-timer';

type Props = {
  onData: (userData: Partial<UserData>) => void;
};

const isBlankBackground = false;

const SignaturePage = ({ onData }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState(false);

  // const assinatura = new Audio('./audio/steps/assinatura.mp3');
  // const assinaturaFim = new Audio('./audio/steps/assinaturafim.mp3');

  const handleOnIdle = () => {
    if (!isCanvasBlank()) {
      // assinaturaFim.play();
    }
  };

  // useEffect(() => {
  //   setTimeout(() => {
  //     assinatura.play();
  //   }, 1000);
  // }, []);

  useEffect(() => {
    const pusher = new Pusher(process.env.NEXT_PUBLIC_KEY_PUSHER || '', {
      cluster: 'us2',
    });

    const channel = pusher.subscribe('poc-channel');

    channel.bind('control', (data: { action: ActionControl }) => {
      if (data.action == 'clean-pad') {
        clearCanvas();
      }
    });

    return () => {
      pusher.unsubscribe('poc-channel');
    };
  }, []);

  const getPosition = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>,
  ) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    let clientX, clientY;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  };

  const startDrawing = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>,
  ) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;

    const { x, y } = getPosition(e);
    context.beginPath();
    context.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    setShowAlert(false);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;

    const { x, y } = getPosition(e);
    context.lineTo(x, y);
    context.stroke();
  };

  const stopDrawing = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;

    context.closePath();
    setIsDrawing(false);
    saveAsImage();
  };

  const resizeCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    const { width, height } = parent.getBoundingClientRect();

    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext('2d');
    if (context) {
      context.lineWidth = 2;
      context.lineCap = 'round';
      context.strokeStyle = 'black';

      if (isBlankBackground) {
        context.fillStyle = 'white';
        context.fillRect(0, 0, canvas.width, canvas.height);
      }
    }
  };

  const clearCanvas = () => {
    setShowAlert(false);
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    context.clearRect(0, 0, canvas.width, canvas.height);
    if (isBlankBackground) {
      context.fillStyle = 'white';
      context.fillRect(0, 0, canvas.width, canvas.height);
    }
  };

  const isCanvasBlank = (): boolean => {
    const canvas = canvasRef.current;
    if (!canvas) return true;
    const ctx = canvas.getContext('2d');
    if (!ctx) return true;

    const pixelData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < pixelData.data.length; i += 4) {
      if (pixelData.data[i + 3] !== 0) {
        return false;
      }
    }

    return true;
  };

  const saveAsImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const image = canvas.toDataURL('image/png');

    if (!isCanvasBlank()) {
      onData({
        signature: image,
      });
    } else {
      setShowAlert(true);
    }
  };

  useEffect(() => {
    resizeCanvas();

    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  useIdleTimer({
    timeout: 3000, // 3 segundos
    onIdle: handleOnIdle,
    debounce: 500,
  });

  return (
    <div className="flex flex-col justify-between items-center">
      <h2 className="font-bold text-3xl text-primary-text text-fluid-3xl">Renovação de CNH</h2>

      <div className="px-3 py-1 rounded bg-primary mt-10 w-fit">
        <span className="text-white font-bold text-fluid-xl">Passo 2 - Captura de assinatura</span>
      </div>

      <p className="max-w-[85%] text-primary-text text-fluid-xl mb-6 mt-10">
        Utilize o dispositivo com a caneta para escrever sua assinatura. <br /> Quando terminar
        clique em <strong>confirmar</strong>, caso tenha errado clique em{' '}
        <strong>tentar de novo</strong>.
        <br />
      </p>

      <p className="text-primary-text text-fluid-lg mb-4">
        <strong>Dica:</strong> Conforme vai escrevendo confira o resultado na tela
      </p>
      <div className="bg-white p-4 rounded-lg">
        <div
          className={`rounded-lg ${
            !showAlert ? 'border-[#e7e7e7] border-[1px]' : 'border-red-500 border-2'
          }`}
        >
          <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            width={900}
            height={300}
          />
        </div>
      </div>

      {showAlert && (
        <span className="bg-red-300  border-2 text-red-800 py-3 px-5 text-3xl rounded-lg mt-4">
          Forneça uma assinatura válida
        </span>
      )}

      {/* <div className="flex flex-row gap-8 mt-16 text-fluid-xl">
        <button
          className="px-6 py-4 bg-primary-text text-white rounded font-semibold uppercase"
          onClick={clearCanvas}
        >
          TENTAR DE NOVO
        </button>
        <button
          className="px-6 py-4 bg-primary text-white rounded font-semibold uppercase"
          onClick={saveAsImage}
        >
          CONFIRMAR
        </button>
      </div> */}
    </div>
  );
};

export default SignaturePage;
