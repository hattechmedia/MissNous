import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Heading2,
  Heading3,
  Heading4,
  List,
  ListOrdered,
  Quote,
  Link as LinkIcon,
  Image as ImageIcon,
  Undo,
  Redo,
  RemoveFormatting,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Type,
  Sparkles
} from 'lucide-react';
import { compressImage } from '../utils/imageCompressor';

const BLOCK_OPTIONS = [
  { value: 'p', label: 'Paragraph (P)', tagDisplay: 'P' },
  { value: 'h1', label: 'Heading 1 (H1)', tagDisplay: 'H1' },
  { value: 'h2', label: 'Heading 2 (H2)', tagDisplay: 'H2' },
  { value: 'h3', label: 'Heading 3 (H3)', tagDisplay: 'H3' },
  { value: 'h4', label: 'Heading 4 (H4)', tagDisplay: 'H4' },
  { value: 'blockquote', label: 'Quote Box', tagDisplay: 'QUOTE' }
];

const FONT_SIZES = [
  { value: '2', label: 'Small (13px)' },
  { value: '3', label: 'Normal (16px)' },
  { value: '4', label: 'Medium (18px)' },
  { value: '5', label: 'Large (24px)' },
  { value: '6', label: 'Extra Large (32px)' },
  { value: '7', label: 'Huge (40px)' }
];

export default function RichEditor({
  value = '',
  onChange,
  placeholder = 'Write your article here...',
  minHeight = '360px'
}) {
  const editorRef = useRef(null);
  const fileInputRef = useRef(null);
  const savedRangeRef = useRef(null);

  // Formatting state
  const [currentBlock, setCurrentBlock] = useState('p');
  const [currentFontSize, setCurrentFontSize] = useState('3');
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrike, setIsStrike] = useState(false);
  const [isListUl, setIsListUl] = useState(false);
  const [isListOl, setIsListOl] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);

  // Sync incoming value to editor contentEditable
  useEffect(() => {
    if (editorRef.current) {
      const currentHtml = editorRef.current.innerHTML;
      const targetHtml = value || '';
      if (currentHtml !== targetHtml) {
        if (!currentHtml || document.activeElement !== editorRef.current) {
          editorRef.current.innerHTML = targetHtml;
        }
      }
    }
  }, [value]);

  // Save current selection range so buttons/prompts never drop cursor
  const saveSelection = useCallback(() => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0 && editorRef.current) {
      const node = sel.anchorNode;
      if (node && editorRef.current.contains(node)) {
        savedRangeRef.current = sel.getRangeAt(0).cloneRange();
      }
    }
  }, []);

  // Restore saved selection
  const restoreSelection = useCallback(() => {
    if (savedRangeRef.current && editorRef.current) {
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(savedRangeRef.current);
    }
  }, []);

  // Detect selection format, block tag, active styles, and text stats
  const detectSelection = useCallback(() => {
    if (!editorRef.current) return;

    // Word & char count
    const text = editorRef.current.innerText || '';
    setCharCount(text.length);
    const words = text.trim() ? text.trim().split(/\s+/).filter(Boolean).length : 0;
    setWordCount(words);

    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;

    const node = sel.anchorNode;
    if (!node || !editorRef.current.contains(node)) return;

    // Save range
    saveSelection();

    // Determine enclosing block tag
    let block = 'p';
    let el = node.nodeType === 3 ? node.parentElement : node;
    while (el && el !== editorRef.current) {
      const tag = el.tagName ? el.tagName.toLowerCase() : '';
      if (['h1', 'h2', 'h3', 'h4', 'blockquote', 'p', 'pre', 'ul', 'ol', 'li'].includes(tag)) {
        if (tag === 'li') {
          block = el.parentElement?.tagName.toLowerCase() || 'ul';
        } else {
          block = tag;
        }
        break;
      }
      el = el.parentElement;
    }
    setCurrentBlock(block);

    // Inline command states
    try {
      setIsBold(document.queryCommandState('bold'));
      setIsItalic(document.queryCommandState('italic'));
      setIsUnderline(document.queryCommandState('underline'));
      setIsStrike(document.queryCommandState('strikeThrough'));
      setIsListUl(document.queryCommandState('insertUnorderedList'));
      setIsListOl(document.queryCommandState('insertOrderedList'));
    } catch (e) {}
  }, [saveSelection]);

  // Document-level selectionchange listener
  useEffect(() => {
    const handleSelectionChange = () => {
      detectSelection();
    };
    document.addEventListener('selectionchange', handleSelectionChange);
    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange);
    };
  }, [detectSelection]);

  // Central command executor with focus retention
  const execCommand = (command, arg = null) => {
    if (!editorRef.current) return;
    editorRef.current.focus();
    restoreSelection();

    try {
      document.execCommand(command, false, arg);
    } catch (err) {
      console.warn('execCommand warning:', err);
    }

    if (onChange) {
      onChange(editorRef.current.innerHTML);
    }
    saveSelection();
    detectSelection();
  };

  // Apply Block Format (Paragraph, Heading 1, 2, 3, 4, Quote)
  const applyBlockFormat = (tag) => {
    if (!editorRef.current) return;
    editorRef.current.focus();
    restoreSelection();

    let executed = false;
    try {
      executed = document.execCommand('formatBlock', false, `<${tag}>`);
    } catch (e) {}

    if (!executed) {
      try {
        executed = document.execCommand('formatBlock', false, tag);
      } catch (e) {}
    }

    setCurrentBlock(tag);
    if (onChange) {
      onChange(editorRef.current.innerHTML);
    }
    saveSelection();
    detectSelection();
  };

  // Apply Font Size
  const applyFontSize = (size) => {
    if (!editorRef.current) return;
    editorRef.current.focus();
    restoreSelection();

    execCommand('fontSize', size);
    setCurrentFontSize(size);
  };

  // Insert Link
  const handleLink = () => {
    saveSelection();
    const url = prompt('Enter link URL (e.g. https://missnous.com):');
    if (url) {
      restoreSelection();
      execCommand('createLink', url);
    }
  };

  // Insert Inline Image
  const handleInlineImage = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const base64 = await compressImage(file, 1200, 1200, 0.75);
      restoreSelection();
      execCommand('insertImage', base64);
    } catch (err) {
      console.error('Image insert error:', err);
    } finally {
      e.target.value = '';
    }
  };

  const currentBlockLabel = BLOCK_OPTIONS.find(b => b.value === currentBlock)?.label || 'Paragraph (P)';
  const currentBlockTag = (BLOCK_OPTIONS.find(b => b.value === currentBlock)?.tagDisplay || currentBlock).toUpperCase();

  return (
    <div className="rounded-2xl border border-[#F7D6DF] overflow-hidden bg-white shadow-xs focus-within:border-[#9E3F5C] focus-within:ring-2 focus-within:ring-[#9E3F5C]/15 transition-all">
      {/* ─── Top Inspector & Control Bar ─── */}
      <div className="p-2 sm:p-2.5 bg-[#FFF9F5] border-b border-[#F7D6DF] flex flex-wrap items-center justify-between gap-2 text-xs">
        {/* Left: Active Format Badge & Block Selector */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Live Block Format Badge */}
          <div
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#9E3F5C] text-white font-mono text-[11px] font-bold shadow-xs select-none"
            title="Current Selected Element Tag"
          >
            <Sparkles className="w-3 h-3 text-rose-200" />
            <span>FORMAT: &lt;{currentBlockTag}&gt;</span>
          </div>

          {/* Block Selector Dropdown */}
          <div className="relative">
            <select
              value={['p', 'h1', 'h2', 'h3', 'h4', 'blockquote'].includes(currentBlock) ? currentBlock : 'p'}
              onChange={(e) => applyBlockFormat(e.target.value)}
              onMouseDown={saveSelection}
              className="px-2.5 py-1 pr-6 rounded-lg bg-white border border-[#F7D6DF] text-[#2B2225] font-semibold text-xs focus:outline-none focus:border-[#9E3F5C] cursor-pointer hover:bg-[#FDF2F5] transition-colors"
              title="Change Text Block Type"
            >
              {BLOCK_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Font Size Selector */}
          <div className="flex items-center gap-1">
            <Type className="w-3.5 h-3.5 text-[#9E3F5C]" />
            <select
              value={currentFontSize}
              onChange={(e) => applyFontSize(e.target.value)}
              onMouseDown={saveSelection}
              className="px-2 py-1 pr-6 rounded-lg bg-white border border-[#F7D6DF] text-[#2B2225] text-xs font-medium focus:outline-none focus:border-[#9E3F5C] cursor-pointer hover:bg-[#FDF2F5] transition-colors"
              title="Font Size"
            >
              {FONT_SIZES.map(s => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Right: Word & Character Count */}
        <div className="flex items-center gap-3 text-[11px] text-[#A09095]">
          <span><strong className="text-[#2B2225]">{wordCount}</strong> words</span>
          <span>•</span>
          <span><strong className="text-[#2B2225]">{charCount}</strong> chars</span>
        </div>
      </div>

      {/* ─── Main Action Toolbar (Buttons with onMouseDown e.preventDefault to keep focus) ─── */}
      <div className="flex flex-wrap items-center gap-1 p-2 bg-[#FDF2F5] border-b border-[#F7D6DF] text-[#2B2225]">
        {/* Bold */}
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            execCommand('bold');
          }}
          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
            isBold ? 'bg-[#9E3F5C] text-white shadow-xs' : 'hover:bg-white text-[#2B2225] hover:text-[#9E3F5C]'
          }`}
          title="Bold (Ctrl+B)"
        >
          <Bold className="w-4 h-4" />
        </button>

        {/* Italic */}
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            execCommand('italic');
          }}
          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
            isItalic ? 'bg-[#9E3F5C] text-white shadow-xs' : 'hover:bg-white text-[#2B2225] hover:text-[#9E3F5C]'
          }`}
          title="Italic (Ctrl+I)"
        >
          <Italic className="w-4 h-4" />
        </button>

        {/* Underline */}
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            execCommand('underline');
          }}
          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
            isUnderline ? 'bg-[#9E3F5C] text-white shadow-xs' : 'hover:bg-white text-[#2B2225] hover:text-[#9E3F5C]'
          }`}
          title="Underline (Ctrl+U)"
        >
          <Underline className="w-4 h-4" />
        </button>

        {/* Strikethrough */}
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            execCommand('strikeThrough');
          }}
          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
            isStrike ? 'bg-[#9E3F5C] text-white shadow-xs' : 'hover:bg-white text-[#2B2225] hover:text-[#9E3F5C]'
          }`}
          title="Strikethrough"
        >
          <Strikethrough className="w-4 h-4" />
        </button>

        <div className="w-px h-5 bg-[#F7D6DF] mx-1"></div>

        {/* Quick Heading 2 */}
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            applyBlockFormat(currentBlock === 'h2' ? 'p' : 'h2');
          }}
          className={`p-1.5 rounded-lg font-bold text-xs transition-colors cursor-pointer flex items-center gap-1 ${
            currentBlock === 'h2' ? 'bg-[#9E3F5C] text-white shadow-xs' : 'hover:bg-white text-[#2B2225] hover:text-[#9E3F5C]'
          }`}
          title="Heading 2 (Click to toggle)"
        >
          <Heading2 className="w-4 h-4" />
        </button>

        {/* Quick Heading 3 */}
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            applyBlockFormat(currentBlock === 'h3' ? 'p' : 'h3');
          }}
          className={`p-1.5 rounded-lg font-bold text-xs transition-colors cursor-pointer flex items-center gap-1 ${
            currentBlock === 'h3' ? 'bg-[#9E3F5C] text-white shadow-xs' : 'hover:bg-white text-[#2B2225] hover:text-[#9E3F5C]'
          }`}
          title="Heading 3 (Click to toggle)"
        >
          <Heading3 className="w-4 h-4" />
        </button>

        {/* Quick Heading 4 */}
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            applyBlockFormat(currentBlock === 'h4' ? 'p' : 'h4');
          }}
          className={`p-1.5 rounded-lg font-bold text-xs transition-colors cursor-pointer flex items-center gap-1 ${
            currentBlock === 'h4' ? 'bg-[#9E3F5C] text-white shadow-xs' : 'hover:bg-white text-[#2B2225] hover:text-[#9E3F5C]'
          }`}
          title="Heading 4 (Click to toggle)"
        >
          <Heading4 className="w-4 h-4" />
        </button>

        <div className="w-px h-5 bg-[#F7D6DF] mx-1"></div>

        {/* Bullet List */}
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            execCommand('insertUnorderedList');
          }}
          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
            isListUl ? 'bg-[#9E3F5C] text-white shadow-xs' : 'hover:bg-white text-[#2B2225] hover:text-[#9E3F5C]'
          }`}
          title="Bullet List"
        >
          <List className="w-4 h-4" />
        </button>

        {/* Numbered List */}
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            execCommand('insertOrderedList');
          }}
          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
            isListOl ? 'bg-[#9E3F5C] text-white shadow-xs' : 'hover:bg-white text-[#2B2225] hover:text-[#9E3F5C]'
          }`}
          title="Numbered List"
        >
          <ListOrdered className="w-4 h-4" />
        </button>

        {/* Quote */}
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            applyBlockFormat(currentBlock === 'blockquote' ? 'p' : 'blockquote');
          }}
          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
            currentBlock === 'blockquote' ? 'bg-[#9E3F5C] text-white shadow-xs' : 'hover:bg-white text-[#2B2225] hover:text-[#9E3F5C]'
          }`}
          title="Quote Block"
        >
          <Quote className="w-4 h-4" />
        </button>

        <div className="w-px h-5 bg-[#F7D6DF] mx-1"></div>

        {/* Alignment */}
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            execCommand('justifyLeft');
          }}
          className="p-1.5 rounded-lg hover:bg-white hover:text-[#9E3F5C] transition-colors cursor-pointer"
          title="Align Left"
        >
          <AlignLeft className="w-4 h-4" />
        </button>

        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            execCommand('justifyCenter');
          }}
          className="p-1.5 rounded-lg hover:bg-white hover:text-[#9E3F5C] transition-colors cursor-pointer"
          title="Align Center"
        >
          <AlignCenter className="w-4 h-4" />
        </button>

        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            execCommand('justifyRight');
          }}
          className="p-1.5 rounded-lg hover:bg-white hover:text-[#9E3F5C] transition-colors cursor-pointer"
          title="Align Right"
        >
          <AlignRight className="w-4 h-4" />
        </button>

        <div className="w-px h-5 bg-[#F7D6DF] mx-1"></div>

        {/* Link */}
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            handleLink();
          }}
          className="p-1.5 rounded-lg hover:bg-white hover:text-[#9E3F5C] transition-colors cursor-pointer"
          title="Insert Link"
        >
          <LinkIcon className="w-4 h-4" />
        </button>

        {/* Inline Image */}
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            saveSelection();
            fileInputRef.current?.click();
          }}
          className="p-1.5 rounded-lg hover:bg-white hover:text-[#9E3F5C] transition-colors cursor-pointer"
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

        {/* Remove Formatting */}
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            execCommand('removeFormat');
          }}
          className="p-1.5 rounded-lg hover:bg-white hover:text-[#9E3F5C] transition-colors cursor-pointer"
          title="Clear Formatting"
        >
          <RemoveFormatting className="w-4 h-4" />
        </button>

        <div className="w-px h-5 bg-[#F7D6DF] mx-1"></div>

        {/* Undo */}
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            execCommand('undo');
          }}
          className="p-1.5 rounded-lg hover:bg-white hover:text-[#9E3F5C] transition-colors cursor-pointer"
          title="Undo (Ctrl+Z)"
        >
          <Undo className="w-4 h-4" />
        </button>

        {/* Redo */}
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            execCommand('redo');
          }}
          className="p-1.5 rounded-lg hover:bg-white hover:text-[#9E3F5C] transition-colors cursor-pointer"
          title="Redo (Ctrl+Y)"
        >
          <Redo className="w-4 h-4" />
        </button>
      </div>

      {/* ─── Editable Article Body ─── */}
      <div
        ref={editorRef}
        contentEditable
        onInput={() => {
          detectSelection();
          if (onChange && editorRef.current) {
            onChange(editorRef.current.innerHTML);
          }
        }}
        onKeyUp={detectSelection}
        onMouseUp={detectSelection}
        onClick={detectSelection}
        onFocus={detectSelection}
        style={{ minHeight }}
        data-placeholder={placeholder}
        className="p-4 sm:p-6 text-[#2B2225] font-sans text-sm sm:text-base leading-relaxed focus:outline-none overflow-y-auto max-h-[620px]
          [&_h1]:text-2xl sm:[&_h1]:text-3xl [&_h1]:font-bold [&_h1]:text-[#2B2225] [&_h1]:mt-6 [&_h1]:mb-3
          [&_h2]:text-xl sm:[&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-[#2B2225] [&_h2]:mt-5 [&_h2]:mb-2.5
          [&_h3]:text-lg sm:[&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-[#2B2225] [&_h3]:mt-4 [&_h3]:mb-2
          [&_h4]:text-base sm:[&_h4]:text-lg [&_h4]:font-bold [&_h4]:text-[#2B2225] [&_h4]:mt-3 [&_h4]:mb-1.5
          [&_p]:text-sm sm:[&_p]:text-base [&_p]:leading-relaxed [&_p]:mb-3.5 [&_p]:text-[#2B2225]
          [&_blockquote]:border-l-4 [&_blockquote]:border-[#9E3F5C] [&_blockquote]:pl-4 [&_blockquote]:py-2 [&_blockquote]:my-4 [&_blockquote]:bg-[#FDF2F5] [&_blockquote]:rounded-r-xl [&_blockquote]:italic [&_blockquote]:text-[#7A5B64]
          [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:my-3.5 [&_ul]:space-y-1.5
          [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:my-3.5 [&_ol]:space-y-1.5
          [&_li]:text-sm sm:[&_li]:text-base [&_li]:leading-relaxed
          [&_a]:text-[#9E3F5C] [&_a]:underline [&_a]:font-medium hover:[&_a]:text-[#7C2F47]
          [&_img]:max-w-full [&_img]:rounded-xl [&_img]:my-4 [&_img]:shadow-sm"
      />

      {/* ─── Bottom Status & Node Breadcrumb ─── */}
      <div className="px-4 py-2 bg-[#FFF9F5] border-t border-[#F7D6DF] flex flex-wrap items-center justify-between text-[11px] text-[#A09095]">
        <div className="flex items-center gap-2">
          <span>Active Block:</span>
          <span className="font-mono font-bold text-[#9E3F5C] bg-[#FDF2F5] px-2 py-0.5 rounded border border-[#F7D6DF]">
            &lt;{currentBlockTag}&gt; - {currentBlockLabel}
          </span>
        </div>
        <div className="text-[10px] text-[#A09095] hidden sm:block">
          Select any text to see or change its heading level & font size
        </div>
      </div>
    </div>
  );
}

