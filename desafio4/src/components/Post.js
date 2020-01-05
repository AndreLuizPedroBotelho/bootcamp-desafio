import React from "react";
import "./Post.css";
import Comment from "./Comment";

function Post({ data }) {
  return (
    <div className="post">
      <img src={data.author.avatar} />
      <h4>{data.author.name}</h4>
      <h5 className="post-date">{data.date}</h5>
      <br />
      <hr />

      <p>{data.content}</p>
      <hr />
      {data.comments.map(comment => (
        <div className="comment-list">
          <Comment key={comment.id} data={comment} />
        </div>
      ))}
    </div>
  );
}

export default Post;
