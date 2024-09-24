import React, { useState, useEffect } from 'react';
import { FaHeart, FaComment, FaDownload, FaEllipsisH, FaArrowLeft } from 'react-icons/fa';
import axios from 'axios';

const MediaModal = ({
  selectedMedia,
  closeModal,
  handleLikeToggle,
  toggleComments,
  likes,
  comments,
  showComments,
  setComments,
  isAdmin,
  guestDownloadOption,
  guestComments,
}) => {
  const [newComment, setNewComment] = useState('');
  const smileys = ['😊', '😍', '😂', '😎', '👍']; // Preset smileys
  const [likeCount, setLikeCount] = useState(selectedMedia.likes.length);

  // Handle like toggle with backend
  const handleLikeClick = async (mediaId) => {
    try {
      const response = await axios.post(`http://localhost:5000/api/like/${mediaId}`, {
        userId: isAdmin ? user._id : null,
        guestSession: !isAdmin ? guestSession : null,
      });
      setLikeCount(response.data.likeCount); // Update like count with response from server
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  // Handle comment submission
  const handleCommentSubmit = () => {
    if (newComment.trim()) {
      setComments((prev) => ({
        ...prev,
        [selectedMedia._id]: [...(comments[selectedMedia._id] || []), newComment],
      }));
      setNewComment('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 backdrop-blur-md">
      <div className="relative w-full max-w-4xl p-4 bg-white rounded-lg shadow-lg flex flex-col">
        {/* Back Arrow */}
        <button onClick={closeModal} className="absolute top-2 left-2 p-2 bg-black rounded-full text-white">
          <FaArrowLeft />
        </button>

        {/* Fullscreen Media Display */}
        <div className="w-full h-auto max-h-[70vh] overflow-hidden">
          {selectedMedia.mediaUrl.endsWith('.mp4') ? (
            <video className="w-full h-auto max-h-[70vh] object-cover" controls autoPlay>
              <source src={selectedMedia.mediaUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ) : (
            <img
              src={selectedMedia.mediaUrl}
              alt={selectedMedia.title}
              className="w-full h-auto max-h-[70vh] object-cover"
            />
          )}
        </div>

        {/* Interaction Buttons */}
        <div className="absolute right-4 top-[50%] transform -translate-y-[50%] flex flex-col space-y-4 items-center">
          <button onClick={() => handleLikeClick(selectedMedia._id)}>
            <FaHeart className={likeCount > 0 ? 'text-red-500' : 'text-white'} size={24} />
            <span className="text-white">{likeCount}</span>
          </button>

          {/* Comment Button: Only show if Guestcomments is true */}
          {guestComments && (
            <button onClick={toggleComments}>
              <FaComment className="text-white" size={24} />
              <span className="text-white">{comments[selectedMedia._id] ? comments[selectedMedia._id].length : 0}</span>
            </button>
          )}

          {/* Download Button: Only show if GuestDownloadOption is true */}
          {guestDownloadOption && (
            <button>
              <FaDownload className="text-white" size={24} />
            </button>
          )}

          {/* Admin Options */}
          {isAdmin && (
            <button>
              <FaEllipsisH className="text-white" size={24} />
            </button>
          )}
        </div>

        {/* Uploader Information and Greeting Message */}
        <div className="mt-4 px-4">
          <p className="text-gray-800">
            von <strong>{selectedMedia.uploader || 'Veranstalter'}</strong>
          </p>
          {selectedMedia.greeting && <p className="text-gray-500">{selectedMedia.greeting}</p>}
          <p className="text-gray-300">{new Date(selectedMedia.uploadDate).toLocaleDateString()}</p>
        </div>

        {/* Comments Section */}
        {showComments && (
          <div className="mt-4 px-4">
            <div className="text-sm text-gray-600">Comments:</div>
            <ul className="list-disc list-inside">
              {(comments[selectedMedia._id] || []).map((comment, idx) => (
                <li key={idx} className="flex items-center">
                  {comment} <FaHeart className="ml-2 text-gray-500" size={12} />
                </li>
              ))}
            </ul>

            {/* Comment Input with Smileys */}
            <div className="flex items-center mt-2">
              <input
                type="text"
                placeholder="Add a comment..."
                className="border p-2 w-full"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <button onClick={handleCommentSubmit} className="ml-2 text-blue-500">
                Enter
              </button>
            </div>

            {/* Smileys Preset */}
            <div className="flex space-x-2 mt-2">
              {smileys.map((smiley) => (
                <span
                  key={smiley}
                  className="cursor-pointer text-xl"
                  onClick={() => setNewComment((prev) => prev + smiley)}
                >
                  {smiley}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MediaModal;
