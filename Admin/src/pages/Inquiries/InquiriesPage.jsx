import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  MessageSquare,
  Search,
  Eye,
  Trash2,
  Mail,
  Phone,
  Clock,
  Calendar,
  CheckCircle2,
  AlertCircle,
  X,
  ExternalLink,
  Reply,
  Filter,
  User,
  Inbox
} from 'lucide-react';

export default function InquiriesPage({
  inquiries = [],
  onUpdateInquiryStatus,
  onDeleteInquiry,
  showToast
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  // Lock outer page scroll when modal is open
  useEffect(() => {
    if (selectedInquiry) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
    return () => document.body.classList.remove('modal-open');
  }, [selectedInquiry]);

  // Statistics
  const totalInquiries = inquiries.length;
  const unreadCount = inquiries.filter(i => i.status === 'Unread').length;
  const readCount = inquiries.filter(i => i.status === 'Read').length;
  const repliedCount = inquiries.filter(i => i.status === 'Replied').length;

  // Filtered inquiries list
  const filteredInquiries = inquiries.filter(item => {
    // Status filter
    if (statusFilter !== 'All' && item.status !== statusFilter) return false;

    // Search query
    const q = searchTerm.toLowerCase().trim();
    if (!q) return true;

    return (
      (item.name && item.name.toLowerCase().includes(q)) ||
      (item.email && item.email.toLowerCase().includes(q)) ||
      (item.phone && item.phone.toLowerCase().includes(q)) ||
      (item.subject && item.subject.toLowerCase().includes(q)) ||
      (item.message && item.message.toLowerCase().includes(q))
    );
  });

  const handleOpenDetail = (inquiry) => {
    setSelectedInquiry(inquiry);
    // If it was Unread, auto-mark as Read
    if (inquiry.status === 'Unread' && onUpdateInquiryStatus) {
      onUpdateInquiryStatus(inquiry._id, 'Read');
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    if (onUpdateInquiryStatus) {
      await onUpdateInquiryStatus(id, newStatus);
      if (selectedInquiry && selectedInquiry._id === id) {
        setSelectedInquiry(prev => ({ ...prev, status: newStatus }));
      }
      if (showToast) {
        showToast(`Query marked as ${newStatus}`);
      }
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this customer inquiry?')) return;
    try {
      setDeletingId(id);
      if (onDeleteInquiry) {
        await onDeleteInquiry(id);
        if (selectedInquiry && selectedInquiry._id === id) {
          setSelectedInquiry(null);
        }
        if (showToast) {
          showToast('Inquiry deleted successfully');
        }
      }
    } finally {
      setDeletingId(null);
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'Recent';
    try {
      const d = new Date(dateString);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return dateString;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Unread':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
            Unread
          </span>
        );
      case 'Replied':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Replied
          </span>
        );
      case 'Read':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
            Read
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 animate-fade-in font-sans">

      {/* 1. Header & Quick Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Stat */}
        <div className="bg-white border border-[#F7D6DF] rounded-3xl p-5 shadow-luxury flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#FDF2F5] text-[#9E3F5C] flex items-center justify-center">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-[#5A4B50] uppercase tracking-wider">Total Queries</p>
            <h3 className="text-2xl font-bold text-[#2B2225] mt-0.5">{totalInquiries}</h3>
          </div>
        </div>

        {/* Unread Stat */}
        <div className="bg-white border border-amber-200 rounded-3xl p-5 shadow-luxury flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-amber-800 uppercase tracking-wider">Unread Queries</p>
            <h3 className="text-2xl font-bold text-amber-900 mt-0.5">{unreadCount}</h3>
          </div>
        </div>

        {/* Replied Stat */}
        <div className="bg-white border border-emerald-200 rounded-3xl p-5 shadow-luxury flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">Replied</p>
            <h3 className="text-2xl font-bold text-emerald-900 mt-0.5">{repliedCount}</h3>
          </div>
        </div>

        {/* Read / Archived */}
        <div className="bg-white border border-[#F7D6DF] rounded-3xl p-5 shadow-luxury flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#FFF9F5] text-[#5A4B50] flex items-center justify-center">
            <Inbox className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-[#5A4B50] uppercase tracking-wider">Reviewed</p>
            <h3 className="text-2xl font-bold text-[#2B2225] mt-0.5">{readCount}</h3>
          </div>
        </div>

      </div>

      {/* 2. Main Inquiries Management Card */}
      <div className="bg-white border border-[#F7D6DF] rounded-[2rem] p-6 sm:p-8 shadow-luxury space-y-6">
        
        {/* Top Control Bar: Search & Status Filter Pills */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#F7D6DF]/60 pb-6">
          <div>
            <h2 className="font-sans text-2xl font-bold text-[#2B2225]">Contact Form Queries</h2>
            <p className="text-xs text-[#5A4B50] mt-0.5">Inquiries submitted by customers via MissNous Contact Page</p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            
            {/* Search Input */}
            <div className="relative min-w-[240px]">
              <Search className="w-4 h-4 text-[#A09095] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search name, email, query..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-full bg-[#FFF9F5] border border-[#F7D6DF] text-xs text-[#2B2225] placeholder-[#A09095] focus:outline-none focus:border-[#9E3F5C] focus:ring-2 focus:ring-[#9E3F5C]/20 transition-all font-medium"
              />
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 p-1 bg-[#FFF9F5] border border-[#F7D6DF] rounded-full overflow-x-auto no-scrollbar">
              {['All', 'Unread', 'Read', 'Replied'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setStatusFilter(tab)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    statusFilter === tab
                      ? 'bg-[#9E3F5C] text-white shadow-xs'
                      : 'text-[#5A4B50] hover:text-[#2B2225]'
                  }`}
                >
                  {tab}
                  {tab === 'Unread' && unreadCount > 0 && (
                    <span className="ml-1.5 px-1.5 py-0.2 bg-amber-400 text-[#2B2225] rounded-full text-[10px] font-bold">
                      {unreadCount}
                    </span>
                  )}
                </button>
              ))}
            </div>

          </div>
        </div>

        {/* 3. Inquiries Table / List View */}
        {filteredInquiries.length === 0 ? (
          <div className="text-center py-16 px-4 space-y-3 bg-[#FFF9F5] rounded-3xl border border-[#F7D6DF]/60">
            <div className="w-14 h-14 rounded-full bg-[#FDF2F5] text-[#9E3F5C] flex items-center justify-center mx-auto border border-[#F7D6DF]">
              <Inbox className="w-7 h-7" />
            </div>
            <h4 className="text-base font-bold text-[#2B2225]">No Inquiries Found</h4>
            <p className="text-xs text-[#5A4B50] max-w-sm mx-auto">
              {searchTerm
                ? `No contact queries match "${searchTerm}". Try another search term.`
                : 'There are no customer inquiries in this section.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto no-scrollbar -mx-6 sm:mx-0">
            <table className="w-full text-left border-collapse min-w-[750px]">
              <thead>
                <tr className="border-b border-[#F7D6DF] text-[11px] font-bold uppercase tracking-wider text-[#5A4B50]">
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Subject & Message</th>
                  <th className="py-3 px-4">Date & Time</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F7D6DF]/60 text-xs">
                {filteredInquiries.map((inquiry) => {
                  const isUnread = inquiry.status === 'Unread';
                  return (
                    <tr
                      key={inquiry._id}
                      className={`hover:bg-[#FFF9F5]/70 transition-colors group ${
                        isUnread ? 'bg-[#FDF2F5]/40 font-semibold' : ''
                      }`}
                    >
                      {/* Customer Info */}
                      <td className="py-4 px-4 align-top">
                        <div className="flex items-start gap-3">
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                            isUnread ? 'bg-[#9E3F5C] text-white shadow-pink-glow' : 'bg-[#FFF9F5] text-[#9E3F5C] border border-[#F7D6DF]'
                          }`}>
                            {(inquiry.name || 'C').charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-bold text-[#2B2225] flex items-center gap-1.5">
                              {inquiry.name}
                              {isUnread && (
                                <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0"></span>
                              )}
                            </div>
                            <div className="text-[11px] text-[#5A4B50] flex items-center gap-1 mt-0.5">
                              <Mail className="w-3 h-3 text-[#A09095]" />
                              <a
                                href={`mailto:${inquiry.email}`}
                                className="hover:text-[#9E3F5C] hover:underline"
                                onClick={(e) => e.stopPropagation()}
                              >
                                {inquiry.email}
                              </a>
                            </div>
                            {inquiry.phone && (
                              <div className="text-[11px] text-[#7A6B70] flex items-center gap-1 mt-0.5">
                                <Phone className="w-3 h-3 text-[#A09095]" />
                                <span>{inquiry.phone}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Subject & Snippet */}
                      <td className="py-4 px-4 align-top max-w-[320px]">
                        <p className="font-bold text-[#2B2225] truncate">
                          {inquiry.subject || 'General Inquiry'}
                        </p>
                        <p className="text-[11px] text-[#5A4B50] line-clamp-2 mt-0.5 font-normal leading-relaxed">
                          {inquiry.message}
                        </p>
                      </td>

                      {/* Date & Time */}
                      <td className="py-4 px-4 align-top whitespace-nowrap text-[#5A4B50]">
                        <div className="flex items-center gap-1 text-[11px]">
                          <Calendar className="w-3 h-3 text-[#A09095]" />
                          <span>{formatDateTime(inquiry.createdAt)}</span>
                        </div>
                      </td>

                      {/* Status Badge */}
                      <td className="py-4 px-4 align-top whitespace-nowrap">
                        {getStatusBadge(inquiry.status)}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 align-top text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          
                          {/* View Full Detail Button */}
                          <button
                            onClick={() => handleOpenDetail(inquiry)}
                            title="View Full Inquiry"
                            className="p-2 rounded-full bg-[#FFF9F5] hover:bg-[#FDF2F5] text-[#9E3F5C] border border-[#F7D6DF] transition-colors cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {/* Quick Mailto Reply */}
                          <a
                            href={`mailto:${inquiry.email}?subject=${encodeURIComponent('Re: ' + (inquiry.subject || 'Miss Nous Inquiry'))}`}
                            title="Reply via Email"
                            className="p-2 rounded-full bg-[#FFF9F5] hover:bg-emerald-50 text-emerald-700 border border-[#F7D6DF] transition-colors cursor-pointer"
                          >
                            <Reply className="w-3.5 h-3.5" />
                          </a>

                          {/* Delete Button */}
                          <button
                            onClick={() => handleDelete(inquiry._id)}
                            disabled={deletingId === inquiry._id}
                            title="Delete Inquiry"
                            className="p-2 rounded-full bg-[#FFF9F5] hover:bg-rose-50 text-rose-600 border border-[#F7D6DF] transition-colors cursor-pointer disabled:opacity-50"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>

                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

      </div>

      {/* 4. Full Inquiry Detail Modal */}
      {selectedInquiry && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2B2225]/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white border border-[#F7D6DF] rounded-[2.5rem] w-full max-w-2xl max-h-[90vh] overflow-y-auto no-scrollbar p-6 sm:p-8 shadow-2xl space-y-6 relative animate-scale-up">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-[#F7D6DF] pb-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#9E3F5C]">Customer Query Details</span>
                <h3 className="font-sans text-xl font-bold text-[#2B2225] mt-0.5">
                  {selectedInquiry.subject || 'Customer Inquiry'}
                </h3>
              </div>
              <button
                onClick={() => setSelectedInquiry(null)}
                className="p-2 rounded-full hover:bg-[#FDF2F5] text-[#5A4B50] hover:text-[#2B2225] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Customer Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#FFF9F5] p-5 rounded-3xl border border-[#F7D6DF]">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#A09095]">Customer Name</label>
                <p className="font-bold text-sm text-[#2B2225] mt-0.5">{selectedInquiry.name}</p>
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#A09095]">Email Address</label>
                <p className="font-bold text-sm text-[#9E3F5C] mt-0.5">
                  <a href={`mailto:${selectedInquiry.email}`} className="hover:underline">
                    {selectedInquiry.email}
                  </a>
                </p>
              </div>
              {selectedInquiry.phone && (
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#A09095]">Phone Number</label>
                  <p className="font-medium text-sm text-[#2B2225] mt-0.5">{selectedInquiry.phone}</p>
                </div>
              )}
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#A09095]">Received Date</label>
                <p className="font-medium text-sm text-[#5A4B50] mt-0.5">{formatDateTime(selectedInquiry.createdAt)}</p>
              </div>
            </div>

            {/* Message Body */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#2B2225]">Full Message</label>
              <div className="p-5 rounded-3xl bg-[#FDF2F5]/50 border border-[#F7D6DF] text-sm text-[#2B2225] leading-relaxed whitespace-pre-wrap font-medium">
                {selectedInquiry.message}
              </div>
            </div>

            {/* Status Update Buttons */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#2B2225]">Update Status</label>
              <div className="flex flex-wrap items-center gap-2">
                {['Unread', 'Read', 'Replied'].map((st) => (
                  <button
                    key={st}
                    onClick={() => handleStatusChange(selectedInquiry._id, st)}
                    className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                      selectedInquiry.status === st
                        ? 'bg-[#9E3F5C] text-white shadow-pink-glow'
                        : 'bg-[#FFF9F5] text-[#5A4B50] border border-[#F7D6DF] hover:border-[#9E3F5C]'
                    }`}
                  >
                    Mark as {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-[#F7D6DF]">
              <button
                onClick={() => handleDelete(selectedInquiry._id)}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 hover:text-rose-800 hover:underline cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete Inquiry</span>
              </button>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <a
                  href={`mailto:${selectedInquiry.email}?subject=${encodeURIComponent('Re: ' + (selectedInquiry.subject || 'Miss Nous Inquiry'))}&body=${encodeURIComponent('\n\n--- Original Inquiry ---\n' + selectedInquiry.message)}`}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#9E3F5C] hover:bg-[#7C2F47] text-white text-xs font-bold uppercase tracking-wider shadow-pink-glow transition-all cursor-pointer"
                >
                  <Reply className="w-4 h-4" />
                  <span>Reply via Email</span>
                </a>
                <button
                  onClick={() => setSelectedInquiry(null)}
                  className="px-5 py-3 rounded-full bg-[#FFF9F5] border border-[#F7D6DF] text-xs font-bold text-[#5A4B50] hover:text-[#2B2225] transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>

          </div>
        </div>,
        document.body
      )}

    </div>
  );
}
