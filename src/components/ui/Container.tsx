import { cn } from "@/lib/utils"

interface ContainerProps {
  children: React.ReactNode
  className?: string
  as?: "div" | "section" | "article" | "nav"
  id?: string
}

export default function Container({
  children,
  className,
  as: Tag = "div",
  id,
}: ContainerProps) {
  return (
    <Tag
      id={id}
      className={cn(
        "mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-8",
        className
      )}
    >
      {children}
    </Tag>
  )
}
