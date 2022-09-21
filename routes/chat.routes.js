const router = require("express").Router();
const fetch = require('node-fetch');

const API_KEY='647ceaae485594d586fe7e24807854488102a968f9268fe87d0776f864fcdbd5'

const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
    Authorization: "Bearer " + API_KEY,
}

const getRoom = (room) => {
    return fetch(`https://api.daily.co/v1/rooms/${room}`, {
      method: "GET",
      headers,
    })
    .then((res) => res.json())
    .then((json) => {return json})
    .catch((err) => console.error(err))
}

const createRoom = (room) => {
    return fetch("https://api.daily.co/v1/rooms", {
      method: "POST",
      headers,
      body: JSON.stringify({
        name: room,
        properties: {
          enable_screenshare: true,
          enable_chat: true,
          start_video_off: true,
          start_audio_off: false,
          lang: "en",
        },
      }),
    })
    .then((res) => res.json())
    .then((json) => {return json})
    .catch((err) => console.log(err))
}

router.get("/room/:id", async function (req, res) {
    const roomId = req.params.id
    const room = await getRoom(roomId)

    if (room.error) {
      const newRoom = await createRoom(roomId);
      res.status(200).send(newRoom)
    } else {
      res.status(200).send(room)
    }
});

module.exports = router;
