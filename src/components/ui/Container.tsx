import { cn } from "@/lib/utils"

interface ContainerProps {
  children: React.ReactNode
  className?: string
  as?: "section" | "div"
  id?: string
}

export default function Container({
  children,
  className,
  as: Tag = "section",
  id,
}: ContainerProps) {
  return (
    <Tag
      id={id}
      className={cn("mx-auto w-full max-w-[1200px] px-4 py-16 sm:px-6 sm:py-20 lg:py-24", className)}
    >
      {children}
    </Tag>
  )
}
