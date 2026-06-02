import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { updateProfile, changePassword } from '../api/profile';

const Profile = () => {
    const { user, login } = useAuth();
    const [profileForm, setProfileForm] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        address: user?.address || '',
    });
    const [passwordForm, setPasswordForm] = useState({
        current_password: '',
        new_password: '',
        new_password_confirmation: '',
    });
    const [profileMsg, setProfileMsg] = useState({ type: '', text: '' });
    const [passwordMsg, setPasswordMsg] = useState({ type: '', text: '' });
    const [profileSaving, setProfileSaving] = useState(false);
    const [passwordSaving, setPasswordSaving] = useState(false);

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        setProfileMsg({ type: '', text: '' });
        setProfileSaving(true);
        try {
            const res = await updateProfile(profileForm);
            setProfileMsg({ type: 'success', text: res.data.message });
        } catch (err) {
            const msg = err.response?.data?.message || err.response?.data?.errors
                ? Object.values(err.response.data.errors).flat().join(', ')
                : 'Failed to update profile.';
            setProfileMsg({ type: 'error', text: msg });
        } finally {
            setProfileSaving(false);
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setPasswordMsg({ type: '', text: '' });
        setPasswordSaving(true);
        try {
            const res = await changePassword(passwordForm);
            setPasswordMsg({ type: 'success', text: res.data.message });
            setPasswordForm({ current_password: '', new_password: '', new_password_confirmation: '' });
        } catch (err) {
            const msg = err.response?.data?.message || err.response?.data?.errors
                ? Object.values(err.response.data.errors).flat().join(', ')
                : 'Failed to change password.';
            setPasswordMsg({ type: 'error', text: msg });
        } finally {
            setPasswordSaving(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <h1 className="text-3xl font-bold text-gray-800">Profile Settings</h1>

            {/* Edit Profile */}
            <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Edit Profile</h2>

                {profileMsg.text && (
                    <div className={`p-3 rounded-lg mb-4 text-sm ${profileMsg.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
                        {profileMsg.text}
                    </div>
                )}

                <form onSubmit={handleProfileSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="profile-name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                        <input id="profile-name" type="text" value={profileForm.name}
                            onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-kids-purple focus:border-transparent" required />
                    </div>
                    <div>
                        <label htmlFor="profile-email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input id="profile-email" type="email" value={profileForm.email}
                            onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-kids-purple focus:border-transparent" required />
                    </div>
                    <div>
                        <label htmlFor="profile-phone" className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                        <input id="profile-phone" type="text" value={profileForm.phone}
                            onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-kids-purple focus:border-transparent" />
                    </div>
                    <div>
                        <label htmlFor="profile-address" className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                        <textarea id="profile-address" value={profileForm.address}
                            onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-kids-purple focus:border-transparent" rows="2" />
                    </div>
                    <button type="submit" disabled={profileSaving}
                        className="bg-kids-purple text-white px-6 py-2 rounded-lg font-semibold hover:bg-purple-700 transition disabled:opacity-50">
                        {profileSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                </form>
            </div>

            {/* Change Password */}
            <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Change Password</h2>

                {passwordMsg.text && (
                    <div className={`p-3 rounded-lg mb-4 text-sm ${passwordMsg.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
                        {passwordMsg.text}
                    </div>
                )}

                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="profile-current-pw" className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                        <input id="profile-current-pw" type="password" value={passwordForm.current_password}
                            onChange={(e) => setPasswordForm({ ...passwordForm, current_password: e.target.value })}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-kids-purple focus:border-transparent" required />
                    </div>
                    <div>
                        <label htmlFor="profile-new-pw" className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                        <input id="profile-new-pw" type="password" value={passwordForm.new_password}
                            onChange={(e) => setPasswordForm({ ...passwordForm, new_password: e.target.value })}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-kids-purple focus:border-transparent" required minLength={8} />
                    </div>
                    <div>
                        <label htmlFor="profile-confirm-pw" className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                        <input id="profile-confirm-pw" type="password" value={passwordForm.new_password_confirmation}
                            onChange={(e) => setPasswordForm({ ...passwordForm, new_password_confirmation: e.target.value })}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-kids-purple focus:border-transparent" required />
                    </div>
                    <button type="submit" disabled={passwordSaving}
                        className="bg-kids-purple text-white px-6 py-2 rounded-lg font-semibold hover:bg-purple-700 transition disabled:opacity-50">
                        {passwordSaving ? 'Changing...' : 'Change Password'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Profile;