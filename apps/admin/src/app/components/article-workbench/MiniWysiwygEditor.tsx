import { useCallback, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Highlight from '@tiptap/extension-highlight';
import {
  Bold,
  Italic,
  Highlighter,
  Link as LinkIcon,
  RemoveFormatting,
} from 'lucide-react';
import { useTheme } from '@/app/components/theme-provider';

interface MiniWysiwygEditorProps {
  value: string;
  onChange: (html: string) => void;
}

function ToolbarBtn({
  active,
  onClick,
  title,
  children,
}: {
  active?: boolean;
  onClick: () => void;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type='button'
      onClick={onClick}
      title={title}
      className={`p-1 rounded transition-colors cursor-pointer ${
        active
          ? 'bg-accent text-accent-foreground'
          : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
      }`}
    >
      {children}
    </button>
  );
}

export function MiniWysiwygEditor({ value, onChange }: MiniWysiwygEditorProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
        codeBlock: false,
        blockquote: false,
        bulletList: false,
        orderedList: false,
        listItem: false,
        horizontalRule: false,
        code: false,
      }),
      Link.configure({ openOnClick: false }),
      Highlight.configure({ HTMLAttributes: { class: '' } }),
    ],
    content: value,
    onUpdate: ({ editor: e }) => onChange(e.getHTML()),
    editorProps: {
      attributes: {
        class: 'mini-wysiwyg-content focus:outline-none h-full px-3 py-2',
      },
    },
  });

  // Sync external value changes
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value, false);
    }
  }, [value, editor]);

  const setLink = useCallback(() => {
    if (!editor) return;
    if (editor.isActive('link')) {
      editor.chain().focus().unsetLink().run();
      return;
    }
    const url = window.prompt('URL:');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  }, [editor]);

  if (!editor) return null;

  return (
    <div
      className={`mini-wysiwyg rounded-md border overflow-hidden h-full flex flex-col ${
        isDark ? 'mini-wysiwyg--dark' : 'mini-wysiwyg--light'
      }`}
    >
      <div className='flex items-center gap-0.5 px-2 py-1 border-b bg-muted/30'>
        <ToolbarBtn
          active={editor.isActive('bold')}
          onClick={() => editor.chain().focus().toggleBold().run()}
          title='Жирный'
        >
          <Bold className='size-3.5' />
        </ToolbarBtn>
        <ToolbarBtn
          active={editor.isActive('italic')}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          title='Курсив'
        >
          <Italic className='size-3.5' />
        </ToolbarBtn>
        <ToolbarBtn
          active={editor.isActive('highlight')}
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          title='Выделение (mark)'
        >
          <Highlighter className='size-3.5' />
        </ToolbarBtn>
        <ToolbarBtn
          active={editor.isActive('link')}
          onClick={setLink}
          title='Ссылка'
        >
          <LinkIcon className='size-3.5' />
        </ToolbarBtn>
        <div className='w-px h-3.5 bg-border mx-0.5' />
        <ToolbarBtn
          onClick={() =>
            editor.chain().focus().clearNodes().unsetAllMarks().run()
          }
          title='Очистить форматирование'
        >
          <RemoveFormatting className='size-3.5' />
        </ToolbarBtn>
      </div>
      <div className='flex-1 overflow-auto'>
        <EditorContent editor={editor} className='h-full' />
      </div>
      <style>{`
        .mini-wysiwyg--dark {
          --wysiwyg-bg: oklch(0.205 0 0);
          --wysiwyg-text: oklch(0.92 0 0);
          --wysiwyg-mark-bg: oklch(0.40 0.10 149.58);
          --wysiwyg-mark-text: #fff;
          --wysiwyg-link: oklch(0.7 0.12 250);
        }
        .mini-wysiwyg--light {
          --wysiwyg-bg: #ffffff;
          --wysiwyg-text: oklch(0.145 0 0);
          --wysiwyg-mark-bg: oklch(0.85 0.14 149.58);
          --wysiwyg-mark-text: inherit;
          --wysiwyg-link: oklch(0.5 0.15 250);
        }
        .mini-wysiwyg .tiptap {
          background: var(--wysiwyg-bg);
          color: var(--wysiwyg-text);
          font-size: 13px;
          line-height: 1.6;
        }
        .mini-wysiwyg .tiptap p {
          margin: 0.25em 0 0.75em;
        }
        .mini-wysiwyg .tiptap mark {
          background: var(--wysiwyg-mark-bg);
          color: var(--wysiwyg-mark-text);
          padding: 0.1em 0.2em;
          border-radius: 2px;
        }
        .mini-wysiwyg .tiptap a {
          color: var(--wysiwyg-link);
          text-decoration: underline;
          cursor: pointer;
        }
        .mini-wysiwyg .tiptap strong {
          font-weight: 600;
        }
      `}</style>
    </div>
  );
}
