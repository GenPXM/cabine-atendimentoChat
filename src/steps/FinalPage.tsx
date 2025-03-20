import { CircleCheck } from 'lucide-react';
import { useEffect, useState } from 'react';

type Props = {
  resetPage: () => void;
};

let intervalId: NodeJS.Timeout | undefined;
const DEFAULT_TIME = 10;

const FinalPage = ({ resetPage }: Props) => {
  const [timer, setTimer] = useState(DEFAULT_TIME);

  const startTimer = () => {
    intervalId = setInterval(() => {
      setTimer((old) => --old);
    }, 1000);
  };

  useEffect(() => {
    startTimer();

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    if (timer == 0) {
      resetPage();
      clearInterval(intervalId);
      setTimer(DEFAULT_TIME);
    }
  }, [timer]);

  const formatTime = (seconds: number) => {    
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
   
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');
    
    return `${formattedMinutes}:${formattedSeconds}`;
  };

  return (
    <div className="flex flex-col items-center justify-center gap-8">
      <CircleCheck className="text-primary w-44 h-44" />
      <h2 className="font-bold text-3xl text-primary-text text-fluid-3xl">Renovação de CNH</h2>

      <p className="max-w-[900px] text-fluid-2xl font-medium text-primary-text">
        Sua solicitação foi realizada com sucesso! <br /> Você pode sair da cabine agora.
      </p>
      <p className="text-primary-text text-fluid-xl font-semibold">
        A sessão será encerrada em: {formatTime(timer)}
      </p>
    </div>
  );
};

export default FinalPage;
