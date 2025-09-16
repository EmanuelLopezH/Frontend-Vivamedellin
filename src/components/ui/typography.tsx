export function TypographyH1({ children }: { children: React.ReactNode }) {
  return (
    <h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance">
      {children}
    </h1>
  )
}

export function TypographyH3({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
      {children}
    </h3>
  )
}

export function TypographyMuted({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-muted-foreground text-sm">
        {children}
    </p>
  )
}

export function TypographyP({ children }: { children: React.ReactNode }) {
  return (
    <p className="leading-7 [&:not(:first-child)]:mt-6">
      {children}
    </p>
  )
}

export function TypographyLarge({ children }: { children: React.ReactNode }) {
  return 
    <div className="text-lg font-semibold">
        {children}
    </div>
}

export function TypographySmall({ children }: { children: React.ReactNode }) {
  return (
    <small className="text-sm leading-none font-medium">
        {children}
    </small>
  )
}