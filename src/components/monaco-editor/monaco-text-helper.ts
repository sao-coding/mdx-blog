/* eslint-disable @typescript-eslint/no-explicit-any */
import { TEXT_ACTIONS, TextAction } from './types'

export class MonacoTextHelper {
  constructor(private editor: any) {}

  /**
   * 檢查文字是否已經被指定的標記包圍
   */
  private isTextWrapped(text: string, before: string, after?: string): boolean {
    const afterMark = after || before
    return text.startsWith(before) && text.endsWith(afterMark)
  }

  /**
   * 移除文字周圍的標記
   */
  private unwrapText(text: string, before: string, after?: string): string {
    const afterMark = after || before
    if (this.isTextWrapped(text, before, afterMark)) {
      return text.slice(before.length, -afterMark.length)
    }
    return text
  }

  /**
   * 切換選中文字的指定標記
   */
  private toggleTextWrapping(action: TextAction): void {
    if (!this.editor) return

    const selection = this.editor.getSelection()
    const selectedText =
      this.editor.getModel()?.getValueInRange(selection) || ''

    let newText: string
    let newSelectionLength: number

    if (selectedText) {
      // 如果有選中文字
      const afterMark = action.after || action.before

      if (this.isTextWrapped(selectedText, action.before, afterMark)) {
        // 如果已經被包裹，則移除標記
        newText = this.unwrapText(selectedText, action.before, afterMark)
        newSelectionLength = newText.length
      } else {
        // 如果沒有被包裹，則添加標記
        newText = `${action.before}${selectedText}${afterMark}`
        newSelectionLength = selectedText.length
      }
    } else {
      // 如果沒有選中文字，插入佔位符
      const afterMark = action.after || action.before
      newText = `${action.before}${action.placeholder || ''}${afterMark}`
      newSelectionLength = action.placeholder?.length || 0
    }

    // 執行編輯操作
    this.editor.executeEdits('', [
      {
        range: selection,
        text: newText,
      },
    ])

    // 重新設置選擇範圍
    if (!selectedText && action.placeholder) {
      // 沒有選中文字時，選中佔位符
      const newSelection = {
        startLineNumber: selection.startLineNumber,
        startColumn: selection.startColumn + action.before.length,
        endLineNumber: selection.startLineNumber,
        endColumn:
          selection.startColumn + action.before.length + newSelectionLength,
      }
      this.editor.setSelection(newSelection)
    } else if (
      selectedText &&
      !this.isTextWrapped(
        selectedText,
        action.before,
        action.after || action.before
      )
    ) {
      // 如果是添加標記，選中原文字（不包括標記）
      const newSelection = {
        startLineNumber: selection.startLineNumber,
        startColumn: selection.startColumn + action.before.length,
        endLineNumber: selection.endLineNumber,
        endColumn: selection.endColumn + action.before.length,
      }
      this.editor.setSelection(newSelection)
    }

    // 聚焦編輯器
    this.editor.focus()
  }

  /**
   * 切換粗體格式
   */
  applyBold(): void {
    this.toggleTextWrapping(TEXT_ACTIONS.bold)
  }

  /**
   * 切換斜體格式
   */
  applyItalic(): void {
    this.toggleTextWrapping(TEXT_ACTIONS.italic)
  }

  /**
   * 切換連結格式
   */
  insertLink(): void {
    this.toggleTextWrapping(TEXT_ACTIONS.link)
  }

  /**
   * 切換圖片格式
   */
  insertImage(): void {
    this.toggleTextWrapping(TEXT_ACTIONS.image)
  }

  /**
   * 取得目前編輯器的值
   */
  getValue(): string {
    return this.editor?.getValue() || ''
  }

  /**
   * 設置編輯器的值
   */
  setValue(value: string): void {
    if (this.editor) {
      this.editor.setValue(value)
    }
  }
}
