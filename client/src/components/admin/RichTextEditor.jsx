import { useEffect, useRef, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';

// Controlled (value/onChange HTML string) rich text editor for blog post
// content. TipTap is headless -- it renders no UI of its own -- so the
// toolbar below is plain buttons styled with the site's existing
// .btn-ghost/.btn-sm classes rather than a bundled WYSIWYG's own look.
export default function RichTextEditor({ value, onChange, uploadEndpoint = '/blog-admin/uploads', api }) {
  const fileInputRef = useRef(null);
  const [linkPromptOpen, setLinkPromptOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  // 'visual' uses the TipTap toolbar; 'html' is a raw <textarea> for pasting
  // or writing arbitrary markup (tables, embeds, custom attributes) the
  // toolbar can't produce. Switching back to Visual re-parses that HTML
  // through TipTap's schema, so anything outside what the toolbar supports
  // gets normalized/dropped at that point -- same tradeoff as WordPress's
  // classic Visual/Text editor tabs.
  const [mode, setMode] = useState('visual');

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
      Image
    ],
    content: value || '',
    onUpdate: ({ editor: ed }) => onChange(ed.getHTML())
  });

  // Keeps the editor in sync when `value` changes from OUTSIDE it (e.g.
  // loading an existing post into the form via startEdit) without fighting
  // the editor's own state on every keystroke it generates itself.
  useEffect(() => {
    if (!editor) return;
    if (value !== editor.getHTML()) {
      editor.commands.setContent(value || '', false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor, value]);

  if (!editor) return null;

  function openLinkPrompt() {
    setLinkUrl(editor.getAttributes('link').href || '');
    setLinkPromptOpen(true);
  }

  function applyLink() {
    if (linkUrl) {
      editor.chain().focus().extendMarkRange('link').setLink({ href: linkUrl }).run();
    } else {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
    }
    setLinkPromptOpen(false);
  }

  async function handleImageSelect(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const result = await api.upload(uploadEndpoint, file);
      editor.chain().focus().setImage({ src: result.url }).run();
    } catch (err) {
      window.alert(err.message);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  }

  const btn = (active, onClick, label, title) => (
    <button
      type="button"
      className={`btn btn-ghost btn-sm rte-btn${active ? ' is-active' : ''}`}
      onClick={onClick}
      title={title || label}
    >
      {label}
    </button>
  );

  return (
    <div className="form-group">
      <label>Content <span className="req">*</span></label>
      <div className="rte">
        <div className="rte-toolbar">
          {btn(editor.isActive('bold'), () => editor.chain().focus().toggleBold().run(), 'B', 'Bold')}
          {btn(editor.isActive('italic'), () => editor.chain().focus().toggleItalic().run(), 'I', 'Italic')}
          {btn(editor.isActive('heading', { level: 2 }), () => editor.chain().focus().toggleHeading({ level: 2 }).run(), 'H2', 'Heading 2')}
          {btn(editor.isActive('heading', { level: 3 }), () => editor.chain().focus().toggleHeading({ level: 3 }).run(), 'H3', 'Heading 3')}
          {btn(editor.isActive('bulletList'), () => editor.chain().focus().toggleBulletList().run(), '•', 'Bullet List')}
          {btn(editor.isActive('orderedList'), () => editor.chain().focus().toggleOrderedList().run(), '1.', 'Numbered List')}
          {btn(editor.isActive('link'), openLinkPrompt, '🔗', 'Link')}
          {btn(false, () => fileInputRef.current?.click(), '🖼', uploading ? 'Uploading…' : 'Insert Image')}
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageSelect} disabled={uploading} style={{ display: 'none' }} />
          <span style={{ flex: 1 }} />
          {btn(mode === 'html', () => setMode((m) => (m === 'html' ? 'visual' : 'html')), '</>', mode === 'html' ? 'Back to Visual editor' : 'Edit raw HTML')}
        </div>

        {linkPromptOpen && (
          <div className="rte-link-prompt">
            <input
              type="text"
              placeholder="https://…"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              autoFocus
            />
            <button type="button" className="btn btn-accent btn-sm" onClick={applyLink}>Apply</button>
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => setLinkPromptOpen(false)}>Cancel</button>
          </div>
        )}

        {mode === 'html' ? (
          <textarea
            className="rte-html-source"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            spellCheck={false}
            placeholder="<p>Write or paste raw HTML here…</p>"
          />
        ) : (
          <EditorContent editor={editor} className="rte-content" />
        )}
      </div>
    </div>
  );
}
