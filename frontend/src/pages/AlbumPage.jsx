import React, { useState } from 'react';
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
  const [photos, setPhotos] = useState([
    { id: 1, url: 'https://d2m3d02laxv2t.cloudfront.net/bf3d3b05-4aed-46f0-b18f-b856371bf847/assets/img/demo_images/preset5thumbnail.png', title: 'Photo 1', likes: 0, liked: false, comments: [] },
    { id: 2, url: 'https://d2m3d02laxv2t.cloudfront.net/bf3d3b05-4aed-46f0-b18f-b856371bf847/assets/img/demo_images/preset4thumbnail.png', title: 'Photo 2', likes: 0, liked: false, comments: [] },
  ]);

  const [loading, setLoading] = useState(false); // Ladezustand
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [profilePic, setProfilePic] = useState(null);
  const [title, setTitle] = useState('SEMRA & BURHAN');
  const [greetingText, setGreetingText] = useState('Willkommen auf meiner Hochzeit!');
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [showOptions, setShowOptions] = useState(false); // For "Mehr Optionen"

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
      // Simuliere eine Verzögerung für den Upload
      setTimeout(() => {
        setPhotos([newPhoto, ...photos]);
        setLoading(false); // Ladezustand auf false setzen, sobald der Upload abgeschlossen ist
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

          <h1 className="text-4xl font-extrabold mb-2 text-gradient bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">
            {title}
          </h1>
          <p className="text-lg text-purple-400">{greetingText}</p>
        </div>

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

        {selectedPhoto && (
  <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-[9999]">
    <div className="relative bg-gray-800 p-4 rounded-lg shadow-lg w-full max-w-6xl h-auto mx-4 sm:mx-8 lg:mx-16 xl:mx-24">
      {/* Close Button */}
      <div className="absolute top-4 left-4">
        <button onClick={closeModal} className="text-white text-3xl">
          <FaArrowLeft />
        </button>
      </div>

      {/* Image */}
      <div className="flex justify-center">
        <img
          src={selectedPhoto.url}
          alt={selectedPhoto.title}
          className="w-full h-auto max-h-[70vh] object-contain"
        />
      </div>

      {/* Tooltips for functions */}
      <div className="absolute right-10 bottom-12 space-y-4 flex flex-col items-center mb-10">
        {/* Like Button */}
        <button className="text-white text-2xl">
          <FaHeart />
        </button>
        <p className="text-white text-sm">0</p>

        {/* Comment Button */}
        <button className="text-white text-2xl">
          <FaCommentDots />
        </button>
        <p className="text-white text-sm">0</p>

        {/* Download Button */}
        <button
          onClick={() => downloadPhoto(selectedPhoto.url)}
          className="text-white text-2xl"
          title="Download"
        >
          <FaDownload />
        </button>

        {/* More Options Button */}
        <button className="text-white text-2xl" title="Mehr Optionen">
          <FaEllipsisH />
        </button>
      </div>

      {/* Image Description */}
      <div className="mt-4 text-center text-sm text-white">
        <p>von Veranstalter</p>
        <p>19.09.2024, 19:08</p>
      </div>

      {/* Confirm Delete Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-[10000]">
          <div className="bg-white p-4 rounded shadow-lg">
            <p className="text-gray-800">Bist du sicher?</p>
            <div className="flex items-center">
              <button
                onClick={() => deletePhoto(selectedPhoto.id)}
                className="bg-red-500 hover:bg-red-600 text-white py-1 px-2 rounded mr-2"
              >
                Ja, löschen
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                className="bg-gray-500 hover:bg-gray-600 text-white py-1 px-2 rounded"
              >
                Abbrechen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  </div>
)}


      </motion.div>
    </Layout>
  );
};

export default AlbumPage;
