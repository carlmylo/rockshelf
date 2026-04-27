export function WindowFrame({ children }: React.PropsWithChildren) {
  return (
    <main id="WindowFrame" className="laptop-lg:max-h-[96%] laptop-lg:min-h-[96%] bg-default-black max-h-[95%] min-h-[95%] overflow-hidden border-solid border-[#1c1c1c]" style={{ borderLeftWidth: '1px', borderRightWidth: '1px' }}>
      {children}
    </main>
  )
}
