import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { common, createLowlight } from 'lowlight';
import { Button } from '@/app/components/ui/button';
import { Separator } from '@/app/components/ui/separator';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Pilcrow,
  List,
  ListOrdered,
  Quote,
  Link2,
  ImageIcon,
  Minus,
  Code2,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from 'lucide-react';
import type { Editor } from '@tiptap/react';

const lowlight = createLowlight(common);

interface VisualEditorProps {
  content: string;
  onChange: (html: string) => void;
}

function ToolbarButton({
  editor,
  action,
  isActive,
  icon: Icon,
  title,
}: {
  editor: Editor;
  action: () => void;
  isActive: boolean;
  icon: typeof Bold;
  title: string;
}) {
  return (
    <Button
      variant='ghost'
      size='icon'
      className={`h-8 w-8 ${isActive ? 'bg-muted' : ''}`}
      onClick={action}
      title={title}
      type='button'
    >
      <Icon className='h-4 w-4' />
    </Button>
  );
}

function Toolbar({ editor }: { editor: Editor }) {
  return (
    <div className='flex items-center gap-0.5 flex-wrap border-b px-2 py-1'>
      {/* Text formatting */}
      <ToolbarButton
        editor={editor}
        action={() => editor.chain().focus().toggleBold().run()}
        isActive={editor.isActive('bold')}
        icon={Bold}
        title='Жирный'
      />
      <ToolbarButton
        editor={editor}
        action={() => editor.chain().focus().toggleItalic().run()}
        isActive={editor.isActive('italic')}
        icon={Italic}
        title='Курсив'
      />
      <ToolbarButton
        editor={editor}
        action={() => editor.chain().focus().toggleUnderline().run()}
        isActive={editor.isActive('underline')}
        icon={UnderlineIcon}
        title='Подчёркнутый'
      />
      <ToolbarButton
        editor={editor}
        action={() => editor.chain().focus().toggleStrike().run()}
        isActive={editor.isActive('strike')}
        icon={Strikethrough}
        title='Зачёркнутый'
      />
      <ToolbarButton
        editor={editor}
        action={() => editor.chain().focus().toggleCode().run()}
        isActive={editor.isActive('code')}
        icon={Code}
        title='Inline код'
      />

      <Separator orientation='vertical' className='mx-1 h-6' />

      {/* Headings */}
      <ToolbarButton
        editor={editor}
        action={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        isActive={editor.isActive('heading', { level: 1 })}
        icon={Heading1}
        title='Заголовок 1'
      />
      <ToolbarButton
        editor={editor}
        action={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        isActive={editor.isActive('heading', { level: 2 })}
        icon={Heading2}
        title='Заголовок 2'
      />
      <ToolbarButton
        editor={editor}
        action={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        isActive={editor.isActive('heading', { level: 3 })}
        icon={Heading3}
        title='Заголовок 3'
      />
      <ToolbarButton
        editor={editor}
        action={() => editor.chain().focus().setParagraph().run()}
        isActive={editor.isActive('paragraph')}
        icon={Pilcrow}
        title='Параграф'
      />

      <Separator orientation='vertical' className='mx-1 h-6' />

      {/* Lists & blockquote */}
      <ToolbarButton
        editor={editor}
        action={() => editor.chain().focus().toggleBulletList().run()}
        isActive={editor.isActive('bulletList')}
        icon={List}
        title='Маркированный список'
      />
      <ToolbarButton
        editor={editor}
        action={() => editor.chain().focus().toggleOrderedList().run()}
        isActive={editor.isActive('orderedList')}
        icon={ListOrdered}
        title='Нумерованный список'
      />
      <ToolbarButton
        editor={editor}
        action={() => editor.chain().focus().toggleBlockquote().run()}
        isActive={editor.isActive('blockquote')}
        icon={Quote}
        title='Цитата'
      />

      <Separator orientation='vertical' className='mx-1 h-6' />

      {/* Insert */}
      <ToolbarButton
        editor={editor}
        action={() => {
          const url = window.prompt('URL ссылки:');
          if (url) editor.chain().focus().setLink({ href: url }).run();
        }}
        isActive={editor.isActive('link')}
        icon={Link2}
        title='Ссылка'
      />
      <ToolbarButton
        editor={editor}
        action={() => {
          const url = window.prompt('URL изображения:');
          if (url) editor.chain().focus().setImage({ src: url }).run();
        }}
        isActive={false}
        icon={ImageIcon}
        title='Изображение'
      />
      <ToolbarButton
        editor={editor}
        action={() => editor.chain().focus().setHorizontalRule().run()}
        isActive={false}
        icon={Minus}
        title='Горизонтальная линия'
      />
      <ToolbarButton
        editor={editor}
        action={() => editor.chain().focus().toggleCodeBlock().run()}
        isActive={editor.isActive('codeBlock')}
        icon={Code2}
        title='Блок кода'
      />

      <Separator orientation='vertical' className='mx-1 h-6' />

      {/* Alignment */}
      <ToolbarButton
        editor={editor}
        action={() => editor.chain().focus().setTextAlign('left').run()}
        isActive={editor.isActive({ textAlign: 'left' })}
        icon={AlignLeft}
        title='По левому краю'
      />
      <ToolbarButton
        editor={editor}
        action={() => editor.chain().focus().setTextAlign('center').run()}
        isActive={editor.isActive({ textAlign: 'center' })}
        icon={AlignCenter}
        title='По центру'
      />
      <ToolbarButton
        editor={editor}
        action={() => editor.chain().focus().setTextAlign('right').run()}
        isActive={editor.isActive({ textAlign: 'right' })}
        icon={AlignRight}
        title='По правому краю'
      />
    </div>
  );
}

export function VisualEditor({ content, onChange }: VisualEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ codeBlock: false }),
      Underline,
      Link.configure({ openOnClick: false }),
      Image,
      Placeholder.configure({ placeholder: 'Начните писать...' }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      CodeBlockLowlight.configure({ lowlight }),
    ],
    content,
    onUpdate: ({ editor: e }) => onChange(e.getHTML()),
    editorProps: {
      attributes: {
        class:
          'prose dark:prose-invert max-w-none focus:outline-none min-h-[500px] px-4 py-3',
      },
    },
  });

  if (!editor) return null;

  return (
    <div className='flex flex-col h-full border rounded-md overflow-hidden'>
      <Toolbar editor={editor} />
      <div className='flex-1 overflow-auto'>
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
