/* eslint-disable @next/next/no-img-element */

type Props = {
  onClick: () => void;
}

const Loading = ({onClick}: Props) => {
  return (
    <div className="flex items-center justify-center fixed top-0 bottom-0 right-0 left-0 bg-[#1b2424]" onClick={onClick}>
      <div className="flex flex-col gap-24">
        <div className="w-[45%] min-w-[200px] rounded-md mx-auto">
          <img src="/images/logo-inovvati.png" className="w-full h-auto" alt="" />
        </div>
        <h2 className="text-fluid-3xl text-white animate-fade-in-out">Aguardando autenticação</h2>
      </div>
    </div>
  );
};

export default Loading;
