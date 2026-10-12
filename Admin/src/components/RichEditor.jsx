import React, { useRef, useEffect } from 'react';
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Heading2,
  Heading3,
  Link as LinkIcon,
  Quote,
  Undo,
  Redo,
  Image as ImageIcon
} from 'lucide-react';
import { compressImage } from '../utils/imageCompressor';

export default function RichEditor({
  value = '',
  onChange,
  placeholder = 'Write article content here...',
  minHeight = '320px'
}) {
  const editorRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (editorRef.current && document.activeElement !== editorRef.current) {
      if (editorRef.current.innerHTML !== (value || '')) {
        editorRef.current.innerHTML = value || '';
      }
    }
  }, [value]);

  const execCommand = (command, arg = null) => {
    document.execCommand(command, false, arg);
    if (editorRef.current && onChange) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleLink = () => {
    const url = prompt('Enter link URL (e.g. https://missnous.com):');
    if (url) {
      execCommand('createLink', url);
    }
  };

  const handleInlineImage = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const base64 = await compressImage(file, 1000, 1000, 0.7);
      execCommand('insertImage', base64);
    } catch (err) {
      console.error('Image insert error:', err);
    } finally {
      e.target.value = '';
    }
  };

  return (
    <div className="rounded-2xl border border-[#F7D6DF] overflow-hidden bg-white shadow-xs focus-within:border-[#9E3F5C] focus-within:ring-2 focus-within:ring-[#9E3F5C]/15 transition-all">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 bg-[#FDF2F5] border-b border-[#F7D6DF] text-[#2B2225]">
        <button
          type="button"
          onClick={() => execCommand('bold')}
          className="p-1.5 rounded-lg hover:bg-white hover:text-[#9E3F5C] transition-colors"
          title="Bold (Ctrl+B)"
        >
          <Bold className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => execCommand('italic')}
          className="p-1.5 rounded-lg hover:bg-white hover:text-[#9E3F5C] transition-colors"
          title="Italic (Ctrl+I)"
        >
          <Italic className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => execCommand('underline')}
          className="p-1.5 rounded-lg hover:bg-white hover:text-[#9E3F5C] transition-colors"
          title="Underline (Ctrl+U)"
        >
          <Underline className="w-4 h-4" />
        </button>

        <div className="w-px h-5 bg-[#F7D6DF] mx-1"></div>

        <button
          type="button"
          onClick={() => execCommand('formatBlock', '<h2>')}
          className="p-1.5 rounded-lg hover:bg-white hover:text-[#9E3F5C] transition-colors"
          title="Heading 2"
        >
          <Heading2 className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => execCommand('formatBlock', '<h3>')}
          className="p-1.5 rounded-lg hover:bg-white hover:text-[#9E3F5C] transition-colors"
          title="Heading 3"
        >
          <Heading3 className="w-4 h-4" />
        </button>

        <div className="w-px h-5 bg-[#F7D6DF] mx-1"></div>

        <button
          type="button"
          onClick={() => execCommand('insertUnorderedList')}
          className="p-1.5 rounded-lg hover:bg-white hover:text-[#9E3F5C] transition-colors"
          title="Bullet List"
        >
          <List className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => execCommand('insertOrderedList')}
          className="p-1.5 rounded-lg hover:bg-white hover:text-[#9E3F5C] transition-colors"
          title="Numbered List"
        >
          <ListOrdered className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => execCommand('formatBlock', '<blockquote>')}
          className="p-1.5 rounded-lg hover:bg-white hover:text-[#9E3F5C] transition-colors"
          title="Quote"
        >
          <Quote className="w-4 h-4" />
        </button>

        <div className="w-px h-5 bg-[#F7D6DF] mx-1"></div>

        <button
          type="button"
          onClick={handleLink}
          className="p-1.5 rounded-lg hover:bg-white hover:text-[#9E3F5C] transition-colors"
          title="Insert Link"
        >
          <LinkIcon className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="p-1.5 rounded-lg hover:bg-white hover:text-[#9E3F5C] transition-colors"
          title="Insert Inline Image"
        >
          <ImageIcon className="w-4 h-4" />
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleInlineImage}
        />

        <div className="w-px h-5 bg-[#F7D6DF] mx-1"></div>

        <button
          type="button"
          onClick={() => execCommand('undo')}
          className="p-1.5 rounded-lg hover:bg-white hover:text-[#9E3F5C] transition-colors"
          title="Undo"
        >
          <Undo className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => execCommand('redo')}
          className="p-1.5 rounded-lg hover:bg-white hover:text-[#9E3F5C] transition-colors"
          title="Redo"
        >
          <Redo className="w-4 h-4" />
        </button>
      </div>

      {/* Editable Body */}
      <div
        ref={editorRef}
        contentEditable
        onInput={() => onChange && onChange(editorRef.current.innerHTML)}
        style={{ minHeight }}
        data-placeholder={placeholder}
        className="p-4 sm:p-5 text-[#2B2225] font-sans text-sm sm:text-base leading-relaxed focus:outline-none overflow-y-auto max-h-[600px] prose prose-rose max-w-none"
      />
    </div>
  );
}
