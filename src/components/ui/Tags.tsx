import Badge from "./Badge"

interface TagsProps {
  tags: string[]
  className?: string
  variant?: "default" | "primary" | "outline"
  limit?: number
}

export default function Tags({ tags, className, variant = "default", limit }: TagsProps) {
  const display = limit ? tags.slice(0, limit) : tags
  const remaining = limit ? tags.length - limit : 0

  return (
    <div className={`flex flex-wrap gap-2 ${className ?? ""}`}>
      {display.map((tag) => (
        <Badge key={tag} variant={variant} size="md">
          {tag}
        </Badge>
      ))}
      {remaining > 0 && (
        <Badge variant="outline" size="md">
          +{remaining} more
        </Badge>
      )}
    </div>
  )
}
