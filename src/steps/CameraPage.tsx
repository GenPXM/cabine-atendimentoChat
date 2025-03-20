import CameraComponent, { DEFAULT_TIME } from '../components/CameraComponent';

type Props = {
  onData: () => void;
};

const CameraPage = ({ onData }: Props) => {
  return (
    <div className="flex flex-col justify-between items-center">
      <h2 className="font-bold text-primary-text text-fluid-3xl">Renovação de CNH</h2>
      <div className="px-3 py-1 rounded bg-primary mt-6 w-fit">
        <span className="text-white font-bold text-fluid-xl">Passo 1 - Captura de imagem</span>
      </div>

      <p className="max-w-[800px] text-primary-text text-fluid-xl mb-16 mt-10">
        Se posicione na cadeira e clique em tirar foto. <br />
        Olhe para a câmera e aguarde <strong>{DEFAULT_TIME} segundos</strong> até que a foto será
        tirada.
      </p>

      <div>
        <CameraComponent onData={onData} />
      </div>
    </div>
  );
};

export default CameraPage;
