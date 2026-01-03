'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import { useEffect } from 'react'
import { EditorToolbar } from './EditorToolbar'
import { cn } from '@/lib/utils'

interface RichTextEditorProps {
  value: string
  onChange: (html: string) => void
  placeholder?: string
  className?: string
  editable?: boolean
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = 'Start writing your article...',
  className,
  editable = true,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-brand-primary underline hover:text-brand-primary-hover',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'rounded-lg max-w-full h-auto',
        },
      }),
    ],
    content: value,
    editable,
    immediatelyRender: false, // Prevent SSR hydration mismatch
    editorProps: {
      attributes: {
        class: cn(
          'prose prose-sm sm:prose lg:prose-lg max-w-none',
          'focus:outline-none min-h-[300px] p-4',
          // Brand color customizations
          'prose-headings:text-foreground',
          'prose-p:text-muted-foreground',
          'prose-a:text-brand-primary prose-a:no-underline hover:prose-a:underline',
          'prose-strong:text-foreground',
          'prose-blockquote:border-l-brand-primary prose-blockquote:text-muted-foreground',
          'prose-code:text-brand-primary prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded',
          'prose-hr:border-border',
          // Dark mode
          'dark:prose-invert',
        ),
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  // Sync external value changes
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value)
    }
  }, [value, editor])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      editor?.destroy()
    }
  }, [editor])

  return (
    <div className={cn('border border-border rounded-lg bg-card', className)}>
      <EditorToolbar editor={editor} />
      <EditorContent editor={editor} className="border-t-0" />
      {/* Placeholder when empty */}
      {editor?.isEmpty && (
        <div className="absolute top-[60px] left-4 text-muted-foreground pointer-events-none">
          {placeholder}
        </div>
      )}
    </div>
  )
}
