import React, { useState, useEffect } from 'react';
import { Edit, Trash2, BookOpen, Calendar, Plus, Loader2, X, Eye, User, Tag, Feather, Music } from 'lucide-react';
import { useSahityaStore, type Sahitya, type SahityaInput } from '../../stores/useSahityaStore';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';

const SahityaManagement: React.FC = () => {
    const { items, fetchAll, deleteSahitya, isLoading, updateSahitya } = useSahityaStore();
    const [isDeleting, setIsDeleting] = useState(false);
    const [selectedItem, setSelectedItem] = useState<Sahitya | null>(null);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    // Edit form state
    const [editFormData, setEditFormData] = useState<SahityaInput>({
        title: '',
        category: 'sahitya',
        type: 'article',
        content: '',
        tags: [],
        authorName: 'Admin',
        coverImage: null
    });
    const [editImageFile, setEditImageFile] = useState<File | null>(null);
    const [editImagePreview, setEditImagePreview] = useState<string | null>(null);

    useEffect(() => {
        fetchAll();
    }, []);

    const handleViewItem = (item: Sahitya) => {
        setSelectedItem(item);
        setShowViewModal(true);
    };

    const handleEditItem = (item: Sahitya) => {
        setSelectedItem(item);
        setEditFormData({
            title: item.title,
            category: item.category,
            type: item.type,
            content: item.content,
            tags: item.tags,
            authorName: item.authorName,
            coverImage: item.coverImage
        });
        setEditImagePreview(item.coverImage);
        setEditImageFile(null);
        setShowEditModal(true);
    };

    const handleDeleteItem = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this content? This action cannot be undone.')) {
            try {
                setIsDeleting(true);
                await deleteSahitya(id);
                toast.success('Content deleted successfully');
            } catch (error) {
                console.error('Error deleting content:', error);
                toast.error('Failed to delete content');
            } finally {
                setIsDeleting(false);
            }
        }
    };

    const handleEditImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setEditImageFile(file);
            setEditImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSaveEdit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedItem) return;

        try {
            setIsEditing(true);
            let coverImageUrl = editFormData.coverImage;

            if (editImageFile) {
                const reader = new FileReader();
                reader.readAsDataURL(editImageFile);
                const base64 = await new Promise<string>((resolve) => {
                    reader.onload = () => resolve(reader.result as string);
                });
                // Upload to cloudinary via backend route usually, but here we might need a direct upload or use the existing pattern
                // The store's updateSahitya expects SahityaInput which has coverImage as string (url or base64 if backend handles it)
                // Based on controller, it handles base64 upload.
                coverImageUrl = base64;
            }

            await updateSahitya(selectedItem._id, {
                ...editFormData,
                coverImage: coverImageUrl
            });

            setShowEditModal(false);
            setSelectedItem(null);
            toast.success('Content updated successfully');
        } catch (error) {
            console.error('Error updating content:', error);
            toast.error('Failed to update content');
        } finally {
            setIsEditing(false);
        }
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'kavita': return <Feather className="h-4 w-4" />;
            case 'geet': return <Music className="h-4 w-4" />;
            default: return <BookOpen className="h-4 w-4" />;
        }
    };

    if (isLoading && items.length === 0) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="animate-spin h-12 w-12 text-blue-600" />
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Sahitya Management</h1>
                    <p className="text-gray-600 mt-1">Manage literature, poetry, and articles</p>
                </div>
                <Link
                    to="/admin/add-sahitya"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    <Plus size={16} className="mr-2" />
                    Add New Content
                </Link>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {items.map((item) => (
                    <div key={item._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow flex flex-col border border-gray-100">
                        {/* Cover Image */}
                        <div className="h-40 sm:h-48 bg-gray-100 relative overflow-hidden">
                            {item.coverImage ? (
                                <img
                                    src={item.coverImage}
                                    alt={item.title}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-300">
                                    <BookOpen size={48} />
                                </div>
                            )}
                            <div className="absolute top-2 right-2">
                                <span className="bg-white/90 text-blue-800 px-2 py-1 rounded text-xs font-semibold flex items-center gap-1 shadow-sm uppercase">
                                    {getTypeIcon(item.type)}
                                    {item.type}
                                </span>
                            </div>
                        </div>

                        {/* Content Info */}
                        <div className="p-4 flex flex-col flex-1">
                            <div className="mb-2">
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 uppercase">
                                    {item.category}
                                </span>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
                                {item.title}
                            </h3>

                            <div className="flex items-center text-gray-500 text-sm mb-2">
                                <User size={14} className="mr-1" />
                                <span className="truncate">{item.authorName}</span>
                            </div>

                            <div className="flex items-center text-gray-500 text-sm mb-4">
                                <Calendar size={14} className="mr-1" />
                                <span>{formatDate(item.createdAt)}</span>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-2 mt-auto pt-4 border-t border-gray-100">
                                <button
                                    onClick={() => handleViewItem(item)}
                                    className="flex-1 bg-green-50 hover:bg-green-100 text-green-700 py-2 px-3 rounded text-sm flex items-center justify-center gap-1 transition-colors"
                                >
                                    <Eye size={16} />
                                    View
                                </button>
                                <button
                                    onClick={() => handleEditItem(item)}
                                    className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 py-2 px-3 rounded text-sm flex items-center justify-center gap-1 transition-colors"
                                >
                                    <Edit size={16} />
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDeleteItem(item._id)}
                                    disabled={isDeleting}
                                    className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 py-2 px-3 rounded text-sm flex items-center justify-center gap-1 transition-colors disabled:opacity-50"
                                >
                                    {isDeleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {items.length === 0 && !isLoading && (
                <div className="text-center py-12 bg-white rounded-lg border border-dashed border-gray-300">
                    <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No content</h3>
                    <p className="mt-1 text-sm text-gray-500">Get started by creating a new literary work.</p>
                    <div className="mt-6">
                    </div>
                </div>
            )}

            {/* View Modal */}
            {showViewModal && selectedItem && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-6">
                                <h2 className="text-2xl font-bold text-gray-900">{selectedItem.title}</h2>
                                <button onClick={() => setShowViewModal(false)} className="text-gray-400 hover:text-gray-500">
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="space-y-6">
                                {selectedItem.coverImage && (
                                    <div className="w-full h-64 bg-gray-100 rounded-lg overflow-hidden">
                                        <img src={selectedItem.coverImage} alt={selectedItem.title} className="w-full h-full object-cover" />
                                    </div>
                                )}

                                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                    <span className="flex items-center bg-gray-100 px-3 py-1 rounded-full">
                                        <User size={14} className="mr-2" /> {selectedItem.authorName}
                                    </span>
                                    <span className="flex items-center bg-gray-100 px-3 py-1 rounded-full">
                                        <Calendar size={14} className="mr-2" /> {formatDate(selectedItem.createdAt)}
                                    </span>
                                    <span className="flex items-center bg-blue-50 text-blue-700 px-3 py-1 rounded-full uppercase font-medium">
                                        {selectedItem.category}
                                    </span>
                                    <span className="flex items-center bg-gray-100 px-3 py-1 rounded-full uppercase">
                                        {selectedItem.type}
                                    </span>
                                </div>

                                <div className="prose max-w-none bg-gray-50 p-6 rounded-lg">
                                    <div className="whitespace-pre-wrap font-serif text-gray-800 leading-relaxed">
                                        {selectedItem.content}
                                    </div>
                                </div>

                                {selectedItem.tags && selectedItem.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {selectedItem.tags.map((tag, i) => (
                                            <span key={i} className="flex items-center text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                                <Tag size={12} className="mr-1" /> {tag}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {showEditModal && selectedItem && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-900">Edit Content</h2>
                                <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-gray-500">
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleSaveEdit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Title</label>
                                            <input
                                                type="text"
                                                value={editFormData.title}
                                                onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                                                required
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Category</label>
                                                <select
                                                    value={editFormData.category}
                                                    onChange={(e) => setEditFormData({ ...editFormData, category: e.target.value as any })}
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                                                >
                                                    <option value="sahitya">Sahitya</option>
                                                    <option value="sangit">Sangit</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Type</label>
                                                <select
                                                    value={editFormData.type}
                                                    onChange={(e) => setEditFormData({ ...editFormData, type: e.target.value as any })}
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                                                >
                                                    <option value="article">Article</option>
                                                    <option value="kavita">Kavita</option>
                                                    <option value="katha">Katha</option>
                                                    <option value="geet">Geet</option>
                                                    <option value="aalochana">Aalochana</option>
                                                    <option value="note">Note</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Author Name</label>
                                            <input
                                                type="text"
                                                value={editFormData.authorName}
                                                onChange={(e) => setEditFormData({ ...editFormData, authorName: e.target.value })}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Tags (comma separated)</label>
                                            <input
                                                type="text"
                                                value={editFormData.tags.join(', ')}
                                                onChange={(e) => setEditFormData({ ...editFormData, tags: e.target.value.split(',').map(t => t.trim()) })}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Cover Image</label>
                                            <div className="mt-1 flex items-center gap-4">
                                                {editImagePreview && (
                                                    <img src={editImagePreview} alt="Preview" className="h-20 w-20 object-cover rounded" />
                                                )}
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleEditImageSelect}
                                                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="h-full">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                                        <textarea
                                            value={editFormData.content}
                                            onChange={(e) => setEditFormData({ ...editFormData, content: e.target.value })}
                                            rows={15}
                                            className="block w-full h-[calc(100%-2rem)] rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2 font-serif"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end gap-3 pt-4 border-t">
                                    <button
                                        type="button"
                                        onClick={() => setShowEditModal(false)}
                                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isEditing}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50"
                                    >
                                        {isEditing ? (
                                            <>
                                                <Loader2 className="animate-spin h-4 w-4" />
                                                Saving...
                                            </>
                                        ) : (
                                            'Save Changes'
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SahityaManagement;
