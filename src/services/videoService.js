import { ref, uploadBytes, getDownloadURL, listAll } from 'firebase/storage';
import { storage } from '../config/firebase';

// Upload a video file to Firebase Storage
export const uploadVideo = async (file, userId) => {
  try {
    const videoRef = ref(storage, `videos/${userId}/${file.name}`);
    const snapshot = await uploadBytes(videoRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading video:', error);
    throw error;
  }
};

// Get download URL for a specific video
export const getVideoURL = async (userId, fileName) => {
  try {
    const videoRef = ref(storage, `videos/${userId}/${fileName}`);
    return await getDownloadURL(videoRef);
  } catch (error) {
    console.error('Error getting video URL:', error);
    throw error;
  }
};

// List all videos for a user
export const listUserVideos = async (userId) => {
  try {
    const videosRef = ref(storage, `videos/${userId}`);
    const result = await listAll(videosRef);
    const urls = await Promise.all(
      result.items.map(async (item) => ({
        name: item.name,
        url: await getDownloadURL(item)
      }))
    );
    return urls;
  } catch (error) {
    console.error('Error listing videos:', error);
    throw error;
  }
};
