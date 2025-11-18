import React, { useState, useEffect } from 'react';
import { Edit, Trash2, Eye, X } from 'lucide-react';
import { usePopupStore, type PopupType } from '../../stores/usePopupStore';

interface Popup extends Omit<PopupType, '_id'> {
  _id: string;
}

const PopupManagement: React.FC = () => {
  const { popups, isLoading, fetchPopups, deletePopup } = usePopupStore();
  const [selectedPopup, setSelectedPopup] = useState<Popup | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // Fetch popups on mount
  useEffect(() => {
    const loadPopups = async () => {
      try {
        await fetchPopups();
      } catch {}
    };
    loadPopups();
  }, [fetchPopups]);

  // Handle view popup
  const handleViewPopup = (popup: Popup) => {
    setSelectedPopup(popup);
    setShowViewModal(true);
  };

  // Handle edit popup
  const handleEditPopup = (popup: Popup) => {
    setSelectedPopup(popup);
    setShowEditModal(true);
  };

  // Handle delete popup
  const handleDeletePopup = async (popupId: string) => {
    if (window.confirm('Are you sure you want to delete this popup?')) {
      try {
        await deletePopup(popupId);
      } catch {}
    }
  };

  // Handle save edit
  const handleSaveEdit = async (updatedPopup: Popup) => {
    try {
      await usePopupStore.getState().updatePopup(updatedPopup._id, {
        title: updatedPopup.title,
        message: updatedPopup.message,
        image: updatedPopup.image,
        isActive: updatedPopup.isActive,
      });
      setShowEditModal(false);
      setSelectedPopup(null);
    } catch {}
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Popup Management</h1>
          <p className="text-gray-600 mt-1">Manage your website popups</p>
        </div>
      </div>

      {/* Popups Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {popups.map((popup) => (
          <div key={popup._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            {/* Popup Image */}
            {popup.image && (
              <div className="h-64 bg-gray-200 overflow-hidden relative">
                <img src={popup.image} alt={popup.title} className="w-full h-full object-cover" />
                {popup.isActive && (
                  <div className="absolute top-3 right-3 bg-green-600 text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg">
                    ACTIVE
                  </div>
                )}
              </div>
            )}

            {/* Content */}
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
                {popup.title}
              </h3>
              <p className="text-gray-700 text-sm mb-4 line-clamp-3">
                {popup.message || 'No message'}
              </p>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleViewPopup(popup)}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-3 rounded text-sm flex items-center justify-center gap-1 transition-colors"
                >
                  <Eye size={16} />
                  View
                </button>
                <button
                  onClick={() => handleEditPopup(popup)}
                  className="flex-1 bg-blue-700 hover:bg-blue-800 text-white py-2 px-3 rounded text-sm flex items-center justify-center gap-1 transition-colors"
                  disabled={isLoading}
                >
                  <Edit size={16} />
                  Edit
                </button>
                <button
                  onClick={() => handleDeletePopup(popup._id)}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded text-sm flex items-center justify-center gap-1 transition-colors"
                  disabled={isLoading}
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* View Modal */}
      {showViewModal && selectedPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">Popup Details</h2>
              <button onClick={() => setShowViewModal(false)} className="text-gray-500 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>
            {selectedPopup.image && (
              <img src={selectedPopup.image} alt={selectedPopup.title} className="w-full h-72 object-contain rounded-lg mb-4" />
            )}
            <h3 className="text-xl font-semibold mb-2">{selectedPopup.title}</h3>
            <p className="text-gray-700">{selectedPopup.message || 'No message available'}</p>
            <p className="mt-4 font-medium">{selectedPopup.isActive ? '✅ Active' : '❌ Inactive'}</p>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedPopup && (
        <EditPopupModal
          popup={selectedPopup}
          onSave={handleSaveEdit}
          onCancel={() => {
            setShowEditModal(false);
            setSelectedPopup(null);
          }}
        />
      )}
    </div>
  );
};

// Edit Popup Modal Component
interface EditPopupModalProps {
  popup: Popup;
  onSave: (popup: Popup) => void;
  onCancel: () => void;
}

const EditPopupModal: React.FC<EditPopupModalProps> = ({ popup, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Popup>({ ...popup });
  const [imageFile, setImageFile] = useState<{ preview: string; base64: string; name: string } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSubmit = () => {
    const payload: Popup = {
      ...formData,
      image: imageFile?.base64 || formData.image,
    };
    onSave(payload);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      alert('Select valid image (JPEG, PNG, WebP)');
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      alert('Max 5MB image size allowed');
      return;
    }

    setIsProcessing(true);
    try {
      const preview = URL.createObjectURL(file);
      const base64 = await convertToBase64(file);
      setImageFile({ preview, base64, name: file.name });
    } finally {
      setIsProcessing(false);
    }
  };

  const removeImage = () => {
    if (imageFile?.preview) URL.revokeObjectURL(imageFile.preview);
    setImageFile(null);
  };

  const handleToggleActive = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, isActive: e.target.checked });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-xl w-full max-h-[90vh] overflow-y-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Edit Popup</h2>
          <button onClick={onCancel} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        {/* Active toggle */}
        <div className="flex items-center gap-3 mb-4">
          <input type="checkbox" checked={formData.isActive} onChange={handleToggleActive} className="w-5 h-5 text-green-700 border-gray-300 rounded focus:ring-green-700" />
          <label className="font-medium text-gray-800">Active</label>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input type="text" name="title" value={formData.title} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-700" />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
          <textarea name="message" value={formData.message || ''} onChange={handleChange} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-700" />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
          <img src={imageFile?.preview || formData.image} alt="Popup" className="w-full h-64 object-contain rounded-lg border mb-3 bg-gray-100" />
          {!imageFile ? (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
              <input type="file" accept="image/jpeg,image/jpg,image/png,image/webp" onChange={handleImageChange} className="hidden" id="popup-image-upload" />
              <label htmlFor="popup-image-upload" className="cursor-pointer">{isProcessing ? 'Processing...' : 'Click to upload new image'}</label>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="text-sm text-gray-600 bg-green-50 p-2 rounded">
                <p><strong>File:</strong> {imageFile.name}</p>
              </div>
              <button type="button" onClick={removeImage} className="px-3 py-2 bg-red-500 text-white rounded-md text-sm">Remove uploaded image</button>
            </div>
          )}
        </div>

        <div className="flex gap-3 pt-4">
          <button type="button" onClick={handleSubmit} className="flex-1 bg-green-700 hover:bg-green-800 text-white py-2 px-4 rounded-md font-medium">Save Changes</button>
          <button type="button" onClick={onCancel} className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-md font-medium">Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default PopupManagement;
