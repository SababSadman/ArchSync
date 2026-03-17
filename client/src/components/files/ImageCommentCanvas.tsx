import { useState, useRef, useEffect } from 'react';
import { cn } from '../../lib/utils';
import { CommentPin } from './CommentPin';
import { Comment } from '../../hooks/use-comments';

interface ImageCommentCanvasProps {
  src: string;
  comments: Comment[];
  isCommentMode: boolean;
  onAddComment: (x: number, y: number) => void;
  onSelectComment: (id: string) => void;
  selectedCommentId?: string;
  className?: string;
}

export function ImageCommentCanvas({
  src,
  comments,
  isCommentMode,
  onAddComment,
  onSelectComment,
  selectedCommentId,
  className
}: ImageCommentCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const handleClick = (e: React.MouseEvent) => {
    if (!isCommentMode || !imgRef.current) return;

    const rect = imgRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    // Boundary checks
    if (x >= 0 && x <= 100 && y >= 0 && y <= 100) {
      onAddComment(x, y);
    }
  };

  return (
    <div 
      ref={containerRef}
      className={cn(
        "relative w-full h-full flex items-center justify-center bg-slate-950 overflow-auto custom-scrollbar p-8",
        isCommentMode ? "cursor-crosshair" : "cursor-default",
        className
      )}
      onClick={handleClick}
    >
      <div className="relative inline-block">
        <img
          ref={imgRef}
          src={src}
          alt="Preview"
          className="max-w-none shadow-2xl block"
          style={{ pointerEvents: isCommentMode ? 'auto' : 'none' }}
        />
        
        {/* Overlay Layer for Pins */}
        <div className="absolute inset-0 pointer-events-none">
          {comments
            .filter(c => c.x_percent !== null && c.y_percent !== null)
            .map(comment => (
              <CommentPin
                key={comment.id}
                comment={comment}
                isSelected={comment.id === selectedCommentId}
                onClick={onSelectComment}
              />
            ))}
        </div>
      </div>
    </div>
  );
}
