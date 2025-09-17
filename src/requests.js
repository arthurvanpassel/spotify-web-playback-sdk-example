const delayReturn = (delay) => {
  return new Promise(resolve => setTimeout(resolve, delay));
}

export const togglePlay = async (device_id, token, paused) => {
  if (paused) {
    return await play(device_id, token);
  } else {
    return await pause(device_id, token);
  }
}

export const play = async (device_id, token) => {
  const result = await fetch(`https://api.spotify.com/v1/me/player/play`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      device_id: device_id,
    }),
  })
  if (result.status !== 200 && result.status !== 204) {console.log(await result.text()); return false;}
  else return true;
}

export const pause = async (device_id, token) => {
  const result = await fetch(`https://api.spotify.com/v1/me/player/pause`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      device_id: device_id,
    }),
  })
  if (result.status !== 200 && result.status !== 204) {console.log(await result.text()); return false;}
  else return true;
}

export const skipToNext = async (device_id, token) => {
  const result = await fetch(`https://api.spotify.com/v1/me/player/next`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      device_id: device_id,
    }),
  })
  if (result.status !== 204 && result.status !== 200) {console.log(await result.text()); return false;}
  else return true;
}

export const skipToPrevious = async (device_id, token) => {
  const result = await fetch(`https://api.spotify.com/v1/me/player/previous`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      device_id: device_id,
    }),
  })
  if (result.status !== 204 && result.status !== 200) {console.log(await result.text()); return false;}
  else return true;
}

export const getState = async (token) => {
  await delayReturn(500);
  const result = await fetch(`https://api.spotify.com/v1/me/player`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  if (result.status !== 200 && result.status !== 204) {console.log(await result.text()); return null;}
  else {
    const text = await result.text();
    return JSON.parse(text);
  }
}

export const transferPlayback = async (device_id, token) => {
  const result = await fetch(`https://api.spotify.com/v1/me/player`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      device_ids: [device_id],
    }),
  })
  if (result.status !== 204 && result.status !== 200) {console.log(await result.text()); return false;}
  else return true;
}