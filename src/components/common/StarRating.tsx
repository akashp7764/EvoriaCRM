import { Star } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  value: number;
  onChange?: (rating: number) => void;
  readOnly?: boolean;
  totalStars?: number;
  className?: string;
}

const StarRating = ({
  value,
  onChange,
  readOnly = false,
  totalStars = 5,
  className,
}: StarRatingProps) => {
  const [hovered, setHovered] = useState<number>(0);

  const handleClick = (rating: number) => {
    if (!readOnly) {
      onChange?.(rating);
    }
  };

  const handleMouseEnter = (rating: number) => {
    if (!readOnly) {
      setHovered(rating);
    }
  };

  const handleMouseLeave = () => {
    if (!readOnly) {
      setHovered(0);
    }
  };

  const activeRating = hovered > 0 ? hovered : value;

  return (
    <div
      className={cn('flex items-center gap-1', className)}
      onMouseLeave={handleMouseLeave}
      aria-label={`Star rating: ${value} out of ${totalStars}`}
    >
      {Array.from({ length: totalStars }, (_, i) => {
        const starValue = i + 1;
        const isFilled = starValue <= activeRating;

        return (
          <button
            key={starValue}
            type="button"
            disabled={readOnly}
            onClick={() => handleClick(starValue)}
            onMouseEnter={() => handleMouseEnter(starValue)}
            aria-label={`Rate ${starValue} out of ${totalStars}`}
            className={cn(
              'transition-transform duration-150 focus:outline-none',
              !readOnly && 'cursor-pointer hover:scale-110',
              readOnly && 'cursor-default'
            )}
          >
            <Star
              size={24}
              className={cn(
                'transition-colors duration-150',
                isFilled
                  ? 'fill-brand-gold text-brand-gold'
                  : 'fill-transparent text-muted-foreground'
              )}
              strokeWidth={1.5}
            />
          </button>
        );
      })}
    </div>
  );
};

StarRating.displayName = 'StarRating';

export default StarRating;
