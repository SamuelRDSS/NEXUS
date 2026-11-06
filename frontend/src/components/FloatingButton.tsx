import { Plus } from 'lucide-react'

interface FloatingButtonProps {
  onClick: () => void
}

export function FloatingButton({ onClick }: FloatingButtonProps) {
  return (
    <button type="button" className="floating-button" onClick={onClick}><Plus size={20} /> Criar post</button>
  )
}
