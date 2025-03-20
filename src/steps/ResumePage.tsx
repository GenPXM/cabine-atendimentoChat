/* eslint-disable @next/next/no-img-element */
import { UserData } from '../types/user.types';

type Props = {
  userData: UserData;
  onNext: () => void;
};

const ResumePage = ({ userData }: Props) => {
  // const finalizacao = new Audio('./audio/steps/finalizacao.mp3');

  // useEffect(() => {
  //   setTimeout(() => {
  //     finalizacao.play();
  //   }, 1000);
  // }, []);

  return (
    <div className="flex flex-col items-center">
      <h2 className="font-bold text-3xl text-primary-text text-fluid-3xl">Renovação de CNH</h2>

      <div className="px-3 py-1 rounded bg-primary mt-10 w-fit">
        <span className="text-white font-bold text-fluid-xl">Passo 3 - Resumo</span>
      </div>

      <div className="mt-10 bg-stone-50 px-10 py-16 rounded-md flex flex-col gap-14">
        <div className="flex flex-col justify-content items-start gap-2">
          <h1 className="font-bold  text-primary-text text-fluid-lg">IDENTIFICAÇÃO DO CLIENTE</h1>
          <div className="flex flex-col items-start justify-start gap-1 text-fluid-xl">
            <div className="uppercase">
              <span className="font-bold uppercase">Nome: </span>
              <span>{userData.name}</span>
            </div>
            {/* <div>
              <span className="font-bold ">CPF: </span>
              <span>{userData.cpf}</span>
            </div> */}
          </div>
        </div>

        <div className="flex gap-10">
          <div className="flex flex-col gap-2">
            <h2 className="text-primary-text font-bold uppercase text-fluid-lg self-start">
              Captura realizada
            </h2>

            <div className="w-[400px] rounded-md overflow-hidden bg-white">
              <img
                src={userData.photo}
                alt="captura de foto do usuario"
                className="w-full h-auto"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <h2 className="text-primary-text font-bold uppercase text-fluid-lg self-start">
              Assinatura realizada
            </h2>
            <div className="w-[400px] rounded-md overflow-hidden border-2 border-gray-300">
              <img
                src={userData.signature}
                alt="captura de foto do usuario"
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </div>
      {/* <div className="mt-10 text-fluid-xl">
        <button
          className="bg-primary text-white font-semibold rounded-md px-6 py-4"
          onClick={onNext}
        >
          CONFIRMAR
        </button>
      </div> */}
    </div>
  );
};

export default ResumePage;
