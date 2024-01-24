import React, { useEffect, useRef, useState } from "react";
import Client from "../components/Client";
import Editor from "../components/Editor";
import { initSocket } from "../socket";
import { ACTIONS } from "../Actions";
import { useLocation } from "react-router-dom";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

export default function EditorPage() {
  const [client, setClient] = useState([]);
  const { roomId } = useParams();
  const socketRef = useRef();
  const location = useLocation();
  console.log(roomId);
  useEffect(() => {
    const init = async () => {
      socketRef.current = await initSocket();
      socketRef.current.emit(ACTIONS.JOIN, {
        roomId,
        username: location.state?.username,
      });

      socketRef.current.on(
        ACTIONS.JOINED,
        ({ clients, username, socketId }) => {
          if (username !== location.state?.username) {
            toast.success(`${username} joined the room`);
            console.log(`${username} joined the room`);
          }
          setClient(clients);
        }
      );

      socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, username }) => {
        toast.success(`${username} left the room`);
        setClient((prev) => {
          return prev.filter((client) => client.socketId !== socketId);
        });
      });
    };
    init();
    return () => {
      socketRef.current.disconnect();
      socketRef.current.off(ACTIONS.JOINED);
      socketRef.current.off(ACTIONS.DISCONNECTED);
    };
  }, []);

  function leaveRoom() {
    socketRef.current.emit(ACTIONS.LEAVE_ROOM, {
      roomId,
      username: location.state.username,
    });
    reactNavigator("/");
    setTimeout(() => {
      window.location.reload();
    }, 100);
  }

  async function copyRoomId() {
    try {
      await navigator.clipboard.writeText(roomId);
      toast.success("Room ID copied to clipboard");
    } catch (error) {
      toast.error("Failed to copy room ID");
    }
  }

  return (
    <div className="h-screen flex flex-row">
      <div className="border w-1/5 flex flex-col h-full">
        <div className="flex flex-col pl-5 mt-10 gap-4">
          <strong>Connected</strong>
          {client.map((client) => (
            <Client username={client.username.username} key={client.socketId} />
          ))}
        </div>
        <div className="flex flex-col gap-4 px-4 mt-auto mb-5">
          <button className="border p-3 rounded-lg" onClick={copyRoomId}>
            Copy Room Id
          </button>
          <button className="border p-3 rounded-lg" onClick={leaveRoom}>
            Leave
          </button>
        </div>
      </div>
      <div className="">
        <Editor socketRef={socketRef} roomId={roomId} />
      </div>
    </div>
  );
}
