/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useRef, useCallback, useState, useEffect } from 'react'
import Editor from '@monaco-editor/react'
import { MonacoToolbar } from './monaco-toolbar'
import { useMonacoShortcuts } from './monaco-shortcuts'
import { MonacoTextHelper } from './monaco-text-helper'
import { MonacoEditorProps } from './types'

export default function MonacoEditor({
  value,
  onChange,
  language = 'markdown',
  theme = 'vs-dark',
  height = '400px',
  options = {},
  onSave,
  showToolbar = true,
}: MonacoEditorProps) {
  const editorRef = useRef<any>(null)
  const textHelperRef = useRef<MonacoTextHelper | null>(null)
  const [isEditorReady, setIsEditorReady] = useState(false)
  const disposablesRef = useRef<any[]>([])

  // stats
  const [totalWords, setTotalWords] = useState(0)
  const [totalChars, setTotalChars] = useState(0)
  const [totalLines, setTotalLines] = useState(0)

  const [selWords, setSelWords] = useState(0)
  const [selChars, setSelChars] = useState(0)
  const [selLines, setSelLines] = useState(0)

  const handleEditorDidMount = useCallback((editor: any) => {
    editorRef.current = editor
    textHelperRef.current = new MonacoTextHelper(editor)
    setIsEditorReady(true)

    // helper: count graphemes (user-perceived characters)
    const countGraphemes = (text: string): number => {
      if (!text) return 0
      const normalized = text.replace(/\r\n/g, '\n') // 統一換行
      const Seg = (Intl as any).Segmenter
      if (Seg) {
        try {
          const seg = new Seg(undefined, { granularity: 'grapheme' })
          let count = 0
          for (const _ of seg.segment(normalized)) count++
          return count
        } catch (e) {
          // fallback if Segmenter fails
        }
      }
      // fallback: code points (better than .length for emoji/unicode)
      return Array.from(normalized).length
    }

    // helper: smart word count for CJK + other languages
    const countWords = (text: string): number => {
      if (!text) return 0

      // If text contains CJK scripts, count those characters individually.
      const hasCJK =
        /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}]/u.test(text)
      if (hasCJK) {
        const hanMatches = text.match(/\p{Script=Han}/gu) || []
        const hiraganaMatches = text.match(/\p{Script=Hiragana}/gu) || []
        const katakanaMatches = text.match(/\p{Script=Katakana}/gu) || []

        const withoutCJK = text
          .replace(/\p{Script=Han}/gu, ' ')
          .replace(/\p{Script=Hiragana}/gu, ' ')
          .replace(/\p{Script=Katakana}/gu, ' ')
        const otherWordsMatches = withoutCJK.match(/\p{L}+/gu) || []

        return (
          hanMatches.length +
          hiraganaMatches.length +
          katakanaMatches.length +
          otherWordsMatches.length
        )
      }

      // Non-CJK: prefer Intl.Segmenter word segmentation
      const Seg = (Intl as any).Segmenter
      if (Seg) {
        try {
          const seg = new Seg(undefined, { granularity: 'word' })
          let count = 0
          for (const segment of seg.segment(text) as any) {
            if (segment.isWordLike) count++
          }
          if (count > 0) return count
        } catch (e) {
          // fallback
        }
      }

      // fallback for other languages
      const other = text.match(/\p{L}+/gu) || []
      return other.length
    }

    const updateAllStats = () => {
      try {
        const model = editor.getModel()
        if (!model) return
        const value = model.getValue()
        setTotalChars(countGraphemes(value))
        setTotalLines(model.getLineCount())
        setTotalWords(countWords(value))
      } catch (e) {
        // ignore
      }
    }

    const updateSelectionStats = () => {
      try {
        const selection = editor.getSelection()
        const model = editor.getModel()
        if (!model || !selection) {
          setSelChars(0)
          setSelLines(0)
          setSelWords(0)
          return
        }

        const selectedText = model.getValueInRange(selection) || ''
        setSelChars(countGraphemes(selectedText))
        setSelLines(selectedText ? selectedText.split(/\r\n|\r|\n/).length : 0)
        setSelWords(countWords(selectedText))
      } catch (e) {
        // ignore
      }
    }

    // initial
    updateAllStats()
    updateSelectionStats()

    // subscribe
    const contentDisposable = editor.onDidChangeModelContent(() => {
      updateAllStats()
      updateSelectionStats()
    })

    const selectionDisposable = editor.onDidChangeCursorSelection(() => {
      updateSelectionStats()
    })

    disposablesRef.current.push(contentDisposable, selectionDisposable)
  }, [])

  // 清理工作
  useEffect(() => {
    return () => {
      setIsEditorReady(false)
      editorRef.current = null
      textHelperRef.current = null
      // dispose Monaco disposables
      disposablesRef.current.forEach(
        (d) => d && typeof d.dispose === 'function' && d.dispose()
      )
      disposablesRef.current = []
    }
  }, [])

  const handleBold = useCallback(() => {
    textHelperRef.current?.applyBold()
  }, [])

  const handleItalic = useCallback(() => {
    textHelperRef.current?.applyItalic()
  }, [])

  const handleLink = useCallback(() => {
    textHelperRef.current?.insertLink()
  }, [])

  const handleImage = useCallback(() => {
    textHelperRef.current?.insertImage()
  }, [])

  const handleSave = useCallback(() => {
    if (onSave) {
      onSave()
    }
  }, [onSave])

  const handleUndo = useCallback(() => {
    try {
      editorRef.current?.getModel() &&
        editorRef.current?.trigger('keyboard', 'undo', null)
    } catch (e) {
      // fallback using editor API
      try {
        editorRef.current?.undo && editorRef.current.undo()
      } catch (err) {
        // no-op
      }
    }
  }, [])

  const handleRedo = useCallback(() => {
    try {
      editorRef.current?.getModel() &&
        editorRef.current?.trigger('keyboard', 'redo', null)
    } catch (e) {
      try {
        editorRef.current?.redo && editorRef.current.redo()
      } catch (err) {
        // no-op
      }
    }
  }, [])

  // 註冊快捷鍵
  useMonacoShortcuts({
    editor: editorRef.current,
    onBold: handleBold,
    onItalic: handleItalic,
    onLink: handleLink,
    onImage: handleImage,
    onUndo: handleUndo,
    onRedo: handleRedo,
  })

  const defaultOptions = {
    fontSize: 14,
    lineNumbers: 'on',
    roundedSelection: false,
    scrollBeyondLastLine: false,
    minimap: { enabled: true },
    automaticLayout: true,
    wordWrap: 'on',
    renderLineHighlight: 'gutter',
    selectOnLineNumbers: true,
    matchBrackets: 'always',
    contextmenu: true,
    find: {
      addExtraSpaceOnTop: false,
      autoFindInSelection: 'never',
      seedSearchStringFromSelection: 'always',
    },
    accessibilitySupport: 'auto',
    renderWhitespace: 'selection',
    smoothScrolling: true,
    cursorSmoothCaretAnimation: 'on',
    cursorBlinking: 'blink',
    mouseWheelZoom: true,
    tabSize: 2,
    insertSpaces: true,
    formatOnPaste: true,
    formatOnType: true,
    ...options,
  }

  return (
    <div className="border rounded-lg overflow-hidden bg-background">
      {showToolbar && (
        <MonacoToolbar
          onBold={handleBold}
          onItalic={handleItalic}
          onLink={handleLink}
          onImage={handleImage}
          onUndo={handleUndo}
          onRedo={handleRedo}
          disabled={!isEditorReady}
        />
      )}

      <Editor
        height={height}
        language={language}
        value={value}
        onChange={onChange}
        theme={theme}
        options={defaultOptions}
        onMount={handleEditorDidMount}
        loading={
          <div className="flex items-center justify-center h-full">
            <div className="text-muted-foreground">載入編輯器中...</div>
          </div>
        }
      />

      {/* status bar */}
      <div className="px-3 py-2 border-t bg-muted/30 text-sm flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-muted-foreground">
          總字數: {totalWords} · 總字元: {totalChars} · 總行數: {totalLines}
        </div>

        <div className="text-muted-foreground">
          選取 — 字數: {selWords} · 字元: {selChars} · 行數: {selLines}
        </div>
      </div>
    </div>
  )
}
