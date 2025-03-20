import React from 'react';

type Props = {
  children: React.ReactNode;
};
const MainLayout = ({ children }: Props) => {
  return (
    <div className="relative min-h-screen flex flex-col bg-stone-200">
      <div className="bg-primary py-3 text-white text-opacity-90 w-full flex flex-row items-center justify-center text-center">
        <div className='uppercase'>
          <h1 className="text-fluid-xl uppercase font-semibold">Cabine imersiva</h1>
          <p className="text-fluid-lg">ATENDIMENTO N°: 0001</p>
        </div>
      </div>

      <div className='text-center grow flex justify-center items-center'>{children}</div>
    </div>
  );
};

export default MainLayout;
