import React, { useState, useEffect, useCallback } from 'react';
import { FaPlus } from 'react-icons/fa';
import { motion } from 'framer-motion';
import axios from 'axios';
import FileValidation from './FileValidation'; // Import FileValidation component

const LazyLoadMediaGrid = ({ media, handleFileUpload, openModal, loading, loadMoreMedia, isAdmin, albumId, userId }) => {
  const [itemsToShow, setItemsToShow] = useState(12); // Initial media items to load
  const [isFetching, setIsFetching] = useState(false);
  const [guestUploadsImage, setGuestUploadsImage] = useState(false);
  const [guestUploadsVideo, setGuestUploadsVideo] = useState(false);

  // Fetch guest upload settings from backend
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


  // Scroll to load more media
  const handleScroll = useCallback(() => {
    if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight || isFetching) {
      return;
    }
    setIsFetching(true);
  }, [isFetching]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    if (!isFetching) return;
    loadMoreMedia(itemsToShow);
    setItemsToShow((prev) => prev + 12); // Load more items per scroll
    setIsFetching(false);
  }, [isFetching, itemsToShow, loadMoreMedia]);

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

      {/* Render visible media items */}
      {media.slice(0, itemsToShow).map((mediaItem) => renderMedia(mediaItem))}

      {/* Loading more media spinner */}
      {isFetching && (
        <div className="flex justify-center items-center col-span-full">
          <div style={spinnerStyles} className="spinner" />
        </div>
      )}
    </div>
  );
};

export default LazyLoadMediaGrid;
