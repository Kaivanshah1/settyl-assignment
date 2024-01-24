import React from "react";
import Avatar from "react-avatar";

export default function Client({ username }) {
  return (
    <div className="flex flex-col">
      <Avatar name={username} size={40} round="10px" />
      {username}
    </div>
  );
}
