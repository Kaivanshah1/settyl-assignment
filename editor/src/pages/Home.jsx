import React, { useState } from "react";
import { v4 as uuidV4 } from "uuid";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
export default function Home() {
  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const createNewRoom = (e) => {
    e.preventDefault();
    const id = uuidV4();
    setRoomId(id);
    console.log(id);
    toast.success("Room created successfully");
  };

  const joinRoom = (e) => {
    e.preventDefault();
    if (!roomId || !username) {
      toast.error("Please enter room id and username");
      return;
    }

    navigate(`/editor/${roomId}`, {
      state: {
        username,
        roomId,
      },
    });
  };
  return (
    <div>
      <h1 className="semi-bold text-3xl text-center my-10">Text Editor</h1>
      <div className="flex flex-col items-center">
        <form className="flex flex-col border max-w-lg mx-auto p-6 gap-4">
          <input
            type="text"
            placeholder="Enter room ID"
            value={roomId}
            onChange={(e) => {
              setRoomId(e.target.value);
            }}
            className="p-3 border rounded focus:outline-none"
          />
          <input
            type="username"
            placeholder="Enter username"
            className="p-3 border rounded focus:outline-none"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          />
          <button className="border" onClick={joinRoom}>
            Join
          </button>
          <p>
            If you don't have invite then create a{" "}
            <button onClick={createNewRoom}>new room</button>
          </p>
        </form>
      </div>
    </div>
  );
}
