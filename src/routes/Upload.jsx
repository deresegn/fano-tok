import { useState, useRef } from 'react';
import styled from 'styled-components';
import { FaCloudUploadAlt, FaSpinner } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import { uploadVideo } from '../services/videoService';

const UploadContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  margin-bottom: 2rem;
  text-align: center;
  color: #1a8cff;
`;

const UploadArea = styled.div`
  border: 2px dashed #1a8cff;
  border-radius: 12px;
  padding: 3rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
  background: ${({ isDragging }) => isDragging ? 'rgba(26, 140, 255, 0.1)' : 'transparent'};

  &:hover {
    background: rgba(26, 140, 255, 0.1);
  }
`;

const UploadIcon = styled(FaCloudUploadAlt)`
  font-size: 4rem;
  color: #1a8cff;
  margin-bottom: 1rem;
`;

const UploadText = styled.p`
  margin: 1rem 0;
  color: black;
`;

const FileInput = styled.input`
  display: none;
`;

const VideoPreview = styled.video`
  width: 100%;
  max-height: 400px;
  object-fit: contain;
  margin: 2rem 0;
  background: #f5f5f5;
  border-radius: 8px;
`;

const Form = styled.form`
  margin-top: 2rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.8rem;
  margin: 0.5rem 0;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 1rem;
  color: black;

  &:focus {
    outline: none;
    border-color: #1a8cff;
    box-shadow: 0 0 0 2px rgba(26, 140, 255, 0.1);
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.8rem;
  margin: 0.5rem 0;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;
  color: black;

  &:focus {
    outline: none;
    border-color: #1a8cff;
    box-shadow: 0 0 0 2px rgba(26, 140, 255, 0.1);
  }
`;

const Button = styled.button`
  background: #1a8cff;
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    background: #0066cc;
  }
`;

const SpinnerIcon = styled(FaSpinner)`
  animation: spin 1s linear infinite;
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 4px;
  background: #e0e0e0;
  border-radius: 2px;
  margin-top: 1rem;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: #1a8cff;
  width: ${({ progress }) => progress}%;
  transition: width 0.3s ease;
`;

const ErrorMessage = styled.div`
  color: #ff3333;
  margin-top: 1rem;
  padding: 0.5rem;
  border-radius: 4px;
  background: rgba(255, 51, 51, 0.1);
`;

const Upload = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [description, setDescription] = useState('');
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleFileSelect = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      if (selectedFile.type.startsWith('video/')) {
        setFile(selectedFile);
        setPreview(URL.createObjectURL(selectedFile));
        setError(null);
      } else {
        setError('Please select a video file.');
      }
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files[0];
    if (droppedFile) {
      if (droppedFile.type.startsWith('video/')) {
        setFile(droppedFile);
        setPreview(URL.createObjectURL(droppedFile));
        setError(null);
      } else {
        setError('Please drop a video file.');
      }
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file) {
      setError('Please select a video file.');
      return;
    }

    try {
      setUploading(true);
      setError(null);

      // Upload video to Firebase Storage
      const videoUrl = await uploadVideo(file, currentUser.uid);

      // Add video metadata to Firestore
      await addDoc(collection(db, 'videos'), {
        userId: currentUser.uid,
        userName: currentUser.displayName || 'Anonymous',
        userAvatar: currentUser.photoURL,
        description,
        videoUrl,
        fileName: file.name,
        timestamp: serverTimestamp(),
        likes: 0,
        views: 0
      });

      // Navigate to home page or video feed
      navigate('/');
    } catch (err) {
      console.error('Upload error:', err);
      setError('Failed to upload video. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <UploadContainer>
      <Title>Upload Video</Title>
      
      {!file ? (
        <UploadArea
          onDragEnter={(e) => e.preventDefault()}
          onDragLeave={(e) => e.preventDefault()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current.click()}
        >
          <UploadIcon />
          <UploadText>Drag and drop your video here or click to browse</UploadText>
          <UploadText>MP4 or WebM • Up to 30 minutes • Less than 2 GB</UploadText>
          <FileInput
            type="file"
            ref={fileInputRef}
            accept="video/*"
            onChange={handleFileSelect}
          />
        </UploadArea>
      ) : (
        <Form onSubmit={handleSubmit}>
          <VideoPreview src={preview} controls />
          
          <TextArea
            placeholder="Video description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          
          {uploading && (
            <ProgressBar>
              <ProgressFill progress={uploadProgress} />
            </ProgressBar>
          )}

          {error && <ErrorMessage>{error}</ErrorMessage>}
          
          <Button 
            type="submit" 
            disabled={uploading}
          >
            {uploading ? (
              <>
                <SpinnerIcon /> Uploading...
              </>
            ) : (
              'Upload Video'
            )}
          </Button>
        </Form>
      )}
    </UploadContainer>
  );
};

export default Upload;
