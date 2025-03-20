import Pusher from 'pusher';

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID || '',
  key: process.env.PUSHER_KEY || '',
  secret: process.env.PUSHER_SECRET || '',
  cluster: process.env.PUSHER_CLUSTER || '',
  useTLS: true,
});
// nada 
export async function POST(req: Request) {
  const eventData = await req.json();
  let response;
  if (eventData.type == 'control') {
    response = await pusher.trigger('poc-channel', 'control', {
      ...eventData,
    });

    console.log(response.status);
  } else {
    response = await pusher.trigger('poc-channel', 'login', {
      ...eventData,
    });
  }
  console.log(response.status);

  return Response.json({ message: 'completed' });
}
