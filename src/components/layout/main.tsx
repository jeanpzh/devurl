import CreateOfflineLink from "../links/create-offline-link";

export default function Main() {
  return (
    <main className="relative z-10 mx-auto flex w-[min(1010px,calc(100%-32px))] min-h-0 flex-1 flex-col justify-center py-8 max-md:w-[calc(100%-24px)] max-md:justify-start max-md:py-3">
      <section className="mb-6 md:pl-5" aria-labelledby="landing-title">
        <p className="mb-2 font-['VT323'] text-[25px] text-terminal-accent">&gt; deVRL_</p>
        <h1
          className="m-0 text-[clamp(42px,7vw,76px)] font-medium leading-[0.95] tracking-[-0.08em] text-terminal-text max-md:text-[clamp(38px,12vw,58px)]"
          id="landing-title"
        >
          ACORTA LA WEB.
        </h1>
        <p className="mt-3 max-w-[620px] text-[clamp(13px,1.7vw,16px)] leading-6 text-terminal-muted">
          Convierte URLs largas en enlaces simples.
        </p>
      </section>
      <section aria-label="Create a short link">
        <CreateOfflineLink />
      </section>
    </main>
  );
}
