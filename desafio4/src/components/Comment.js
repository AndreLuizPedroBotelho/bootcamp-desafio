import React from "react";
import "./Comment.css";

function Comment({ data }) {
  return (
    <div className="comment">
      <img src={data.author.avatar} />
      <div className="comment-txt">
        <strong>{data.author.name}</strong> {data.content}
      </div>
      <br />
    </div>
  );
}

export default Comment;
