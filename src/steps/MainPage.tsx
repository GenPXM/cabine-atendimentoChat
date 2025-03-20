/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from 'react';
import { UserData } from '../types/user.types';
import CameraPage from './CameraPage';
import FinalPage from './FinalPage';
import ResumePage from './ResumePage';
import SignaturePage from './SignaturePage';
import StartPage from './StartPage';
import Pusher from 'pusher-js';
import Loading from '../components/Loading';
import { ActionControl } from '../app/remote-control/page';

const STEP_COUNT = 4;

const initialData: UserData = {
  name: 'Renan Echeverria Matida',
  cpf: '853.567.710-02',
  photo: undefined,
  signature: undefined,
};

const MainPage = () => {
  const [currStep, setCurrStep] = useState(0);
  const [userData, setUserData] = useState(initialData);
  const [loginIniciado, setLoginIniciado] = useState(false);


  useEffect(() => {
    const pusher = new Pusher(process.env.NEXT_PUBLIC_KEY_PUSHER || '', {
      cluster: 'us2',
    });

    const channel = pusher.subscribe('poc-channel');

    channel.bind('login', (data: { name: string }) => {
      if (data.name) {
        setUserData((old) => {
          return {
            ...old,
            name: data.name,
          };
        });
      }

      setLoginIniciado(true);
    });

    channel.bind('control', (data: { action: ActionControl }) => {
      console.log(data);

      if (data.action == 'init') {
        setLoginIniciado(true);
      }

      if(data.action == 'reset') {
        resetPage();
      }

      if (data.action == 'next-step') {
        if(loginIniciado == false) {
          setLoginIniciado(true);
        }
        nextPage();
      }

      if (data.action == 'prev-step') {
        console.log('bateu aqui');

        prevPage();
      }
    });

    return () => {
      pusher.unsubscribe('poc-channel');
    };
  }, []);

  const nextPage = (data?: Partial<UserData>) => {
    setUserData((old) => {
      return {
        ...old,
        ...data,
      };
    });

    setCurrStep((curr) => {
      if (curr + 1 <= STEP_COUNT) {
        return curr + 1;
      }

      return curr;
    });
  };

  const onData = (data?: Partial<UserData>) => {
    setUserData((old) => {
      return {
        ...old,
        ...data,
      };
    });
  };

  const prevPage = () => {
    setCurrStep((curr) => {
      if (curr - 1 >= 0) {
        return --curr;
      } else {
        setLoginIniciado(false);
      }
      return curr;
    });
  };

  const resetPage = () => {
    setUserData(initialData);
    setCurrStep(0);
    setLoginIniciado(false);
  };

  return (
    <div>
      {loginIniciado == false && <Loading onClick={() => setLoginIniciado(true)} />}
      {loginIniciado && currStep == 0 && <StartPage userData={userData} onNext={onData} />}
      {currStep == 1 && <CameraPage onData={onData} />}
      {currStep == 2 && <SignaturePage onData={onData} />}
      {currStep == 3 && <ResumePage userData={userData} onNext={onData} />}
      {currStep == 4 && <FinalPage resetPage={resetPage} />}

      {/* <button onClick={() => prevPage()}>back</button> */}
    </div>
  );
};

export default MainPage;
