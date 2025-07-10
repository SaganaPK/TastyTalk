import React, { useState } from 'react';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../contexts/AuthContext';
import './CommentSection.css';

const CommentSection = ({ recipe, setRecipes }) => {
  const { currentUser } = useAuth();
  const [commentText, setCommentText] = useState('');

  // 🔥 Helper function to calculate "time ago"
  const timeAgo = (timestamp) => {
    if (!timestamp) return "";
    const now = new Date();
    const commentTime = new Date(timestamp);
    const secondsAgo = Math.floor((now - commentTime) / 1000);

    if (secondsAgo < 60) return `${secondsAgo}s ago`;
    const minutesAgo = Math.floor(secondsAgo / 60);
    if (minutesAgo < 60) return `${minutesAgo}m ago`;
    const hoursAgo = Math.floor(minutesAgo / 60);
    if (hoursAgo < 24) return `${hoursAgo}h ago`;
    const daysAgo = Math.floor(hoursAgo / 24);
    if (daysAgo < 7) return `${daysAgo}d ago`;
    const weeksAgo = Math.floor(daysAgo / 7);
    if (weeksAgo < 4) return `${weeksAgo}w ago`;
    const monthsAgo = Math.floor(daysAgo / 30);
    if (monthsAgo < 12) return `${monthsAgo}m ago`;
    const yearsAgo = Math.floor(daysAgo / 365);
    return `${yearsAgo}y ago`;
  };

  const handleCommentSubmit = async () => {
    if (!currentUser || !commentText.trim()) return;

    const username = currentUser.username.charAt(0).toUpperCase() + currentUser.username.slice(1).toLowerCase() || 'Unknown';

    const newComment = {
      userName: username,
      text: commentText.trim(),
      createdAt: new Date().toISOString() // 🔥 Local timestamp
    };

    const collectionName = recipe.isAI ? 'AI-recipes' : 'recipes';
    const recipeRef = doc(db, collectionName, recipe.id)
    


    await updateDoc(recipeRef, {
      comments: arrayUnion(newComment),
    });

    setRecipes(prevRecipes =>
      prevRecipes.map(r =>
        r.id === recipe.id
          ? { ...r, comments: [...r.comments, newComment] }
          : r
      )
    );

    setCommentText('');
  };

  return (
    <>
      <div className="comment-section">
        <input
          type="text"
          placeholder="Write a comment..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          className="comment-input"
        />
        <button onClick={handleCommentSubmit} className="comment-button">
          Post
        </button>
      </div>

      {recipe.comments.length > 0 && (
  <div className="comments-list">
    {recipe.comments.map((comment, index) => (
      <div key={index} className="comment-item">
        <div>
          <b>{comment.userName}:</b> {comment.text}
        </div>
        <div className="comment-time">
          {comment.createdAt && timeAgo(comment.createdAt)}
        </div>
      </div>
    ))}
  </div>
)}

    </>
  );
};

export default CommentSection;
