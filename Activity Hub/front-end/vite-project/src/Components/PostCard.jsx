// components/PostCard.js
import React, { useState } from 'react';

const PostCard = ({ post, onUpdatePost }) => {
  const [isEditing, setEditing] = useState(false);
  const [updatedPost, setUpdatedPost] = useState({ ...post });

  const handleEditClick = () => {
    setEditing(true);
  };

  const handleCancelClick = () => {
    setEditing(false);
    setUpdatedPost({ ...post });
  };

  const handleUpdateClick = () => {
    // Perform the update action (you may want to send an API request here)
    onUpdatePost(updatedPost);
    setEditing(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedPost({
      ...updatedPost,
      [name]: value,
    });
  };

  return (
    <div className="post-card">
      <img src={post.image} alt={post.name} />

      {isEditing ? (
        <div>
          <label>
            Name:
            <input
              type="text"
              name="name"
              value={updatedPost.name}
              onChange={handleInputChange}
            />
          </label>

          <label>
            Image URL:
            <input
              type="text"
              name="image"
              value={updatedPost.image}
              onChange={handleInputChange}
            />
          </label>

          <label>
            Options:
            <select
              name="options"
              value={updatedPost.options}
              onChange={handleInputChange}
            >
              <option value="option1">Option 1</option>
              <option value="option2">Option 2</option>
              <option value="option3">Option 3</option>
            </select>
          </label>

          <button onClick={handleUpdateClick}>Update</button>
          <button onClick={handleCancelClick}>Cancel</button>
        </div>
      ) : (
        <div>
          <h3>{post.name}</h3>
          <p>Options: {post.options}</p>

          <button onClick={handleEditClick}>Edit</button>
        </div>
      )}
    </div>
  );
};

export default PostCard;
