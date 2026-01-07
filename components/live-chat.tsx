"use client"

import { useEffect } from 'react'

declare global {
  interface Window {
    $crisp?: any[]
    CRISP_WEBSITE_ID?: string
  }
}

interface LiveChatProps {
  websiteId?: string
}

export function LiveChat({ websiteId }: LiveChatProps) {
  useEffect(() => {
    // Only load if websiteId is provided
    const crispId = websiteId || process.env.NEXT_PUBLIC_CRISP_WEBSITE_ID
    
    if (!crispId) {
      console.log('Crisp chat: No website ID provided. Add NEXT_PUBLIC_CRISP_WEBSITE_ID to enable live chat.')
      return
    }

    // Initialize Crisp
    window.$crisp = []
    window.CRISP_WEBSITE_ID = crispId

    // Load Crisp script
    const script = document.createElement('script')
    script.src = 'https://client.crisp.chat/l.js'
    script.async = true
    document.getElementsByTagName('head')[0].appendChild(script)

    // Configure Crisp
    script.onload = () => {
      if (window.$crisp) {
        // Set color theme to match brand
        window.$crisp.push(['config', 'color:theme', '#1D4DF1'])
        
        // Set position
        window.$crisp.push(['config', 'position:reverse', false])
        
        // Hide on mobile by default (optional)
        // window.$crisp.push(['config', 'hide:on:mobile', true])
      }
    }

    // Cleanup
    return () => {
      if (document.querySelector(`script[src="${script.src}"]`)) {
        document.querySelector(`script[src="${script.src}"]`)?.remove()
      }
      delete window.$crisp
      delete window.CRISP_WEBSITE_ID
    }
  }, [websiteId])

  return null // This component doesn't render anything
}

// Helper functions to control chat programmatically
export const openChat = () => {
  if (typeof window !== 'undefined' && window.$crisp) {
    window.$crisp.push(['do', 'chat:open'])
  }
}

export const closeChat = () => {
  if (typeof window !== 'undefined' && window.$crisp) {
    window.$crisp.push(['do', 'chat:close'])
  }
}

export const showChat = () => {
  if (typeof window !== 'undefined' && window.$crisp) {
    window.$crisp.push(['do', 'chat:show'])
  }
}

export const hideChat = () => {
  if (typeof window !== 'undefined' && window.$crisp) {
    window.$crisp.push(['do', 'chat:hide'])
  }
}

export const sendMessage = (message: string) => {
  if (typeof window !== 'undefined' && window.$crisp) {
    window.$crisp.push(['do', 'message:send', ['text', message]])
  }
}

export const setUserEmail = (email: string) => {
  if (typeof window !== 'undefined' && window.$crisp) {
    window.$crisp.push(['set', 'user:email', [email]])
  }
}

export const setUserName = (name: string) => {
  if (typeof window !== 'undefined' && window.$crisp) {
    window.$crisp.push(['set', 'user:nickname', [name]])
  }
}
