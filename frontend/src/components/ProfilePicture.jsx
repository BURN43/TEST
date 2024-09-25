import React from 'react';
import { FaPlus } from 'react-icons/fa';

const ProfilePicture = ({ profilePic, isAdmin, handleProfilePicUpload }) => {
  return (
    <div className="relative w-40 h-40 mx-auto mb-6">
      {profilePic ? (
        <div className="relative">
          <img
            src={profilePic}
            className="w-40 h-40 rounded-full object-cover object-center border-4 border-white shadow-lg"
            alt="Profile"
          />
          {isAdmin && (
            <div className="absolute inset-0 flex items-center justify-center bg-purple-200 bg-opacity-75 rounded-full opacity-0 hover:opacity-100 transition-opacity duration-300">
              <span className="text-purple-600 text-sm">Profilbild ändern</span>
              <input
                type="file"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={handleProfilePicUpload}
              />
            </div>
          )}
        </div>
      ) : (
        isAdmin && (
          <label className="relative flex flex-col items-center justify-center w-full cursor-pointer aspect-square bg-purple-200 rounded-full border-2 border-dashed border-purple-600">
            <input
              type="file"
              className="absolute z-10 w-full h-full opacity-0 cursor-pointer"
              onChange={handleProfilePicUpload}
            />
            <FaPlus className="text-3xl text-purple-600" />
            <div className="mt-1 text-xs text-purple-600">Profilbild hinzufügen</div>
          </label>
        )
      )}
    </div>
  );
};

export default ProfilePicture;
