import ConfirmModal from "@/src/presentation/ui/components/ConfirmModal"

type PurchaseModalProps = {
  visible: boolean
  price: number
  currency?: string
  onConfirm: () => void
  onCancel: () => void
}

export default function PurchaseModal({
  visible,
  price,
  currency = "gold",
  onConfirm,
  onCancel,
}: PurchaseModalProps) {
  return (
    <ConfirmModal
      visible={visible}
      text={`Buy to unlock for ${price} ${currency} ?`}
      confirmText="BUY"
      cancelText="CANCEL"
      onConfirm={onConfirm}
      onCancel={onCancel}
    />
  )
}
