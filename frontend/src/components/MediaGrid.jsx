import React, { useState, useEffect } from 'react';
import { FaPlus } from 'react-icons/fa';
import { motion } from 'framer-motion';
import axios from 'axios';
import FileValidation from './FileValidation'; // Import FileValidation component


const spinnerStyles = {
  border: '4px solid rgba(255, 255, 255, 0.3)',
  borderLeftColor: '#ffffff',
  borderRadius: '50%',
  width: '40px',
  height: '40px',
  animation: 'spin 1s linear infinite',
};




const MediaGrid = ({ media, handleFileUpload, openModal, loading, isAdmin, userId, albumId }) => {
  const [guestUploadsImage, setGuestUploadsImage] = useState(false);
  const [guestUploadsVideo, setGuestUploadsVideo] = useState(false);
 



  // Fetch settings from backend
// Fetch settings from backend
useEffect(() => {

  const fetchSettings = async () => {
    try {
      if (userId && albumId) { // Ensure both userId and albumId exist
        const response = await axios.get(`http://localhost:5000/api/settings/${albumId}/${userId}`);
        const settingsData = response.data;

        // Set the state for guest uploads
        setGuestUploadsImage(settingsData.GuestUploadsImage);
        setGuestUploadsVideo(settingsData.GuestUploadsVideo);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  fetchSettings();
}, [userId, albumId]);


  // Render media (Images/Videos)
  const renderMedia = (mediaItem) => {
    const baseURL = 'http://localhost:5000';
    const fullURL = mediaItem.mediaUrl.startsWith('/uploads/') ? `${baseURL}${mediaItem.mediaUrl}` : mediaItem.mediaUrl;
    const isVideo = fullURL.endsWith('.mp4') || fullURL.endsWith('.webm') || fullURL.endsWith('.avi');

    return (
      <motion.div
        key={mediaItem._id || mediaItem.id}
        className="relative w-full cursor-pointer aspect-square bg-gray-800 rounded-lg"
        onClick={() => openModal(mediaItem)}
      >
        {isVideo ? (
          <video className="w-full h-full object-cover" controls>
            <source src={fullURL} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : (
          <img
            loading="lazy"
            src={fullURL}
            alt={mediaItem.title || 'Media'}
            className="w-full h-full rounded-lg object-cover object-center"
          />
        )}
      </motion.div>
    );
  };

  return (
    <div className="grid grid-cols-3 gap-1 md:grid-cols-6 h-fit">
      {/* Media Upload Section for Images */}
      {(isAdmin || guestUploadsImage) && (
        <div className="relative flex flex-col items-center justify-center w-full cursor-pointer aspect-square bg-purple-200 rounded-lg border-2 border-dashed border-purple-600">
          <FileValidation
            handleFileUpload={handleFileUpload}
            maxImageSizeMB={5}  // Set max size for images (5MB)
            maxVideoSizeMB={50} // Set max size for videos (50MB)
          />
          {loading && <div style={spinnerStyles} className="spinner" />}
        </div>
      )}

      {/* Media Upload Section for Videos */}
      {(isAdmin || guestUploadsVideo) && (
        <div className="relative flex flex-col items-center justify-center w-full cursor-pointer aspect-square bg-purple-200 rounded-lg border-2 border-dashed border-purple-600">
          <FileValidation
            handleFileUpload={handleFileUpload}
            maxImageSizeMB={5}  // Set max size for images (5MB)
            maxVideoSizeMB={50} // Set max size for videos (50MB)
          />
          {loading && <div style={spinnerStyles} className="spinner" />}
        </div>
      )}

      {/* Render Media Items */}
      {media.map((mediaItem) => renderMedia(mediaItem))}
    </div>
  );
};

export default MediaGrid;
