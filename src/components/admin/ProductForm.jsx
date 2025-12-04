import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../../supabase/client';
import { useDropzone } from 'react-dropzone';

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', 'XXXX'];

const ProductForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditing = !!id;

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(isEditing);
    const [categories, setCategories] = useState([]);
    const [uploading, setUploading] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        stock: 0,
        category_id: '',
        image_url: '', // Kept for backward compatibility (will be images[0])
        images: [],   // Array of image URLs
        show_on_home: false,
        sizes: {
            XS: 0, S: 0, M: 0, L: 0, XL: 0, XXL: 0, XXXL: 0, XXXX: 0
        }
    });

    useEffect(() => {
        fetchCategories();
        if (isEditing) {
            fetchProduct();
        }
    }, [id]);

    useEffect(() => {
        const totalStock = Object.values(formData.sizes).reduce((a, b) => Number(a) + Number(b), 0);
        setFormData(prev => ({ ...prev, stock: totalStock }));
    }, [formData.sizes]);

    const fetchCategories = async () => {
        const { data } = await supabase.from('categories').select('*').order('name');
        setCategories(data || []);
    };

    const fetchProduct = async () => {
        try {
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;

            const savedSizes = data.sizes || {};
            const mergedSizes = { ...formData.sizes, ...savedSizes };

            // Ensure images array is populated
            let images = data.images || [];
            if (images.length === 0 && data.image_url) {
                images = [data.image_url];
            }

            setFormData({
                name: data.name,
                description: data.description || '',
                price: data.price,
                stock: data.stock,
                category_id: data.category_id || '',
                image_url: data.image_url || '',
                images: images,
                show_on_home: data.show_on_home || false,
                sizes: mergedSizes
            });
        } catch (error) {
            console.error('Error fetching product:', error);
            navigate('/admin');
        } finally {
            setFetching(false);
        }
    };

    const onDrop = useCallback(async (acceptedFiles) => {
        if (acceptedFiles.length === 0) return;

        setUploading(true);
        try {
            const newImages = [];

            for (const file of acceptedFiles) {
                const fileExt = file.name.split('.').pop();
                const fileName = `${Math.random()}.${fileExt}`;
                const filePath = `${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('products')
                    .upload(filePath, file);

                if (uploadError) throw uploadError;

                const { data: { publicUrl } } = supabase.storage
                    .from('products')
                    .getPublicUrl(filePath);

                newImages.push(publicUrl);
            }

            setFormData(prev => {
                const updatedImages = [...prev.images, ...newImages];
                return {
                    ...prev,
                    images: updatedImages,
                    image_url: updatedImages.length > 0 ? updatedImages[0] : ''
                };
            });

        } catch (error) {
            alert('Error subiendo imagen: ' + error.message);
        } finally {
            setUploading(false);
        }
    }, []);

    const removeImage = (indexToRemove) => {
        setFormData(prev => {
            const updatedImages = prev.images.filter((_, index) => index !== indexToRemove);
            return {
                ...prev,
                images: updatedImages,
                image_url: updatedImages.length > 0 ? updatedImages[0] : ''
            };
        });
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.jpeg', '.png', '.jpg', '.webp']
        },
        maxFiles: 10
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSizeChange = (size, qty) => {
        setFormData(prev => ({
            ...prev,
            sizes: {
                ...prev.sizes,
                [size]: Number(qty)
            }
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const productData = {
                ...formData,
                price: parseFloat(formData.price),
                stock: parseInt(formData.stock),
                category_id: formData.category_id ? parseInt(formData.category_id) : null,
                sizes: formData.sizes,
                images: formData.images,
                image_url: formData.images.length > 0 ? formData.images[0] : null // Sync main image
            };

            if (isEditing) {
                const { error } = await supabase
                    .from('products')
                    .update(productData)
                    .eq('id', id);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('products')
                    .insert([productData]);
                if (error) throw error;
            }

            navigate('/admin');
        } catch (error) {
            alert('Error saving product: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return <div className="p-8 text-center">Cargando datos del producto...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-serif text-brand-dark">
                    {isEditing ? 'Editar Producto' : 'Nuevo Producto'}
                </h1>
                <button
                    onClick={() => navigate('/admin')}
                    className="text-gray-500 hover:text-brand-dark"
                >
                    Cancelar
                </button>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Name */}
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Producto</label>
                            <input
                                type="text"
                                name="name"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-brand-gold"
                            />
                        </div>

                        {/* Category */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                            <select
                                name="category_id"
                                required
                                value={formData.category_id}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-brand-gold"
                            >
                                <option value="">Seleccionar...</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* Price */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Precio ($)</label>
                            <input
                                type="number"
                                name="price"
                                required
                                min="0"
                                step="0.01"
                                value={formData.price}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-brand-gold"
                            />
                        </div>

                        {/* Sizes Grid */}
                        <div className="col-span-2 bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <label className="block text-sm font-medium text-gray-700 mb-3">Stock por Talle</label>
                            <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
                                {SIZES.map(size => (
                                    <div key={size}>
                                        <label className="block text-xs font-medium text-gray-500 mb-1 text-center">{size}</label>
                                        <input
                                            type="number"
                                            min="0"
                                            value={formData.sizes[size]}
                                            onChange={(e) => handleSizeChange(size, e.target.value)}
                                            className="w-full px-2 py-1 text-center border border-gray-300 rounded focus:outline-none focus:border-brand-gold text-sm"
                                        />
                                    </div>
                                ))}
                            </div>
                            <div className="mt-3 text-right text-sm text-gray-600">
                                Total Stock: <span className="font-bold text-brand-dark">{formData.stock}</span>
                            </div>
                        </div>

                        {/* Multi-Image Upload */}
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Galería de Imágenes</label>

                            <div
                                {...getRootProps()}
                                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${isDragActive ? 'border-brand-gold bg-brand-gold/5' : 'border-gray-300 hover:border-brand-gold'
                                    }`}
                            >
                                <input {...getInputProps()} />
                                {uploading ? (
                                    <div className="text-brand-gold font-medium">Subiendo imágenes...</div>
                                ) : (
                                    <div>
                                        <p className="text-gray-600">Arrastrá tus imágenes acá, o hacé clic para seleccionar</p>
                                        <p className="text-xs text-gray-400 mt-1">(JPG, PNG, WEBP - Máx 10)</p>
                                    </div>
                                )}
                            </div>

                            {/* Image Grid */}
                            {formData.images.length > 0 && (
                                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {formData.images.map((img, index) => (
                                        <div key={index} className="relative group aspect-square">
                                            <img
                                                src={img}
                                                alt={`Preview ${index}`}
                                                className="w-full h-full object-cover rounded border border-gray-200"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(index)}
                                                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                                                title="Eliminar imagen"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                            </button>
                                            {index === 0 && (
                                                <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs text-center py-1">
                                                    Principal
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Show on Home Toggle */}
                        <div className="col-span-2">
                            <div className="flex items-center">
                                <input
                                    id="show_on_home"
                                    name="show_on_home"
                                    type="checkbox"
                                    checked={formData.show_on_home}
                                    onChange={handleChange}
                                    className="h-4 w-4 text-brand-gold focus:ring-brand-gold border-gray-300 rounded"
                                />
                                <label htmlFor="show_on_home" className="ml-2 block text-sm text-gray-900">
                                    Mostrar en Home (Destacado)
                                </label>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                            <textarea
                                name="description"
                                rows="4"
                                value={formData.description}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-brand-gold"
                            ></textarea>
                        </div>
                    </div>

                    <div className="flex justify-end pt-4 border-t border-gray-100">
                        <button
                            type="submit"
                            disabled={loading || uploading}
                            className="bg-brand-dark text-brand-gold px-6 py-2 rounded hover:bg-black transition-colors uppercase tracking-wider font-medium disabled:opacity-50"
                        >
                            {loading ? 'Guardando...' : (isEditing ? 'Actualizar Producto' : 'Crear Producto')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProductForm;
