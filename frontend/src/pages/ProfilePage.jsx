import { useState, useRef } from "react";
import ReactCrop from "react-image-crop";
import { useAuthStore } from "../store/useAuthStore";
import { Camera, Mail, User } from "lucide-react";
import "react-image-crop/dist/ReactCrop.css";

// Image compression utility
const compressImage = (file, { quality = 0.7, maxSize = 800 } = {}) => {
  return new Promise((resolve, reject) => {
    if (!file?.type?.startsWith("image/")) {
      reject(new Error("Invalid file type"));
      return;
    }

    const reader = new FileReader();
    const img = new Image();
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    reader.onload = (e) => {
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calculate new dimensions
        if (width > height) {
          if (width > maxSize) {
            height = Math.round((height * maxSize) / width);
            width = maxSize;
          }
        } else if (height > maxSize) {
          width = Math.round((width * maxSize) / height);
          height = maxSize;
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to JPEG with quality compression
        canvas.toBlob(
          (blob) => {
            const compressedReader = new FileReader();
            compressedReader.onload = () => resolve(compressedReader.result);
            compressedReader.readAsDataURL(blob);
          },
          "image/jpeg",
          quality
        );
      };

      img.onerror = () => reject(new Error("Failed to load image"));
      img.src = e.target.result;
    };

    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
};

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const [selectedImg, setSelectedImg] = useState(null);
  const [compressionError, setCompressionError] = useState(null);
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [originalImage, setOriginalImage] = useState(null);
  const [crop, setCrop] = useState({ unit: "%", width: 100, aspect: 1 });
  const imgRef = useRef(null);
  const previewCanvasRef = useRef(null);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setOriginalImage(reader.result);
      setCropModalOpen(true);
    };
    reader.readAsDataURL(file);
  };

  const getCroppedImg = () => {
    const canvas = previewCanvasRef.current;
    const image = imgRef.current;

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    const ctx = canvas.getContext("2d");
    const pixelRatio = window.devicePixelRatio;

    canvas.width = crop.width * pixelRatio;
    canvas.height = crop.height * pixelRatio;

    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.imageSmoothingQuality = "high";

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        const fileName = `cropped-${Date.now()}.jpeg`;
        const file = new File([blob], fileName, { type: "image/jpeg" });
        resolve(file);
      }, "image/jpeg");
    });
  };

  const handleCropComplete = async () => {
    try {
      const croppedFile = await getCroppedImg();
      setCropModalOpen(false);

      setCompressionError(null);
      const compressedImage = await compressImage(croppedFile, {
        quality: 0.7,
        maxSize: 800,
      });

      setSelectedImg(compressedImage);
      await updateProfile({ profilePic: compressedImage });
    } catch (error) {
      console.error("Image processing error:", error);
      setCompressionError(error.message);
      setSelectedImg(null);
    }
  };

  return (
    <div className="h-screen pt-20">
      {/* Crop Modal */}
      {cropModalOpen && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-base-300 rounded-xl p-6 max-w-2xl w-full">
            <ReactCrop
              crop={crop}
              onChange={(c) => setCrop(c)}
              aspect={1}
              minWidth={100}
              minHeight={100}
            >
              <img
                ref={imgRef}
                src={originalImage}
                alt="Crop preview"
                className="max-h-[70vh] w-auto"
              />
            </ReactCrop>

            <canvas ref={previewCanvasRef} style={{ display: "none" }} />

            <div className="flex gap-4 mt-6 justify-end">
              <button
                onClick={() => setCropModalOpen(false)}
                className="btn btn-ghost"
              >
                Cancel
              </button>
              <button
                onClick={handleCropComplete}
                className="btn btn-primary"
                disabled={isUpdatingProfile}
              >
                {isUpdatingProfile ? "Saving..." : "Save Crop"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-2xl mx-auto p-4 py-8">
        <div className="bg-base-300 rounded-xl p-6 space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-semibold">Profile</h1>
            <p className="mt-2">Your profile information</p>
          </div>

          {/* Avatar Section */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img
                src={selectedImg || authUser.profilePic || "/avatar.png"}
                alt="Profile"
                className="size-32 rounded-full object-cover border-4"
                aria-busy={isUpdatingProfile ? "true" : "false"}
              />
              <label
                htmlFor="avatar-upload"
                className={`
                  absolute bottom-0 right-0 
                  bg-base-content hover:scale-105
                  p-2 rounded-full cursor-pointer 
                  transition-all duration-200
                  ${
                    isUpdatingProfile ? "animate-pulse pointer-events-none" : ""
                  }
                `}
              >
                <Camera className="w-5 h-5 text-base-200" />
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUpdatingProfile}
                />
              </label>
            </div>

            <div className="text-center">
              <p className="text-sm text-zinc-400">
                {isUpdatingProfile
                  ? "Uploading..."
                  : "Click the camera icon to update your photo"}
              </p>
              {compressionError && (
                <p className="text-sm text-red-500 mt-1">{compressionError}</p>
              )}
            </div>
          </div>

          {/* Profile Information */}
          <div className="space-y-6">
            <ProfileInfoItem
              icon={<User className="w-4 h-4" />}
              label="Full Name"
              value={authUser?.fullName}
            />

            <ProfileInfoItem
              icon={<Mail className="w-4 h-4" />}
              label="Email Address"
              value={authUser?.email}
            />
          </div>

          {/* Account Information */}
          <div className="mt-6 bg-base-300 rounded-xl p-6">
            <h2 className="text-lg font-medium mb-4">Account Information</h2>
            <div className="space-y-3 text-sm">
              <InfoRow
                label="Member Since"
                value={authUser.createdAt?.split("T")[0]}
                border
              />
              <InfoRow
                label="Account Status"
                value={<span className="text-green-500">Active</span>}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Reusable components
const ProfileInfoItem = ({ icon, label, value }) => (
  <div className="space-y-1.5">
    <div className="text-sm text-zinc-400 flex items-center gap-2">
      {icon}
      {label}
    </div>
    <p className="px-4 py-2.5 bg-base-200 rounded-lg border">{value}</p>
  </div>
);

const InfoRow = ({ label, value, border }) => (
  <div
    className={`flex items-center justify-between py-2 ${
      border ? "border-b border-zinc-700" : ""
    }`}
  >
    <span>{label}</span>
    <span>{value}</span>
  </div>
);

export default ProfilePage;
