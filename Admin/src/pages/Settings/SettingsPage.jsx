import React, { useState } from 'react';
import { ShieldCheck, Lock, CheckCircle2 } from 'lucide-react';

export default function SettingsPage({ currentUser, onUpdateAdminPassword, showToast }) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordFormError, setPasswordFormError] = useState('');
  const [passwordSuccessMsg, setPasswordSuccessMsg] = useState('');

  const handleChangePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordFormError('');
    setPasswordSuccessMsg('');

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordFormError('Please fill in all password fields.');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordFormError('New password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordFormError('New password and confirm password do not match.');
      return;
    }

    try {
      if (onUpdateAdminPassword) {
        await onUpdateAdminPassword(currentPassword, newPassword);
      }
      setPasswordSuccessMsg('Admin password updated successfully!');
      if (showToast) showToast('Admin password updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setPasswordFormError(err.message || 'Failed to update password.');
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto animate-fade-in">
      
      {/* Admin Profile Overview */}
      <div className="bg-white border border-[#F7D6DF] rounded-[2rem] p-6 sm:p-8 shadow-luxury space-y-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-[#9E3F5C] text-white flex items-center justify-center font-bold border-2 border-[#F7D6DF] shadow-pink-glow">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <h2 className="font-sans text-xl font-bold text-[#2B2225]">{currentUser?.name || 'Store Administrator'}</h2>
            <p className="text-xs text-[#5A4B50]">{currentUser?.email || 'admin@missnous.com'} • System Role: Super Admin</p>
          </div>
        </div>

        <div className="pt-4 border-t border-[#F7D6DF]/60 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="bg-[#FFF9F5] p-3.5 rounded-2xl border border-[#F7D6DF]">
            <span className="text-[#A09095] uppercase font-bold text-[10px]">Access Privileges</span>
            <p className="font-bold text-[#9E3F5C] mt-0.5">Full Catalog & Order Control</p>
          </div>
          <div className="bg-[#FFF9F5] p-3.5 rounded-2xl border border-[#F7D6DF]">
            <span className="text-[#A09095] uppercase font-bold text-[10px]">Portal Security</span>
            <p className="font-bold text-[#9E3F5C] mt-0.5">Role Protected (Encrypted Session)</p>
          </div>
        </div>
      </div>

      {/* Change Password Form */}
      <div className="bg-white border border-[#F7D6DF] rounded-[2rem] p-6 sm:p-8 shadow-luxury space-y-6">
        <div className="space-y-1">
          <h3 className="font-sans text-lg font-bold text-[#2B2225] flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#9E3F5C]" />
            <span>Change Security Password</span>
          </h3>
          <p className="text-xs text-[#5A4B50]">Update your administrator password for security</p>
        </div>

        {passwordFormError && (
          <div className="p-3 bg-[#FDF2F5] border border-[#F7D6DF] text-[#9E3F5C] text-xs font-bold rounded-2xl text-center">
            {passwordFormError}
          </div>
        )}

        {passwordSuccessMsg && (
          <div className="p-3 bg-[#FDF2F5] border border-[#F7D6DF] text-[#9E3F5C] text-xs font-bold rounded-2xl text-center flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#9E3F5C]" />
            <span>{passwordSuccessMsg}</span>
          </div>
        )}

        <form onSubmit={handleChangePasswordSubmit} className="space-y-4">
          <div className="space-y-1 text-left">
            <label className="block text-xs font-semibold uppercase text-[#2B2225]">Current Admin Password *</label>
            <input 
              type="password"
              required
              placeholder="••••••••"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl bg-[#FFF9F5] border border-[#F7D6DF] text-xs text-[#2B2225] focus:outline-none focus:border-[#9E3F5C]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1 text-left">
              <label className="block text-xs font-semibold uppercase text-[#2B2225]">New Password *</label>
              <input 
                type="password"
                required
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl bg-[#FFF9F5] border border-[#F7D6DF] text-xs text-[#2B2225] focus:outline-none focus:border-[#9E3F5C]"
              />
            </div>

            <div className="space-y-1 text-left">
              <label className="block text-xs font-semibold uppercase text-[#2B2225]">Confirm New Password *</label>
              <input 
                type="password"
                required
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl bg-[#FFF9F5] border border-[#F7D6DF] text-xs text-[#2B2225] focus:outline-none focus:border-[#9E3F5C]"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-6 py-3 rounded-full bg-[#9E3F5C] hover:bg-[#7C2F47] text-white font-sans text-xs font-bold uppercase tracking-wider shadow-pink-glow transition-all cursor-pointer"
            >
              Update Password
            </button>
          </div>
        </form>
      </div>

    </div>
  );
}
