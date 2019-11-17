import React, { CSSProperties } from 'react'

interface ITextSkeletonProps {
  width?: number | string;
  className?: string;
  style?: CSSProperties;
}

interface ISpanSkeletonProps {
  width?: number | string;
  className?: string;
  style?: CSSProperties;
}

interface IAvatarSkeletonProps {
  className?: string;
  style?: CSSProperties;
}

const TextSkeleton: React.FunctionComponent<ITextSkeletonProps> = ({ className, style, width }) => {
  
  const classes = 'text-skeleton skeleton-active ' + (className || '')
  return (
    <div
      className={classes}
      style={{
        ...style,
        width,
      }}
    />
  )
}

const SpanSkeleton: React.FunctionComponent<ISpanSkeletonProps> = ({ className, style, width }) => {
  const classes = 'span-skeleton skeleton-active ' + (className || '')
  return (
    <span
      className={classes}
      style={{
        ...style,
        width,
      }}
    />
  )
}

const AvatarSkeleton: React.FunctionComponent<IAvatarSkeletonProps> = ({ className, style }) => {
  const classes = 'avatar-skeleton skeleton-active ' + (className || '')
  return <div className={classes} style={style}/>
}
export { SpanSkeleton, TextSkeleton, AvatarSkeleton }
