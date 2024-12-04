import React, { useState, useEffect, useRef } from 'react';
import styles from '@/styles/ChargingStationImagesComponent.module.css';
import api from '@/lib/axios';

interface ManageChargingStationComponentProps {
    chargingStationId: number;
}

const ChargingStationImagesComponent: React.FC<ManageChargingStationComponentProps> = ({ chargingStationId }) => {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [uploadedImages, setUploadedImages] = useState<string[]>([]);
    const [removingIndex, setRemovingIndex] = useState<number | null>(null);
    const [removingCrossIndex, setRemovingCrossIndex] = useState<number | null>(null);
    const [files, setFiles] = useState<File[]>([]);

    const apiUrl = '/charging-stations';

    // Fetch previously uploaded images from the server
    const fetchUploadedImages = async () => {
        try {
            const response = await api.get(`${apiUrl}/${chargingStationId}/images`);
            if (response.status === 200) {
                const images = response.data;
                setUploadedImages(images);
            } else {
                console.error("Failed to fetch uploaded images");
            }
        } catch (error) {
            console.error("Error fetching uploaded images:", error);
        }
    };

    useEffect(() => {
        fetchUploadedImages();
    }, [chargingStationId]);

    const handleUploadImages = () => {
        inputRef?.current?.click();
    };

    const handleFileChangeEvent = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (inputRef?.current?.files) {
            const selectedFiles = Array.from(inputRef?.current?.files);
            const previews: string[] = [];
            const newFiles: File[] = [];
    
            selectedFiles.forEach(file => {
                // File size check (e.g., 10MB max size)
                if (file.size > 10 * 1024 * 1024) {
                    alert('File size exceeds the 10MB limit.');
                    return;
                }
    
                newFiles.push(file);
                const reader = new FileReader();
                reader.onload = (e) => {
                    if (e.target?.result) {
                        previews.push(e.target.result as string);
                        if (previews.length === selectedFiles.length) {
                            setImagePreviews(previews);
                        }
                    }
                };
                reader.readAsDataURL(file);
            });
    
            setFiles(newFiles);
        }
    };

    const handleRemove = (index: number) => {
        setRemovingIndex(index);
        setRemovingCrossIndex(index);
        setTimeout(() => {
            setImagePreviews(prev => prev.filter((_, idx) => idx !== index));
            setFiles(prev => prev.filter((_, idx) => idx !== index));
            setRemovingIndex(null);
            setRemovingCrossIndex(null);
        }, 500);
    };

    const handleSubmit = async () => {
        const formData = new FormData();
        files.forEach(file => {
            formData.append('files', file);
        });

        try {
            const response = await api.post(`${apiUrl}/${chargingStationId}/images`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            if (response.status === 200) {
                console.log('Images uploaded successfully');
                setImagePreviews([]);
                setFiles([]);
                fetchUploadedImages();
            } else {
                console.error('Failed to upload images');
            }
        } catch (error) {
            console.error('Error uploading images:', error);
        }
    };

    return (
        <div>
            <input
                type="file"
                ref={inputRef}
                className={styles.fileInput}
                onChange={handleFileChangeEvent}
                multiple
                accept="image/*"
            />
            <div className={styles.ButtonParent}>
                <button className={styles.uploadImagesButton} onClick={handleUploadImages}>
                    Upload Images
                </button>
                {imagePreviews?.length > 0 && (
                    <button className={styles.uploadImagesButton} onClick={handleSubmit}>
                        Submit
                    </button>
                )}
            </div>
            <div className={styles.imagesParent}>
                {/* Display uploaded images */}
                {uploadedImages?.length > 0 && uploadedImages.map((image, index) => (
                    <div key={index} className={styles.uploadedImages}>
                        <img src={`${image}`} alt={`uploaded preview ${index}`} className={styles.images} />
                    </div>
                ))}

                {/* Display new previews */}
                {imagePreviews?.length > 0 &&
                    imagePreviews.map((image, index) => (
                        <div key={index} className={styles.crossAndImages}>
                            <button
                                onClick={() => handleRemove(index)}
                                className={`${styles.cross} ${removingCrossIndex === index ? styles.removing : ''}`}
                            >
                                &#10060;
                            </button>
                            <img
                                src={image}
                                alt={`preview ${index}`}
                                className={`${styles.images} ${removingIndex === index ? styles.removing : ''}`}
                            />
                        </div>
                    ))}
            </div>
        </div>
    );
};

export default ChargingStationImagesComponent;
