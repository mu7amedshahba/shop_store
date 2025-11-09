import React, { useState, useCallback, useEffect } from "react";
import PropTypes from "prop-types";

const ImageUploader = ({
  maxFiles = 5,
  maxSizeMB = 5,
  acceptedTypes = ["image/jpeg", "image/png", "image/webp"],
  onFilesChange,
  initialFiles = [],
}) => {
  const [files, setFiles] = useState([]);
  const [errors, setErrors] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = React.useRef(null);

  // Initialize with any pre-existing files
  //
  useEffect(() => {
    if (initialFiles.length > 0) {
      setFiles(initialFiles);
    }
  }, [initialFiles]);

  // Clean up object URLs
  useEffect(() => {
    return () => {
      files.forEach((file) => {
        if (file.preview) {
          URL.revokeObjectURL(file.preview);
        }
      });
    };
  }, [files]);

  const validateFile = (file) => {
    if (!acceptedTypes.includes(file.type)) {
      return `File type not supported: ${file.name}`;
    }
    if (file.size > maxSizeMB * 1024 * 1024) {
      return `File too large (max ${maxSizeMB}MB): ${file.name}`;
    }
    return null;
  };

  const processFiles = useCallback(
    (newFiles) => {
      const newErrors = [];
      const validFiles = [];

      Array.from(newFiles).forEach((file) => {
        const error = validateFile(file);
        if (error) {
          newErrors.push(error);
          return;
        }

        validFiles.push({
          file,
          preview: URL.createObjectURL(file),
          name: file.name,
          size: file.size,
          type: file.type,
          lastModified: file.lastModified,
          id: `${file.name}-${file.lastModified}-${file.size}`,
        });
      });

      // Check total files count
      if (files.length + validFiles.length > maxFiles) {
        newErrors.push(`Maximum ${maxFiles} files allowed`);
        setErrors(newErrors);
        return;
      }

      setErrors(newErrors);
      if (validFiles.length > 0) {
        const updatedFiles = [...files, ...validFiles];
        setFiles(updatedFiles);
        onFilesChange(updatedFiles);
      }
    },
    [files, maxFiles, maxSizeMB, acceptedTypes, onFilesChange]
  );

  const handleFileChange = (e) => {
    processFiles(e.target.files);
    e.target.value = ""; // Reset input to allow re-uploading same files
  };

  const handleDragEvents = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true);
    } else if (e.type === "dragleave") {
      setIsDragging(false);
    }
  };

  const handleDrop = (e) => {
    handleDragEvents(e);
    setIsDragging(false);
    processFiles(e.dataTransfer.files);
  };

  const removeFile = (id) => {
    const updatedFiles = files.filter((file) => file.id !== id);
    const fileToRemove = files.find((file) => file.id === id);

    if (fileToRemove?.preview) {
      URL.revokeObjectURL(fileToRemove.preview);
    }

    setFiles(updatedFiles);
    onFilesChange(updatedFiles);
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragging
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 hover:border-gray-400"
        }`}
        onDragEnter={handleDragEvents}
        onDragOver={handleDragEvents}
        onDragLeave={handleDragEvents}
        onDrop={handleDrop}
        onClick={triggerFileInput}
      >
        <input
          type="file"
          ref={fileInputRef}
          multiple
          accept={acceptedTypes.join(",")}
          onChange={handleFileChange}
          className="hidden"
        />
        <div className="flex flex-col items-center justify-center space-y-2 cursor-pointer">
          <svg
            className={`w-12 h-12 ${
              isDragging ? "text-blue-500" : "text-gray-400"
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          <p className="text-sm text-gray-600">
            <span className="font-medium text-blue-600">Click to upload</span>{" "}
            or drag and drop
          </p>
          <p className="text-xs text-gray-500">
            {acceptedTypes
              .map((t) => t.split("/")[1])
              .join(", ")
              .toUpperCase()}
            (Max {maxFiles} files, {maxSizeMB}MB each)
          </p>
        </div>
      </div>

      {/* Error messages */}
      {errors.length > 0 && (
        <div className="mt-2 space-y-1">
          {errors.map((error, i) => (
            <p key={i} className="text-sm text-red-600">
              {error}
            </p>
          ))}
        </div>
      )}

      {/* Preview area */}
      {files.length > 0 && (
        <div className="mt-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">
            Selected Files ({files.length}/{maxFiles})
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {files.map((file) => (
              <div
                key={file.id}
                className="relative border rounded-lg overflow-hidden group"
              >
                <div className="aspect-square bg-gray-100 flex items-center justify-center">
                  <img
                    src={file.preview}
                    alt={`Preview of ${file.name}`}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="p-2">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(file.size)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => removeFile(file.id)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100 focus:outline-none"
                  aria-label={`Remove ${file.name}`}
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

ImageUploader.propTypes = {
  maxFiles: PropTypes.number,
  maxSizeMB: PropTypes.number,
  acceptedTypes: PropTypes.arrayOf(PropTypes.string),
  onFilesChange: PropTypes.func.isRequired,
  initialFiles: PropTypes.arrayOf(
    PropTypes.shape({
      file: PropTypes.instanceOf(File),
      preview: PropTypes.string,
      name: PropTypes.string,
      size: PropTypes.number,
      type: PropTypes.string,
      id: PropTypes.string,
    })
  ),
};

export default ImageUploader;
