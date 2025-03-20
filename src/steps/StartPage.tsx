import { UserData } from '../types/user.types';

type Props = {
  userData: UserData;
  onNext: () => void;
};

const StartPage = ({ userData }: Props) => {
  // useEffect(() => {
  //   const audioInicial = new Audio('./audio/steps/bemvindo.mp3');
  //   audioInicial.play();
  // }, []);

  return (
    <div className="flex flex-col justify-between items-center">
      <h1 className="text-primary-text font-bold text-fluid-3xl mb-8">Renovação de CNH</h1>

      <p className="max-w-[80%] text-primary-text text-fluid-xl mb-16">
        Bem vindo ao serviço de renovação de CNH! <br /> Confirme seus dados e clique em confirmar
        para dar inicio a sua solicitação
      </p>

      <div className="flex flex-col justify-content items-start p-6 pb-10 bg-white rounded-xl w-[80%] gap-6">
        <h1 className="font-bold text-fluid-xl self-center text-primary-text">
          IDENTIFICAÇÃO DO CLIENTE
        </h1>
        <div className="flex flex-col items-start text-fluid-xl justify-start gap-2">
          <div className="uppercase">
            <span className="font-bold">Nome: </span>
            <span>{userData.name}</span>
          </div>
          {/* <div>
            <span className="font-bold ">CPF: </span>
            <span>{userData.cpf}</span>
          </div> */}
        </div>
      </div>
      {/* <div className="mt-20 ">
        <button
          className="bg-primary text-white font-semibold rounded-md text-fluid-xl px-6 py-4" 
          onClick={onNext}
        >
          CONFIRMAR E INICIAR
        </button>
      </div> */}
    </div>
  );
};

export default StartPage;
