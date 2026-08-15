"use client"

import dynamic from "next/dynamic"

const DeleteAccountConfirm = dynamic(() => import("./_components/DeleteAccountConfirm"), {
  ssr: false,
})

export default function DeleteAccountPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4 font-mono">
      <DeleteAccountConfirm />
    </div>
  )
}
