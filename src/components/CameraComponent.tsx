/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
'use client';
import { useEffect, useRef, useState } from 'react';
import { base64ToFile } from '../helpers/convert.helper';
import { UserData } from '../types/user.types';
import Pusher from 'pusher-js';
import { ActionControl } from '../app/remote-control/page';

type Props = {
  onData: (userData: Partial<UserData>) => void;
};

let intervalId: NodeJS.Timeout | undefined;
export const DEFAULT_TIME = 5;

type FaceDetectionApiResult = {
  face_detected: number;
  one_face: boolean;
  is_smiling: boolean;
  contrast_is_good: boolean;
  brightness_is_good: boolean;
  face_is_centralized: boolean;
  closed_eyes: boolean;
  face_foward: boolean;
  straigh_head: boolean;
};

const requirements = [
  { texto: 'Deve haver apenas uma face detectada.', name: 'one_face' },
  // { texto: 'Os olhos devem estar abertos.', name: 'closed_eyes' },
  { texto: 'A cabeça deve estar voltada para frente.', name: 'face_foward' },
  // { texto: 'A cabeça deve estar reta.', name: 'straigh_head' },
  { texto: 'A pessoa não deve estar sorrindo.', name: 'is_smiling' },
];

const CameraComponent = ({ onData }: Props) => {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [timerActive, setTimerActive] = useState(false);
  const [timer, setTimer] = useState(DEFAULT_TIME);
  const [loading, setLoading] = useState(false);
  const [cameraLoading, setCameraLoading] = useState(false);

  const [apiResult, setApiResult] = useState<FaceDetectionApiResult | null>(null);

  const beepAudio = new Audio('./audio/short-beep.mp3');
  const clickAudio = new Audio('./audio/camera-click.mp3');
  // const inicioCamera = new Audio('./audio/steps/tirar foto.mp3');

  // const duasPessoas = new Audio('./audio/steps/duaspessoas.mp3');
  // const lateral = new Audio('./audio/steps/lateral.mp3');
  // const sorriso = new Audio('./audio/steps/sorriso.mp3');
  // const fimFoto = new Audio('./audio/steps/fimfoto.mp3');

  // useEffect(() => {
  //   setTimeout(() => {
  //     inicioCamera.play();
  //   }, 1000);
  // }, []);

  useEffect(() => {
    const pusher = new Pusher(process.env.NEXT_PUBLIC_KEY_PUSHER || '', {
      cluster: 'us2',
    });

    const channel = pusher.subscribe('poc-channel');

    channel.bind('control', (data: { action: ActionControl }) => {
      if (data.action == 'take-photo') {
        startTimer();
      }

      if (data.action == 'new-photo') {
        retakePhoto();
      }
    });

    return () => {
      pusher.unsubscribe('poc-channel');
    };
  }, []);

  const startCamera = async () => {
    try {
      setCameraLoading(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          aspectRatio: 4 / 3,
        },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraLoading(false);
    } catch (err) {
      console.error('Erro ao acessar a câmera:', err);
    }
  };

  useEffect(() => {
    startCamera();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        const tracks = stream.getTracks();
        tracks.forEach((track: MediaStreamTrack) => track.stop());
      }

      clearInterval(intervalId);
    };
  }, []);

  const startTimer = () => {
    setTimerActive(true);
    beepAudio.play();
    intervalId = setInterval(() => {
      setTimer((old) => --old);
    }, 1000);
  };

  useEffect(() => {
    if (timer == 0) {
      try {
        setTimerActive(false);
        captureImage();
        clearInterval(intervalId);
        setTimer(DEFAULT_TIME);
      } catch (error) {
        console.log(error);
      }
    } else {
      if (timerActive) {
        beepAudio.play();
      }
    }
  }, [timer]);

  const captureImage = () => {
    const video = videoRef.current;
    if (!video) return;

    clickAudio.play();
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext('2d');
    if (!context) return;

    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageData = canvas.toDataURL('image/png');
    setCapturedImage(imageData);
    avaliarImagem(imageData);
    onData({
      photo: imageData,
    });

    // const stream = video.srcObject as MediaStream;
    // if (stream) {
    //   const tracks = stream.getTracks();
    //   tracks.forEach((track: MediaStreamTrack) => track.stop());
    // }
  };

  const retakePhoto = () => {
    setApiResult(null);
    setCapturedImage(null);
    startCamera();
  };

  // const confirmPhoto = () => {
  //   if (capturedImage) {
  //     onData({
  //       photo: capturedImage,
  //     });
  //   }
  // };

  const avaliarImagem = async (capturedImage: string) => {
    setLoading(true);
    if (!capturedImage) return;

    try {
      const file = base64ToFile(capturedImage, 'image.png', 'image/png');
      const formData = new FormData();
      formData.append('file', file, 'image.jpg');

      const result: FaceDetectionApiResult = await fetch(
        'https://facedetection.cabineimersiva.inovvati.com.br/detectar',
        {
          method: 'POST',
          body: formData,
        },
      ).then((response) => response.json());

      if ((result as any).message) {
        // inicioCamera.play();
        setApiResult(null);
      } else {
        setApiResult(result);
        responseAudioProcessing(result);
      }

      console.log('Resultado api', result);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const responseAudioProcessing = (result: FaceDetectionApiResult) => {
    if (result.one_face == false) {
      // duasPessoas.play();
      return;
    }

    if (result.face_foward == false) {
      // lateral.play();
      return;
    }

    if (result.is_smiling == true) {
      // sorriso.play();
      return;
    }

    setTimeout(() => {
      // fimFoto.play();
    }, 1000);
  };

  const checkRequirement = (key: string) => {
    if (!apiResult) return;

    const keyValidate = key as keyof FaceDetectionApiResult;

    switch (keyValidate) {
      case 'closed_eyes':
      case 'is_smiling':
        return !apiResult[keyValidate];
      default:
        return apiResult[keyValidate];
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-row gap-10">
        {!capturedImage ? (
          <div className="w-[630px] h-[474px] overflow-hidden bg-black rounded-md relative">
            <video ref={videoRef} autoPlay playsInline className="w-full h-full rounded-md"></video>
            {cameraLoading && (
              <div className="absolute top-0 right-0 left-0 bottom-0 flex items-center justify-center bg-white/75">
                <span className="animate-fade-in-out text-fluid-lg uppercase font-bold text-gray-600">
                  Conectando a câmera...
                </span>
              </div>
            )}
          </div>
        ) : (
          <div className="w-[630px] h-[474px] relative">
            <img src={capturedImage} alt="Capturado" className="w-full h-full rounded-md" />

            {loading && (
              <div className="absolute top-0 right-0 left-0 bottom-0 flex items-center justify-center bg-white/75">
                <span className="animate-fade-in-out text-fluid-lg uppercase font-bold text-gray-600">
                  Analisando imagem...
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {timerActive && (
        <div className="uppercase text-primary-text mt-5">
          <p className=" text-primary-text text-fluid-lg font-bold">Olhe para a camera</p>
          <p className="block text-fluid-4xl font-bold">{timer}</p>
        </div>
      )}

      {/* <input type="file" name="" id="" onChange={handleChangeFile} /> */}

      {/* {!capturedImage && !timerActive && (
        <div className="mt-10 text-fluid-xl">
          <button
            className="px-6 py-4 bg-primary text-white rounded font-semibold uppercase"
            onClick={startTimer}
          >
            Tirar foto
          </button>
        </div>
      )} */}

      <div className="text-start flex flex-col gap-2 justify-center mt-10">
        {requirements.map((requirement, index) => (
          <div
            key={index}
            className={`text-fluid-xl font-semibold mb-2
              
              ${
                apiResult === null
                  ? 'text-gray-600'
                  : checkRequirement(requirement.name)
                  ? 'text-green-500'
                  : 'text-red-500'
              }`}
          >
            {requirement.texto}
          </div>
        ))}
      </div>

      {/* {capturedImage && (
        <div className="flex flex-row justify-center space-x-4 mt-10 text-fluid-xl">
          <button
            className="px-6 py-4 bg-primary-text text-white rounded font-semibold uppercase"
            onClick={retakePhoto}
          >
            Tirar outra
          </button>
          <button
            className="px-6 py-4 bg-primary text-white rounded font-semibold uppercase"
            onClick={confirmPhoto}
          >
            Confirmar
          </button>
        </div>
      )} */}

      <div className="py-12"></div>
    </div>
  );
};

export default CameraComponent;
