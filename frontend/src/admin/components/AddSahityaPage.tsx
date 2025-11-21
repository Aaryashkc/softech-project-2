import React, { useState } from 'react';
import { useSahityaStore, type SahityaInput } from '../../stores/useSahityaStore';
import { FileText, Image, Loader2, Upload, BookOpen, User, Tag, Type, X } from 'lucide-react';
import toast from 'react-hot-toast';

const InputField = ({
    label,
    name,
    icon: Icon,
    placeholder,
    required = false,
    value,
    onChange,
    error
}: {
    label: string;
    name: string;
    icon: React.ElementType;
    placeholder: string;
    required?: boolean;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    error?: string;
}) => (
    <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <Icon className="w-4 h-4 text-blue-600" />
            {label}
            {required && <span className="text-blue-500">*</span>}
        </label>
        <input
            type="text"
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${error ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                }`}
            required={required}
        />
        {error && (
            <p className="text-sm text-blue-600 flex items-center gap-1">
                <span className="w-4 h-4">⚠️</span>
                {error}
            </p>
        )}
    </div>
);

const AddSahityaPage: React.FC = () => {
    const { createSahitya, isLoading } = useSahityaStore();

    const [formData, setFormData] = useState<SahityaInput>({
        title: '',
        category: 'sahitya',
        type: 'kavita',
        content: '',
        tags: [],
        authorName: 'Ranjit Tamang',
        coverImage: null
    });

    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [tagsInput, setTagsInput] = useState('');

    interface FormErrors {
        title?: string;
        content?: string;
        coverImage?: string;
    }

    const [errors, setErrors] = useState<FormErrors>({});

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (errors[name as keyof FormErrors]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setTagsInput(e.target.value);
        setFormData(prev => ({
            ...prev,
            tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag !== '')
        }));
    };

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                toast.error('Image size must be less than 5MB');
                return;
            }
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
            setErrors(prev => ({ ...prev, coverImage: '' }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};
        if (!formData.title.trim()) newErrors.title = 'Title is required';
        if (!formData.content.trim()) newErrors.content = 'Content is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error('Please fill in all required fields');
            return;
        }

        try {
            let coverImageUrl = null;
            if (imageFile) {
                const reader = new FileReader();
                reader.readAsDataURL(imageFile);
                coverImageUrl = await new Promise<string>((resolve) => {
                    reader.onload = () => resolve(reader.result as string);
                });
            }

            const payload = {
                ...formData,
                coverImage: coverImageUrl
            };

            console.log('Submitting payload:', payload); // Debug log

            await createSahitya(payload);

            // Reset form
            setFormData({
                title: '',
                category: 'sahitya',
                type: 'kavita',
                content: '',
                tags: [],
                authorName: 'Ranjit Tamang',
                coverImage: null
            });
            setImageFile(null);
            setImagePreview(null);
            setTagsInput('');
            setErrors({});
            toast.success('Content created successfully');

        } catch (error: any) {
            console.error('Error creating content:', error);
            const errorMessage = error.response?.data?.error || error.message || 'Failed to create content';
            toast.error(errorMessage);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-6 px-2 sm:py-8 sm:px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                        <BookOpen className="w-8 h-8 text-blue-600" />
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Add New Sahitya</h1>
                    <p className="text-gray-600">Publish new literature, poetry, or articles</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-8">
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <InputField
                                label="Title"
                                name="title"
                                icon={FileText}
                                placeholder="Enter title"
                                required
                                value={formData.title}
                                onChange={handleInputChange}
                                error={errors.title}
                            />

                            <InputField
                                label="Author Name"
                                name="authorName"
                                icon={User}
                                placeholder="Enter author name"
                                value={formData.authorName}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                    <BookOpen className="w-4 h-4 text-blue-600" />
                                    Category
                                </label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                >
                                    <option value="sahitya">Sahitya</option>
                                    <option value="sangit">Sangit</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                    <Type className="w-4 h-4 text-blue-600" />
                                    Type
                                </label>
                                <select
                                    name="type"
                                    value={formData.type}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                >
                                    <option value="kavita">कविता (Kavita)</option>
                                    <option value="katha">Katha</option>
                                    <option value="geet">Geet</option>
                                    <option value="aalochana">Aalochana</option>
                                    <option value="note">Note</option>
                                    <option value="article">Article</option>
                                </select>
                            </div>
                        </div>

                        <InputField
                            label="Tags (comma separated)"
                            name="tags"
                            icon={Tag}
                            placeholder="e.g., poetry, nature, love"
                            value={tagsInput}
                            onChange={handleTagsChange}
                        />

                        {/* Content Textarea */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                <FileText className="w-4 h-4 text-blue-600" />
                                Content
                                <span className="text-blue-500">*</span>
                            </label>
                            <textarea
                                name="content"
                                value={formData.content}
                                onChange={handleInputChange}
                                placeholder="Write your content here..."
                                rows={12}
                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-y font-serif ${errors.content ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                                    }`}
                                required
                            />
                            {errors.content && (
                                <p className="text-sm text-blue-600 flex items-center gap-1">
                                    <span className="w-4 h-4">⚠️</span>
                                    {errors.content}
                                </p>
                            )}
                        </div>

                        {/* Image Upload */}
                        <div className="space-y-4">
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                <Image className="w-4 h-4 text-blue-600" />
                                Cover Image
                            </label>

                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors bg-gray-50">
                                <input
                                    type="file"
                                    id="cover-upload"
                                    accept="image/*"
                                    onChange={handleImageSelect}
                                    className="hidden"
                                />
                                <label htmlFor="cover-upload" className="cursor-pointer block">
                                    {imagePreview ? (
                                        <div className="relative inline-block group">
                                            <img
                                                src={imagePreview}
                                                alt="Preview"
                                                className="max-h-64 rounded-lg shadow-md mx-auto object-contain bg-white"
                                            />
                                            {/* Overlay with actions */}
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-3">
                                                <span className="bg-white text-gray-900 px-3 py-1.5 rounded-full shadow-sm text-sm font-medium hover:bg-gray-50 transition-colors">
                                                    Change
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        setImageFile(null);
                                                        setImagePreview(null);
                                                        setErrors(prev => ({ ...prev, coverImage: '' }));
                                                    }}
                                                    className="bg-red-600 text-white p-1.5 rounded-full shadow-sm hover:bg-red-700 transition-colors"
                                                    title="Remove image"
                                                >
                                                    <X className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                            <p className="text-gray-600 mb-2">Click to upload cover image</p>
                                            <p className="text-sm text-gray-500">PNG, JPG, WebP up to 5MB</p>
                                        </>
                                    )}
                                </label>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-6">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium text-lg shadow-md hover:shadow-lg"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Publishing...
                                    </>
                                ) : (
                                    <>
                                        <BookOpen className="w-5 h-5" />
                                        Publish Content
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddSahityaPage;
