"use client"

import { Quote } from "lucide-react"
import Container from "@/components/ui/Container"
import SectionTitle from "@/components/ui/SectionTitle"
import Card from "@/components/ui/Card"
import Rating from "@/components/ui/Rating"
import Badge from "@/components/ui/Badge"
import { StaggerContainer, StaggerItem } from "@/components/animations/StaggerContainer"
import type { Review } from "@/engine/product/types"

interface CustomerReviewsProps {
  title: string
  subtitle?: string
  reviews: Review[]
}

export default function CustomerReviews({
  title,
  subtitle,
  reviews,
}: CustomerReviewsProps) {
  if (!reviews.length) return null

  return (
    <Container>
      <SectionTitle title={title} subtitle={subtitle} />
      <StaggerContainer className="mx-auto grid max-w-4xl gap-4">
        {reviews.map((review) => (
          <StaggerItem key={review.id}>
            <Card className="p-5 sm:p-6">
              <div className="mb-3 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#6c5ce7]/20 to-[#a29bfe]/20 text-xs font-semibold text-[#a29bfe]">
                    {review.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-white/80">
                        {review.name}
                      </span>
                      {review.verified && (
                        <Badge variant="success" size="sm">
                          Verified
                        </Badge>
                      )}
                    </div>
                    <Rating value={review.rating} size="sm" showCount={false} />
                  </div>
                </div>
                <Quote className="h-5 w-5 text-white/[0.06]" />
              </div>
              <h4 className="mb-2 text-sm font-semibold text-white/70">
                {review.title}
              </h4>
              <p className="text-sm leading-relaxed text-white/40">
                {review.content}
              </p>
              <p className="mt-3 text-xs text-white/20">{review.date}</p>
            </Card>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </Container>
  )
}
