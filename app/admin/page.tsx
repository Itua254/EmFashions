'use client';

import { useState, useEffect } from 'react';
import { supabase, Product } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Pencil, Trash2, Plus, Upload } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatPrice } from '@/lib/currency';

export default function AdminPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [formData, setFormData] = useState({ name: '', price: '', image_url: '' });
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setProducts(data || []);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('product-images')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data } = supabase.storage
                .from('product-images')
                .getPublicUrl(filePath);

            setFormData({ ...formData, image_url: data.publicUrl });
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Failed to upload image');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if (editingProduct) {
                const { error } = await supabase
                    .from('products')
                    .update({
                        name: formData.name,
                        price: parseFloat(formData.price),
                        image_url: formData.image_url,
                    })
                    .eq('id', editingProduct.id);

                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('products')
                    .insert([{
                        name: formData.name,
                        price: parseFloat(formData.price),
                        image_url: formData.image_url,
                    }]);

                if (error) throw error;
            }

            setFormData({ name: '', price: '', image_url: '' });
            setEditingProduct(null);
            setIsDialogOpen(false);
            fetchProducts();
        } catch (error) {
            console.error('Error saving product:', error);
            alert('Failed to save product');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this product?')) return;

        try {
            const { error } = await supabase
                .from('products')
                .delete()
                .eq('id', id);

            if (error) throw error;
            fetchProducts();
        } catch (error) {
            console.error('Error deleting product:', error);
            alert('Failed to delete product');
        }
    };

    const openEditDialog = (product: Product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            price: product.price.toString(),
            image_url: product.image_url,
        });
        setIsDialogOpen(true);
    };

    const openAddDialog = () => {
        setEditingProduct(null);
        setFormData({ name: '', price: '', image_url: '' });
        setIsDialogOpen(true);
    };

    return (
        <div className="min-h-screen bg-white">
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-12">
                    <div>
                        <h1 className="text-3xl font-light tracking-widest text-black">
                            Em Fashions Admin
                        </h1>
                        <p className="text-neutral-500 mt-2 text-sm uppercase tracking-wider">Manage your products</p>
                    </div>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button onClick={openAddDialog} className="bg-black text-white hover:bg-neutral-800 uppercase tracking-wider text-xs gap-2">
                                <Plus className="w-4 h-4" />
                                Add Product
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px]">
                            <DialogHeader>
                                <DialogTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <Label htmlFor="name">Product Name</Label>
                                    <Input
                                        id="name"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="price">Price (KSh)</Label>
                                    <Input
                                        id="price"
                                        type="number"
                                        step="1"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        required
                                        placeholder="e.g. 4500"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="image">Product Image</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            id="image"
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            disabled={uploading}
                                        />
                                        {uploading && <span className="text-sm text-neutral-500">Uploading...</span>}
                                    </div>
                                    {formData.image_url && (
                                        <img
                                            src={formData.image_url}
                                            alt="Preview"
                                            className="mt-2 w-32 h-32 object-cover rounded-lg"
                                        />
                                    )}
                                </div>
                                <Button type="submit" className="w-full">
                                    {editingProduct ? 'Update Product' : 'Add Product'}
                                </Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                {loading ? (
                    <div className="text-center py-20">
                        <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-solid border-current border-r-transparent"></div>
                    </div>
                ) : products.length === 0 ? (
                    <div className="text-center py-20 border border-neutral-200 rounded">
                        <p className="text-neutral-500 text-sm uppercase tracking-wider">No products yet. Add your first product to get started!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {products.map((product, index) => (
                            <motion.div
                                key={product.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Card className="overflow-hidden border border-neutral-200 hover:shadow-lg transition-shadow">
                                    <div className="aspect-square relative overflow-hidden bg-neutral-50">
                                        {product.image_url ? (
                                            <img
                                                src={product.image_url}
                                                alt={product.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <Upload className="w-12 h-12 text-neutral-400" />
                                            </div>
                                        )}
                                    </div>
                                    <CardHeader>
                                        <CardTitle className="flex justify-between items-start text-sm">
                                            <span className="line-clamp-1 uppercase tracking-wider font-normal">{product.name}</span>
                                            <span className="text-sm font-normal text-black">
                                                {formatPrice(product.price)}
                                            </span>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="flex-1 border-black text-black hover:bg-black hover:text-white text-xs uppercase tracking-wider"
                                                onClick={() => openEditDialog(product)}
                                            >
                                                <Pencil className="w-3 h-3 mr-2" />
                                                Edit
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="flex-1 border-red-600 text-red-600 hover:bg-red-600 hover:text-white text-xs uppercase tracking-wider"
                                                onClick={() => handleDelete(product.id)}
                                            >
                                                <Trash2 className="w-3 h-3 mr-2" />
                                                Delete
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
