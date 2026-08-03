const Amara = () => (
  <div className="flex items-center gap-2 text-foreground">
    <svg
      viewBox="0 0 24 24"
      className="h-full w-auto"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M8 16l4-9 4 9" />
    </svg>
    <span className="font-semibold text-2xl tracking-tight">amara</span>
  </div>
);

const Hexa = () => (
  <div className="flex items-center gap-2 text-foreground">
    <svg viewBox="0 0 24 24" className="h-full w-auto" fill="currentColor">
      <path d="M12 2l8.66 5v10L12 22l-8.66-5V7L12 2z" />
    </svg>
    <span className="font-bold text-2xl tracking-tight">hexa</span>
  </div>
);

const Treva = () => (
  <div className="flex items-center gap-2 text-foreground">
    <svg
      viewBox="0 0 24 24"
      className="h-full w-auto"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <path d="M4 6h16M12 6v14" />
    </svg>
    <span className="font-semibold text-2xl tracking-tight">treva</span>
  </div>
);

const Aven = () => (
  <div className="flex items-center gap-2 text-foreground">
    <svg
      viewBox="0 0 24 24"
      className="h-full w-auto"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
      strokeLinecap="round"
    >
      <path d="M4 20L12 4l8 16" />
      <path d="M8 20l4-8 4 8" />
    </svg>
    <span className="font-semibold text-2xl tracking-tight">aven</span>
  </div>
);

const Goldline = () => (
  <div className="flex items-center gap-2 text-foreground">
    <svg
      viewBox="0 0 24 24"
      className="h-full w-auto"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M7 12h10" />
    </svg>
    <span className="font-semibold text-2xl tracking-tight">goldline</span>
  </div>
);

const Kanba = () => (
  <div className="flex items-center gap-2 text-foreground">
    <svg viewBox="0 0 24 24" className="h-full w-auto" fill="currentColor">
      <rect x="3" y="4" width="5" height="16" rx="1.5" />
      <rect x="10.5" y="4" width="5" height="10" rx="1.5" />
      <rect x="18" y="4" width="3" height="13" rx="1.5" />
    </svg>
    <span className="font-semibold text-2xl tracking-tight">kanba</span>
  </div>
);

const Circle = () => (
  <div className="flex items-center gap-2 text-foreground">
    <svg
      viewBox="0 0 24 24"
      className="h-full w-auto"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
    >
      <circle cx="12" cy="12" r="8" />
    </svg>
    <span className="font-medium text-2xl tracking-tight">circle</span>
  </div>
);

const Stari = () => (
  <div className="flex items-center gap-2 text-foreground">
    <svg
      viewBox="0 0 24 24"
      className="h-full w-auto"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
    >
      <path d="M12 3l2.5 5.5L20 9l-4 4 1 6-5-3-5 3 1-6-4-4 5.5-.5L12 3z" />
    </svg>
    <span className="font-bold text-2xl tracking-tight">stari</span>
  </div>
);

const logos = [Amara, Hexa, Treva, Aven, Goldline, Kanba, Circle, Stari];

const LogoCloud = () => {
  return (
    <div className="flex w-full items-center justify-center px-6 py-16">
      <div>
        <p className="text-center font-medium text-foreground/80 text-xl tracking-[-0.01em]">
          More than 2.2 million companies worldwide already trust us
        </p>
        <div className="mt-16 grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
          {logos.map((Logo, i) => (
            <div
              className="flex items-center justify-center rounded border bg-muted/50 py-6 *:h-8 sm:px-10 sm:py-8 sm:*:h-10"
              key={i}
            >
              <Logo />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LogoCloud;
