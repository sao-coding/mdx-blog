/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from 'react'
import { MonacoShortcutsProps } from './types'

export function useMonacoShortcuts({
  editor,
  onBold,
  onItalic,
  onLink,
  onImage,
  onUndo,
  onRedo,
}: MonacoShortcutsProps) {
  useEffect(() => {
    if (!editor) return

    const handleKeyDown = (e: any) => {
      const isCtrlOrCmd = e.ctrlKey || e.metaKey

      if (isCtrlOrCmd) {
        switch (e.code) {
          // KeyS (save) intentionally not handled here; save should be done by outer UI if needed
          case 'KeyB':
            e.preventDefault()
            onBold()
            break
          case 'KeyB':
            e.preventDefault()
            onBold()
            break
          case 'KeyI':
            e.preventDefault()
            onItalic()
            break
          case 'KeyK':
            e.preventDefault()
            onLink()
            break
          case 'KeyG':
            if (e.shiftKey) {
              e.preventDefault()
              onImage()
            }
            break
          case 'KeyZ':
            // Ctrl/Cmd+Z => undo; Ctrl/Cmd+Shift+Z => redo (common in mac)
            e.preventDefault()
            if (e.shiftKey) {
              if (onRedo) onRedo()
            } else {
              if (onUndo) onUndo()
            }
            break
          case 'KeyY':
            // Ctrl/Cmd+Y => redo (common in Windows)
            e.preventDefault()
            if (onRedo) onRedo()
            break
        }
      }
    }

    // 監聽 Monaco 編輯器的鍵盤事件
    const disposable = editor.onKeyDown(handleKeyDown)

    // 清理函數
    return () => {
      if (disposable && typeof disposable.dispose === 'function') {
        disposable.dispose()
      }
    }
  }, [editor, onBold, onItalic, onLink, onImage, onUndo, onRedo])
}
