import React, { useState, useRef, useEffect } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  CheckCircle2, 
  User, 
  Mail, 
  Phone, 
  Camera, 
  Upload, 
  Trash2, 
  AlertCircle,
  Eye,
  EyeOff,
  Sparkles,
  Save
} from 'lucide-react';

export default function SettingsPage({ 
  currentUser, 
  onUpdateAdminProfile, 
  onUpdateAdminPassword, 
  showToast 
}) {
  // Profile Information States
  const [name, setName] = useState(currentUser?.name || 'Store Administrator');
  const [email, setEmail] = useState(currentUser?.email || 'admin@missnous.com');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [avatar, setAvatar] = useState(currentUser?.avatar || null);
  const [avatarPreview, setAvatarPreview] = useState(currentUser?.avatar || null);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileError, setProfileError] = useState('');
  const [profileSuccess, setProfileSuccess] = useState('');

  // Password States
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  const avatarInputRef = useRef(null);

  // Sync state when currentUser changes
  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || '');
      setEmail(currentUser.email || '');
      setPhone(currentUser.phone || '');
      setAvatar(currentUser.avatar || null);
      setAvatarPreview(currentUser.avatar || null);
    }
  }, [currentUser]);

  // Handle Avatar Image Selection & Compression
  const handleAvatarFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setProfileError('Please upload a valid image file (PNG, JPG, JPEG, WEBP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setProfileError('Profile image must be under 5MB.');
      return;
    }

    setProfileError('');
    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const img = new Image();
      img.src = uploadEvent.target.result;
      img.onload = () => {
        // Compress avatar to max 300x300 square for fast loading & small payload
        const canvas = document.createElement('canvas');
        const MAX_SIZE = 300;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_SIZE) {
            height = Math.round((height * MAX_SIZE) / width);
            width = MAX_SIZE;
          }
        } else {
          if (height > MAX_SIZE) {
            width = Math.round((width * MAX_SIZE) / height);
            height = MAX_SIZE;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
        setAvatar(compressedDataUrl);
        setAvatarPreview(compressedDataUrl);
      };
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveAvatar = () => {
    setAvatar(null);
    setAvatarPreview(null);
    if (avatarInputRef.current) avatarInputRef.current.value = '';
  };

  // Submit Profile Information Form (Name, Email, Phone, Avatar)
  const handleSaveProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileError('');
    setProfileSuccess('');

    if (!name.trim()) {
      setProfileError('Administrator name cannot be empty.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      setProfileError('Please enter a valid administrator email address.');
      return;
    }

    try {
      setProfileSaving(true);
      if (onUpdateAdminProfile) {
        await onUpdateAdminProfile({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.trim(),
          avatar: avatar || null
        });
      }
      setProfileSuccess('Profile details and login email updated successfully!');
      if (showToast) showToast('Profile details updated successfully!');
    } catch (err) {
      setProfileError(err.message || 'Failed to update profile.');
    } finally {
      setProfileSaving(false);
    }
  };

  // Submit Change Password Form
  const handleChangePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError('Please fill in all password fields.');
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('New password and confirm password do not match.');
      return;
    }

    try {
      setPasswordSaving(true);
      if (onUpdateAdminPassword) {
        await onUpdateAdminPassword(currentPassword, newPassword);
      }
      setPasswordSuccess('Security password changed successfully! Use your new password on next login.');
      if (showToast) showToast('Password updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setPasswordError(err.message || 'Failed to update password.');
    } finally {
      setPasswordSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto animate-fade-in pb-12">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-sans text-2xl font-bold text-[#2B2225] tracking-tight">
            Administrator Profile & Credentials
          </h2>
          <p className="text-xs text-[#5A4B50] mt-0.5">
            Manage your personal administrative identity, login email address, avatar photo, and security credentials.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Role: Super Admin Active</span>
        </div>
      </div>

      {/* ─── SECTION 1: Personal Profile & Login Email ─── */}
      <div className="bg-white border border-[#F7D6DF] rounded-[2.5rem] p-6 sm:p-8 shadow-luxury space-y-6">
        
        <div className="flex items-center gap-2.5 pb-4 border-b border-[#F7D6DF]/60">
          <div className="w-9 h-9 rounded-xl bg-[#FDF2F5] text-[#9E3F5C] border border-[#F7D6DF] flex items-center justify-center shadow-xs">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-sans text-base font-bold text-[#2B2225]">
              Profile Information & Login Email
            </h3>
            <p className="text-xs text-[#5A4B50]">
              Changes made here update your public administrative name and the email address used to log into this portal.
            </p>
          </div>
        </div>

        {profileError && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold rounded-2xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{profileError}</span>
          </div>
        )}

        {profileSuccess && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-2xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{profileSuccess}</span>
          </div>
        )}

        <form onSubmit={handleSaveProfileSubmit} className="space-y-6">
          
          {/* Avatar Photo Section */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 p-4 rounded-3xl bg-[#FFF9F5] border border-[#F7D6DF]">
            <div className="relative group">
              {avatarPreview ? (
                <img 
                  src={avatarPreview} 
                  alt="Admin Avatar" 
                  className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-pink-glow"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-[#9E3F5C] text-white flex items-center justify-center font-bold text-2xl border-4 border-white shadow-pink-glow">
                  {name ? name.slice(0, 2).toUpperCase() : 'AD'}
                </div>
              )}

              <button
                type="button"
                onClick={() => avatarInputRef.current?.click()}
                className="absolute bottom-0 right-0 p-2 rounded-full bg-[#2B2225] text-white hover:bg-[#9E3F5C] border-2 border-white shadow-md transition-all cursor-pointer"
                title="Change Photo"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2 text-center sm:text-left flex-1">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#2B2225]">
                Administrator Profile Picture
              </h4>
              <p className="text-xs text-[#5A4B50]">
                Upload an official profile image. It will be displayed in the top navigation bar and throughout the management console.
              </p>

              <input 
                type="file"
                ref={avatarInputRef}
                onChange={handleAvatarFileChange}
                accept="image/*"
                className="hidden"
              />

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => avatarInputRef.current?.click()}
                  className="px-4 py-2 rounded-xl bg-white border border-[#F7D6DF] hover:bg-[#FDF2F5] text-xs font-bold text-[#9E3F5C] transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Image</span>
                </button>

                {avatarPreview && (
                  <button
                    type="button"
                    onClick={handleRemoveAvatar}
                    className="px-3 py-2 rounded-xl bg-white border border-rose-200 hover:bg-rose-50 text-xs font-bold text-rose-600 transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Form Input Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div className="space-y-1.5 text-left">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#2B2225]">
                Administrator Full Name *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-[#A09095] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input 
                  type="text"
                  required
                  placeholder="e.g. Super Admin"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#FFF9F5] border border-[#F7D6DF] text-xs text-[#2B2225] font-semibold focus:outline-none focus:border-[#9E3F5C] focus:bg-white transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5 text-left">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#2B2225]">
                Login Email Address *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#A09095] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input 
                  type="email"
                  required
                  placeholder="admin@missnous.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#FFF9F5] border border-[#F7D6DF] text-xs text-[#2B2225] font-semibold focus:outline-none focus:border-[#9E3F5C] focus:bg-white transition-all"
                />
              </div>
              <p className="text-[10px] text-[#A09095]">
                ⚠️ When changed, you will use this new email address to log in.
              </p>
            </div>

            <div className="space-y-1.5 text-left">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#2B2225]">
                Contact Phone Number
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-[#A09095] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input 
                  type="tel"
                  placeholder="+92 300 1234567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#FFF9F5] border border-[#F7D6DF] text-xs text-[#2B2225] font-semibold focus:outline-none focus:border-[#9E3F5C] focus:bg-white transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5 text-left">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#2B2225]">
                Assigned System Role
              </label>
              <input 
                type="text"
                disabled
                value="Super Admin (Root Authority)"
                className="w-full px-4 py-2.5 rounded-2xl bg-[#FDF2F5] border border-[#F7D6DF] text-xs text-[#9E3F5C] font-bold cursor-not-allowed select-none"
              />
            </div>

          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={profileSaving}
              className="px-6 py-3 rounded-full bg-[#9E3F5C] hover:bg-[#7C2F47] text-white font-sans text-xs font-bold uppercase tracking-wider shadow-pink-glow transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{profileSaving ? 'Saving Profile...' : 'Save Profile Details'}</span>
            </button>
          </div>

        </form>
      </div>

      {/* ─── SECTION 2: Change Security Password ─── */}
      <div className="bg-white border border-[#F7D6DF] rounded-[2.5rem] p-6 sm:p-8 shadow-luxury space-y-6">
        
        <div className="flex items-center gap-2.5 pb-4 border-b border-[#F7D6DF]/60">
          <div className="w-9 h-9 rounded-xl bg-[#FDF2F5] text-[#9E3F5C] border border-[#F7D6DF] flex items-center justify-center shadow-xs">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-sans text-base font-bold text-[#2B2225]">
              Change Security Password
            </h3>
            <p className="text-xs text-[#5A4B50]">
              Update your administrator access password to keep your portal encrypted and secure.
            </p>
          </div>
        </div>

        {passwordError && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold rounded-2xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{passwordError}</span>
          </div>
        )}

        {passwordSuccess && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-2xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{passwordSuccess}</span>
          </div>
        )}

        <form onSubmit={handleChangePasswordSubmit} className="space-y-4">
          
          <div className="space-y-1.5 text-left">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#2B2225]">
              Current Admin Password *
            </label>
            <div className="relative">
              <input 
                type={showCurrentPass ? "text" : "password"}
                required
                placeholder="Enter current password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-4 py-2.5 pr-10 rounded-2xl bg-[#FFF9F5] border border-[#F7D6DF] text-xs text-[#2B2225] font-semibold focus:outline-none focus:border-[#9E3F5C] focus:bg-white transition-all"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPass(!showCurrentPass)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#A09095] hover:text-[#2B2225] cursor-pointer"
              >
                {showCurrentPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div className="space-y-1.5 text-left">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#2B2225]">
                New Password * (Min 8 Characters)
              </label>
              <div className="relative">
                <input 
                  type={showNewPass ? "text" : "password"}
                  required
                  placeholder="Enter new strong password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2.5 pr-10 rounded-2xl bg-[#FFF9F5] border border-[#F7D6DF] text-xs text-[#2B2225] font-semibold focus:outline-none focus:border-[#9E3F5C] focus:bg-white transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPass(!showNewPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#A09095] hover:text-[#2B2225] cursor-pointer"
                >
                  {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-1.5 text-left">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#2B2225]">
                Confirm New Password *
              </label>
              <div className="relative">
                <input 
                  type={showConfirmPass ? "text" : "password"}
                  required
                  placeholder="Re-enter new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2.5 pr-10 rounded-2xl bg-[#FFF9F5] border border-[#F7D6DF] text-xs text-[#2B2225] font-semibold focus:outline-none focus:border-[#9E3F5C] focus:bg-white transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPass(!showConfirmPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#A09095] hover:text-[#2B2225] cursor-pointer"
                >
                  {showConfirmPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={passwordSaving}
              className="px-6 py-3 rounded-full bg-[#2B2225] hover:bg-[#9E3F5C] text-white font-sans text-xs font-bold uppercase tracking-wider shadow-md transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{passwordSaving ? 'Updating Password...' : 'Update Password'}</span>
            </button>
          </div>

        </form>
      </div>

    </div>
  );
}
