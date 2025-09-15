/* eslint-disable @typescript-eslint/no-explicit-any */
export interface MonacoEditorProps {
  value: string
  onChange: (value: string | undefined) => void
  language?: string
  theme?: string
  height?: string
  options?: any
  onSave?: () => void
  showToolbar?: boolean
}

export interface MonacoToolbarProps {
  onBold: () => void
  onItalic: () => void
  onLink: () => void
  onImage: () => void
  onUndo?: () => void
  onRedo?: () => void
  onSave?: () => void
  disabled?: boolean
}

export interface MonacoShortcutsProps {
  editor: any
  onBold: () => void
  onItalic: () => void
  onLink: () => void
  onImage: () => void
  onUndo?: () => void
  onRedo?: () => void
  onSave?: () => void
}

export interface TextAction {
  before: string
  after?: string
  placeholder?: string
}

export const TEXT_ACTIONS: Record<string, TextAction> = {
  bold: {
    before: '**',
    after: '**',
    placeholder: '粗體文字',
  },
  italic: {
    before: '*',
    after: '*',
    placeholder: '斜體文字',
  },
  link: {
    before: '[',
    after: '](url)',
    placeholder: '連結文字',
  },
  image: {
    before: '![',
    after: '](image-url)',
    placeholder: '圖片描述',
  },
}
