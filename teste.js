const getallChannelDatabase = require('./database');

while (true) {

 getallChannelDatabase.forEach(async element => {
  console.log(element.channel_name, 'channel_name')
  const queue = await getQueueChannel(element.channel_name);
  console.log(queue, 'queueAtual');
  
  const newQueues = queue.map(async el => {
    const getUser = await getUserId(el['getUser'][0].users_id);
    return el = getUser;
  })

  await setQueueInChannel(element.channel_name);

 });
}


