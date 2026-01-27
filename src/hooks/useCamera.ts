'use client';

import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { useState } from 'react';

export function useCamera() {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const takePicture = async () => {
    try {
      setLoading(true);
      setError(null);

      const photo = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
      });

      if (photo.dataUrl) {
        setImage(photo.dataUrl);
        return photo.dataUrl;
      }
    } catch (err) {
      setError('Failed to take picture');
      console.error('Camera error:', err);
    } finally {
      setLoading(false);
    }
  };

  const selectFromGallery = async () => {
    try {
      setLoading(true);
      setError(null);

      const photo = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Photos,
      });

      if (photo.dataUrl) {
        setImage(photo.dataUrl);
        return photo.dataUrl;
      }
    } catch (err) {
      setError('Failed to select image');
      console.error('Gallery error:', err);
    } finally {
      setLoading(false);
    }
  };

  return {
    image,
    loading,
    error,
    takePicture,
    selectFromGallery,
  };
}
