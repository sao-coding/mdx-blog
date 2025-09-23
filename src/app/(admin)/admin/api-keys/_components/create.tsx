'use client'

import {
  DialogStack,
  DialogStackBody,
  DialogStackContent,
  DialogStackDescription,
  DialogStackFooter,
  DialogStackHeader,
  DialogStackNext,
  DialogStackOverlay,
  DialogStackTitle,
  DialogStackTrigger,
} from '@/components/kibo-ui/dialog-stack'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { authClient } from '@/lib/auth-client'
import { CopyIcon, PlusIcon } from 'lucide-react'
import React from 'react'

export function CreateApiKey() {
  const [name, setName] = React.useState('')
  const [expiresIn, setExpiresIn] = React.useState(7)
  const [prefix, setPrefix] = React.useState('')
  const [newKey, setNewKey] = React.useState<string | null>(null)
  const [open, setOpen] = React.useState(false)

  const handleCreate = async () => {
    try {
      // 驗證必填欄位
      if (!name.trim()) {
        alert('請輸入 API 金鑰名稱')
        return false
      }

      const { data, error } = await authClient.apiKey.create({
        name: name.trim(),
        expiresIn: 60 * 60 * 24 * expiresIn,
        prefix: prefix.trim(),
      })

      if (error) {
        console.error('建立 API 金鑰失敗:', error)
        alert('建立 API 金鑰失敗，請稍後再試')
        return false
      }

      if (data?.key) {
        setNewKey(data.key)
        return true
      }

      return false
    } catch (error) {
      console.error('建立 API 金鑰時發生錯誤:', error)
      alert('建立 API 金鑰時發生錯誤，請稍後再試')
      return false
    }
  }

  const handleCopy = async () => {
    if (!newKey) return

    try {
      await navigator.clipboard.writeText(newKey)
      // 可以在這裡加入成功提示
      console.log('API 金鑰已複製到剪貼簿')
    } catch (error) {
      console.error('複製失敗:', error)
      // 降級方案：選取文字
      const input = document.querySelector(
        'input[readonly]'
      ) as HTMLInputElement
      if (input) {
        input.select()
        document.execCommand('copy')
      }
    }
  }

  const handleReset = () => {
    setName('')
    setExpiresIn(7)
    setPrefix('')
    setNewKey(null)
  }

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen)
    if (!isOpen) {
      // 延遲重置狀態，確保對話框完全關閉後再重置
      setTimeout(() => {
        handleReset()
      }, 150)
    }
  }

  return (
    <DialogStack open={open} onOpenChange={handleOpenChange}>
      <DialogStackTrigger asChild>
        <Button>
          <PlusIcon className="mr-2 size-4" />
          建立 API 金鑰
        </Button>
      </DialogStackTrigger>
      <DialogStackOverlay />
      <DialogStackBody>
        <DialogStackContent>
          <DialogStackHeader>
            <DialogStackTitle>建立 API 金鑰</DialogStackTitle>
            <DialogStackDescription>
              建立一個新的 API 金鑰以存取您的專案。
            </DialogStackDescription>
          </DialogStackHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                名稱 *
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="col-span-3"
                placeholder="例如：我的應用程式"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="expiresIn" className="text-right">
                過期天數
              </Label>
              <Input
                id="expiresIn"
                type="number"
                min="1"
                max="365"
                value={expiresIn}
                onChange={(e) =>
                  setExpiresIn(Math.max(1, parseInt(e.target.value) || 1))
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="prefix" className="text-right">
                前綴
              </Label>
              <Input
                id="prefix"
                value={prefix}
                onChange={(e) => setPrefix(e.target.value)}
                className="col-span-3"
                placeholder="例如：sk, api"
              />
            </div>
          </div>
          <DialogStackFooter>
            <DialogStackNext asChild>
              <Button
                type="submit"
                disabled={!name.trim()}
                onClick={async (e) => {
                  const success = await handleCreate()
                  if (!success) {
                    e.preventDefault()
                  }
                }}
              >
                建立
              </Button>
            </DialogStackNext>
          </DialogStackFooter>
        </DialogStackContent>
        <DialogStackContent>
          <DialogStackHeader>
            <DialogStackTitle>API 金鑰已建立</DialogStackTitle>
            <DialogStackDescription>
              請複製並妥善保存您的 API 金鑰，離開此頁面後將無法再次查看。
            </DialogStackDescription>
          </DialogStackHeader>
          <div className="space-y-4 mt-4">
            <div className="relative">
              <Input
                value={newKey ?? ''}
                readOnly
                className="pr-12 font-mono text-sm"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-1/2 right-1 -translate-y-1/2 h-7 w-7"
                onClick={handleCopy}
                title="複製 API 金鑰"
              >
                <CopyIcon className="size-4" />
              </Button>
            </div>
            <div className="rounded-md bg-yellow-50 p-3 text-sm text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200">
              <strong>重要提醒：</strong>請立即將此 API
              金鑰複製到安全的地方。關閉此對話框後，您將無法再次查看完整的金鑰。
            </div>
          </div>
          <DialogStackFooter>
            <Button onClick={() => handleOpenChange(false)}>完成</Button>
          </DialogStackFooter>
        </DialogStackContent>
      </DialogStackBody>
    </DialogStack>
  )
}
