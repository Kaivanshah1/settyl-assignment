import React, { useEffect, useRef } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { ACTIONS } from "../Actions";

export default function Editor({ socketRef, roomId }) {
  const editorRef = useRef(null);

  const handleChange = (instance, changes) => {
    console.log(instance);
    const code = instance;

    socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code }) => {
      console.log("code");
      if (code !== null) {
        editorRef.current = code;
      }
    });

    socketRef.current.emit(ACTIONS.CODE_CHANGE, {
      roomId,
      code,
    });
  };

  // useEffect(() => {
  //   if (socketRef.current) {

  //   }
  // }, [socketRef.current]);
  return (
    <div className="w-full">
      <CodeMirror
        onChange={handleChange}
        height="100vh"
        width="1100px"
        ref={editorRef}
      />
    </div>
  );
}
