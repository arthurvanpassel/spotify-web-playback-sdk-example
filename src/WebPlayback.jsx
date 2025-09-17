import React, { useState, useEffect } from "react";
import {
  skipToPrevious,
  getState,
  togglePlay,
  skipToNext,
  transferPlayback,
} from "./requests";

const user = {
  paused: true,
  active: false,
  track: {
    name: "",
    album: {
      images: [{ url: "" }],
    },
    artists: [{ name: "" }],
  },
};

function WebPlayback({ tokens }) {
  const [users, setUsers] = useState([user, user]);
  const [deviceId, setDeviceId] = useState("");

  const initializePlayer = (token, playerIndex) => {
    const player = new window.Spotify.Player({
      name: `Web Playback SDK ${playerIndex + 1}`,
      getOAuthToken: (cb) => {
        cb(token);
      },
      volume: 0.5,
    });

    console.log(`Player ${playerIndex + 1} created with token ${token}`);

    player.addListener("ready", ({ device_id }) => {
      console.log(`Player ${playerIndex + 1} ready with Device ID ${device_id}`);
      if (playerIndex === 0) initializePlayer(tokens[1], 1);
      setDeviceId(device_id);

      transferPlayback(device_id, token).then(() => {
        updateState(playerIndex);
      });
    });

    player.addListener("not_ready", ({ device_id }) => {
      console.log("Device ID has gone offline", device_id);
    });

    player.connect();
  };

  useEffect(() => {
    if (tokens.length === 2 && tokens.every((token) => token !== "")) {
      const script = document.createElement("script");
      script.src = "https://sdk.scdn.co/spotify-player.js";
      script.async = true;

      document.body.appendChild(script);

      window.onSpotifyWebPlaybackSDKReady = () => {
        initializePlayer(tokens[0], 0);
      };
    }
  }, [tokens]);

  const updateState = async (playerIndex) => {
    const state = await getState(tokens[playerIndex]);
    console.log("state", state);
    setUsers((users) => {
      const newUsers = [...users];
      newUsers[playerIndex] = { ...newUsers[playerIndex], ...(state ? { paused: !state.is_playing, track: state.item } : {}) };
      return newUsers;
    });
  };

  return (
    <div className="container">
      {users.map((user, i) => (
        <div className="main-wrapper" key={i}>
          <img
            src={user.track.album.images[0].url}
            className="now-playing__cover"
            alt=""
            onClick={() => transferPlayback(deviceId, tokens[i])}
          />

          <div className="now-playing__side">
            <div className="now-playing__name">{user.track.name}</div>
            <div className="now-playing__artist">
              {user.track.artists.map((artist) => artist.name).join(", ")}
            </div>

            <button
              className="btn-spotify"
              onClick={async () => {
                await skipToPrevious(deviceId, tokens[i]) && updateState(i);
              }}
            >
              &lt;&lt;
            </button>

            <button
              className="btn-spotify"
              onClick={async () => {
                await togglePlay(deviceId, tokens[i], user.paused) && setUsers((users) => {
                  const newUsers = [...users];
                  newUsers[i] = { ...newUsers[i], paused: !newUsers[i].paused };
                  return newUsers;
                });
              }}
            >
              {user.paused ? "PLAY" : "PAUSE"}
            </button>

            <button
              className="btn-spotify"
              onClick={async () => {
                await skipToNext(deviceId, tokens[i]) && updateState(i);
              }}
            >
              &gt;&gt;
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default WebPlayback;
