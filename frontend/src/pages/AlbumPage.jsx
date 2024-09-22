import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import axios from 'axios';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import { FaTrashAlt, FaDownload, FaPlus, FaEdit, FaTimes, FaHeart, FaCommentDots, FaEllipsisH, FaArrowLeft } from 'react-icons/fa';

// Spinner CSS (füge es in deinen globalen CSS-File oder JSX ein)
const spinnerStyles = {
  border: '4px solid rgba(255, 255, 255, 0.3)', // Light border
  borderLeftColor: '#ffffff', // White spinner
  borderRadius: '50%',
  width: '40px',
  height: '40px',
  animation: 'spin 1s linear infinite',
};

const AlbumPage = () => {
  const { user } = useAuthStore();
  const userId = user ? user._id : null;

  const [title, setTitle] = useState('');
  const [greetingText, setGreetingText] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [profilePic, setProfilePic] = useState(null);


    // Fetch album settings including title, greeting, event date, and time
    useEffect(() => {
      const fetchAlbumSettings = async () => {
        try {
          if (userId) {
            const response = await axios.get(`http://localhost:5000/api/settings/${userId}`);
            const settingsData = response.data;
            
            setTitle(settingsData.albumTitle || '');
            setGreetingText(settingsData.greetingText || '');

            if (settingsData.eventDate) {
              const formattedDate = new Date(settingsData.eventDate).toISOString().slice(0, 10);
              setEventDate(formattedDate);
            }
            if (settingsData.eventTime) {
              setEventTime(settingsData.eventTime);
            }
          }
        } catch (error) {
          console.error('Error fetching settings:', error);
        }
      };

      fetchAlbumSettings();
    }, [userId]);

  const openModal = (photo) => {
    setSelectedPhoto(photo);
    setConfirmDelete(false);
  };

  const closeModal = () => {
    setSelectedPhoto(null);
    setShowOptions(false); // Ensure options are hidden when closing
  };

  const deletePhoto = (id) => {
    setPhotos(photos.filter((photo) => photo.id !== id));
    closeModal();
  };

  const downloadPhoto = (url) => {
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'photo.jpg');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleAddPhoto = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLoading(true); // Ladezustand auf true setzen
      const newId = photos.length + 1;
      const newPhoto = {
        id: newId,
        url: URL.createObjectURL(file),
        title: `Photo ${newId}`,
      };
      setTimeout(() => {
        setPhotos([newPhoto, ...photos]);
        setLoading(false); // Ladezustand auf false setzen
      }, 2000); // Beispiel: 2 Sekunden Verzögerung
    }
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(URL.createObjectURL(file));
    }
  };

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="p-4 md:p-8 pb-20"
      >
        {/* Profilbild, Titel und Greeting Text */}
        <div className="text-center max-w-2xl mx-auto mb-8 mt-10">
          <div className="relative w-32 h-32 mx-auto mb-6">
            {/* Profilbild hinzufügen Tile */}
            {profilePic ? (
              <img
                src={profilePic}
                className="w-32 h-32 rounded-full object-cover border-4 border-white"
              />
            ) : (
              <label className="relative flex flex-col items-center justify-center w-full cursor-pointer aspect-square bg-purple-200 rounded-full border-2 border-dashed border-purple-600">
                <input
                  type="file"
                  className="absolute z-10 w-full h-full opacity-0 cursor-pointer"
                  onChange={handleProfilePicChange}
                />
                <FaPlus className="text-3xl text-purple-600" />
                <div className="mt-1 text-xs text-purple-600">Profilbild hinzufügen</div>
              </label>
            )}
          </div>

          <h1 className="text-4xl font-extrabold mb-2 text-gradient bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text uppercase">
            {title ? title : ''}
          </h1>
          <p className="text-lg text-purple-400">  {greetingText ? greetingText : 'Willkommen zu unserem Event!'}
          </p>
        </div>

        {/* Restlicher Code */}
        {/* Grid Layout für Bilder */}
        <div className="grid grid-cols-3 gap-1 md:grid-cols-6 h-fit">
          {/* Foto hinzufügen Tile */}
          <label className="relative flex flex-col items-center justify-center w-full cursor-pointer aspect-square bg-purple-200 rounded-lg border-2 border-dashed border-purple-600">
            <input
              type="file"
              accept="image/*"
              className="absolute z-10 w-full h-full opacity-0 cursor-pointer"
              onChange={handleAddPhoto}
            />
            {loading ? (
              <div style={spinnerStyles} className="spinner" />
            ) : (
              <>
                <FaPlus className="text-5xl text-purple-600" />
                <div className="mt-1 text-xs text-purple-600">Bilder hinzufügen</div>
              </>
            )}
          </label>

          {/* Vorhandene Bilder */}
          {photos.map((photo) => (
            <motion.div
              key={photo.id}
              className="relative w-full cursor-pointer aspect-square bg-gray-800 rounded-lg"
              whileHover={{ scale: 1.01 }}
              onClick={() => openModal(photo)}
            >
              <img
                loading="lazy"
                src={photo.url}
                alt={photo.title}
                className="w-full h-full object-cover"
              />
            </motion.div>
          ))}
        </div>

        {/* Modal etc. */}
      </motion.div>
    </Layout>
  );
};

export default AlbumPage;
