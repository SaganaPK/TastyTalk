import React, { useState } from 'react';
import './PostTastySnap.css';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';

const PostTastySnap = ({ onClose }) => {
  const { currentUser } = useAuth();
  const [step, setStep] = useState(1);
  const [image, setImage] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const handleOverlayClick = (e) => {
  console.log('Overlay clicked', e.target.classList);
  if (e.target.classList.contains('post-modal-overlay')) {
    console.log('Calling onClose',onClose);
    onClose?.();
  }
};

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
      setStep(2);
    };
    reader.readAsDataURL(file);
  };

  const handlePost = async () => {
    if (!title || !image) {
      setError('Title and image are required');
      return;
    }

    try {
      await addDoc(collection(db, 'recipes'), {
        title: title.trim(),
        description: description.trim(),
        imageUrl: image,
        authorId: currentUser.uid,
        authorUsername: currentUser.username || 'Unknown',
        isAI: false,
        createdAt: serverTimestamp(),
        likes: [],
        comments: [],
      });

      onClose?.();
    } catch (err) {
      console.error('Error posting recipe:', err);
      setError('Something went wrong');
    }
  };

  return (
    <div className="post-modal-overlay" onClick={handleOverlayClick}>
      <div className="post-modal" onClick={(e) => e.stopPropagation()}>
        <button className="post-close"   onClick={() => onClose?.()}>×</button>


        {step === 1 && (
          <>
            <h3>Select an Image 📸</h3>
            <label htmlFor="imageUpload" className="upload-btn">Choose File</label>
            <input
              id="imageUpload"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: 'none' }}
            />
          </>
        )}

        {step === 2 && (
          <>
            <div className="modal-header">
              <button className="back-btn" onClick={() => setStep(1)}>←</button>
              <h3>Write About Your Dish ✍️</h3>
            </div>
            {image && <img src={image} alt="preview" className="preview-img" />}
            <input
              type="text"
              placeholder="Dish Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            {error && <p className="error">{error}</p>}
            <button className="post-btn" onClick={handlePost}>Post 🚀</button>
          </>
        )}
      </div>
    </div>
  );
};

export default PostTastySnap;
