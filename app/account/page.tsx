'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Navbar from '@/components/navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Camera, Loader2, Save, LogOut, User as UserIcon } from 'lucide-react';
import { User } from '@supabase/supabase-js';

export default function AccountPage() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [fullName, setFullName] = useState('');
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        const getProfile = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();

                if (!user) {
                    router.push('/');
                    return;
                }

                setUser(user);

                const { data, error, status } = await supabase
                    .from('profiles')
                    .select('full_name, avatar_url')
                    .eq('id', user.id)
                    .single();

                if (error && status !== 406) {
                    throw error;
                }

                if (data) {
                    setFullName(data.full_name || '');
                    setAvatarUrl(data.avatar_url);
                }
            } catch (error) {
                console.error('Error loading user data:', error);
            } finally {
                setLoading(false);
            }
        };

        getProfile();
    }, [router]);

    const updateProfile = async () => {
        if (!user) return;
        setSaving(true);

        try {
            const updates = {
                id: user.id,
                full_name: fullName,
                avatar_url: avatarUrl,
                updated_at: new Date().toISOString(),
            };

            const { error } = await supabase.from('profiles').upsert(updates);
            if (error) throw error;
            alert('Profile updated successfully!');
        } catch (error: any) {
            alert('Error updating profile: ' + error.message);
        } finally {
            setSaving(false);
        }
    };

    const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setUploading(true);

            if (!event.target.files || event.target.files.length === 0) {
                throw new Error('You must select an image to upload.');
            }

            const file = event.target.files[0];
            const fileExt = file.name.split('.').pop();
            const fileName = `${user?.id}-${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file);

            if (uploadError) {
                throw uploadError;
            }

            const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
            setAvatarUrl(data.publicUrl);
        } catch (error: any) {
            alert('Error uploading avatar: ' + error.message);
        } finally {
            setUploading(false);
        }
    };

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push('/');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#FAF9F6]">
                <Loader2 className="w-8 h-8 animate-spin text-[#4A3B32]" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FAF9F6]">
            <Navbar />
            <div className="container mx-auto px-4 py-20 max-w-2xl">
                <div className="bg-white rounded-2xl shadow-sm border border-[#EBE5DF] p-8 md:p-12">
                    <div className="flex items-center justify-between mb-8">
                        <h1 className="font-['Cormorant_Garamond'] text-3xl md:text-4xl text-[#4A3B32] font-semibold">
                            My Profile
                        </h1>
                        <Button
                            variant="ghost"
                            onClick={handleSignOut}
                            className="text-red-500 hover:text-red-600 hover:bg-red-50"
                        >
                            <LogOut className="w-4 h-4 mr-2" />
                            Sign Out
                        </Button>
                    </div>

                    <div className="space-y-8">
                        {/* Avatar Section */}
                        <div className="flex flex-col items-center space-y-4">
                            <div className="relative w-32 h-32 rounded-full overflow-hidden bg-neutral-100 border-2 border-[#EBE5DF]">
                                {avatarUrl ? (
                                    <img
                                        src={avatarUrl}
                                        alt="Avatar"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-neutral-300">
                                        <UserIcon size={48} />
                                    </div>
                                )}
                                {uploading && (
                                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                                        <Loader2 className="w-8 h-8 animate-spin text-white" />
                                    </div>
                                )}
                            </div>
                            <div className="relative">
                                <input
                                    type="file"
                                    id="avatar"
                                    accept="image/*"
                                    onChange={uploadAvatar}
                                    className="hidden"
                                    disabled={uploading}
                                />
                                <label
                                    htmlFor="avatar"
                                    className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#EBE5DF] hover:bg-neutral-50 transition-colors text-sm font-medium text-[#4A3B32]"
                                >
                                    <Camera size={16} />
                                    Change Photo
                                </label>
                            </div>
                        </div>

                        {/* Details Section */}
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-wider font-medium text-[#8C8C8C]">
                                    Email
                                </label>
                                <Input
                                    value={user?.email || ''}
                                    disabled
                                    className="bg-neutral-50 border-neutral-200"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-wider font-medium text-[#8C8C8C]">
                                    Full Name
                                </label>
                                <Input
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    placeholder="Your Name"
                                    className="h-12 border-neutral-200 focus:border-[#4A3B32]"
                                />
                            </div>

                            <Button
                                onClick={updateProfile}
                                disabled={saving}
                                className="w-full h-12 bg-[#4A3B32] hover:bg-[#2e241f] text-white rounded-full uppercase tracking-widest text-xs font-bold transition-all"
                            >
                                {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                                Save Changes
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
