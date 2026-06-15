"use client";

import Link from "next/link";
import {
  FileText,
  SearchCheck,
  ShieldCheck,
  ArrowRight,
  Database,
  Globe as GlobeIcon,
  Zap,
  CheckCircle,
  ExternalLink,
  Cpu,
} from "lucide-react";

import { App } from "@/components/app";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

// ── constantes extraídas para evitar literales repetidos ──────────────────────
const FEATURES = [
  {
    icon: <FileText className="h-5 w-5" aria-hidden="true" />,
    title: "Extracción Precisa",
    desc: "Usamos tecnología de procesamiento de lenguaje natural para identificar citas incluso en los formatos más complejos.",
  },
  {
    icon: <SearchCheck className="h-5 w-5" aria-hidden="true" />,
    title: "Validación Global",
    desc: "Contrastamos cada referencia con millones de registros académicos para asegurar que tus datos sean reales y actuales.",
  },
  {
    icon: <ShieldCheck className="h-5 w-5" aria-hidden="true" />,
    title: "Integridad Total",
    desc: "Evita el plagio accidental y los errores tipográficos. Garantizamos que tus fuentes sean rastreables y veraces.",
  },
] as const;

const APIS = [
  { name: "OpenAlex",        desc: "Catálogo masivo de 250M+ de trabajos científicos." },
  { name: "CrossRef",        desc: "La infraestructura global para el registro de DOIs." },
  { name: "PubMed",          desc: "Especialización en literatura biomédica y salud." },
  { name: "Semantic Scholar",desc: "Búsqueda potenciada por IA para impacto académico." },
] as const;

const API_CARDS = [
  { icon: <Database    className="h-8 w-8 text-primary" aria-hidden="true" />, label: "Big Data Académico", aspect: "aspect-[4/3]" },
  { icon: <GlobeIcon   className="h-8 w-8 text-primary" aria-hidden="true" />, label: "Fuentes Globales",   aspect: "aspect-square" },
  { icon: <Cpu         className="h-8 w-8 text-primary" aria-hidden="true" />, label: "Procesamiento IA",   aspect: "aspect-square" },
  { icon: <ExternalLink className="h-8 w-8 text-primary" aria-hidden="true" />, label: "DOIs Dinámicos",   aspect: "aspect-[4/3]" },
] as const;

// ── shared class strings para evitar repetición ───────────────────────────────
const API_CARD_BASE =
  "rounded-2xl bg-white dark:bg-primary/10 border border-sky-100 dark:border-primary/10 p-6 flex flex-col items-center justify-center text-center space-y-3 group hover:-translate-y-1 hover:bg-sky-50 dark:hover:bg-primary/20 transition-all shadow-[0_10px_25px_rgba(56,189,248,0.12)]";

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10">
        <Card className="p-6">
          <div className="space-y-3">
            <div className="h-7 w-2/3 bg-surface-2 rounded" />
            <div className="h-4 w-5/6 bg-surface-2 rounded" />
            <div className="h-10 w-52 bg-surface-2 rounded mt-4" />
          </div>
        </Card>
      </div>
    );
  }

  if (user) return <App />;

  return (
    <div className="relative min-h-screen w-full bg-background transition-colors duration-500">
      <div className="mx-auto max-w-5xl px-4 py-12 space-y-16">

        {/* Hero Section */}
        <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white dark:border-border dark:bg-black/20 p-8 sm:p-12 shadow-[0_18px_45px_rgba(15,23,42,0.06)] dark:shadow-2xl transition-all duration-500">

          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
          <div className="absolute top-0 right-0 -mt-20 -mr-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl animate-pulse pointer-events-none" />

          <div className="relative grid lg:grid-cols-2 gap-10 items-center">

            <div className="space-y-6">

              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 dark:bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider shadow-[0_8px_18px_rgba(14,165,233,0.08)] animate-bounce">
                <Zap className="h-3 w-3" aria-hidden="true" />
                <span>Inteligencia Académica Global</span>
              </div>

              <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight tracking-tight text-foreground transition-colors">
                Eleva tus{" "}
                <span className="text-primary">Investigaciones</span>{" "}
                al estándar mundial.
              </h1>

              <p className="text-lg text-slate-700 dark:text-slate-100 leading-relaxed font-semibold transition-colors">
                RefCheck transforma tus citas en un ecosistema de metadatos
                verificados. Conéctate con la red de conocimiento global y
                asegura la excelencia bibliográfica en segundos.
              </p>

              <div className="flex flex-wrap gap-4 pt-4">
                <Button
                  asChild
                  size="lg"
                  className="rounded-xl px-8 h-12 text-base font-semibold transition-all hover:scale-105 shadow-lg shadow-primary/20"
                >
                  <Link href="/login">
                    Empezar ahora
                    <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
                  </Link>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="rounded-xl px-8 h-12 text-base font-semibold bg-white dark:bg-transparent border-slate-200 hover:bg-slate-50 dark:hover:bg-surface/50 transition-all shadow-[0_10px_24px_rgba(15,23,42,0.05)]"
                >
                  <Link href="/register">Crear cuenta gratuita</Link>
                </Button>
              </div>

              <div className="flex items-center gap-6 pt-6 opacity-75 hover:opacity-100 transition-all duration-500">
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-1">
                    Potenciado por
                  </span>
                  <div className="flex gap-4 text-foreground/80">
                    {["OpenAlex", "CrossRef", "SemanticScholar"].map((name) => (
                      <span key={name} className="text-xs font-semibold">{name}</span>
                    ))}
                  </div>
                </div>
              </div>

            </div>

            {/* Mock Terminal */}
            <div className="relative hidden lg:block">
              <div className="aspect-square rounded-2xl bg-slate-100 dark:bg-gradient-to-br dark:from-primary/30 dark:to-transparent border border-slate-200 dark:border-white/10 p-4 overflow-hidden shadow-inner">

                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10 dark:opacity-20 pointer-events-none" />

                <div className="relative h-full w-full rounded-xl border border-slate-300 dark:border-primary/30 bg-white dark:bg-black/80 p-6 flex flex-col justify-center space-y-4 shadow-2xl transition-colors">

                  <div className="flex items-center gap-3 border-b border-slate-100 dark:border-border/50 pb-4">
                    <div className="h-3 w-3 rounded-full bg-red-400 dark:bg-red-500/70" />
                    <div className="h-3 w-3 rounded-full bg-yellow-400 dark:bg-yellow-500/70" />
                    <div className="h-3 w-3 rounded-full bg-green-400 dark:bg-green-500/70" />
                    <div className="ml-auto text-[10px] font-mono font-bold text-slate-400">
                      analizador.py
                    </div>
                  </div>

                  <div className="space-y-3 font-mono text-[11px] sm:text-xs">
                    <p className="text-blue-600 dark:text-blue-400 font-bold">
                      # Analizando Referencias...
                    </p>

                    {[
                      { label: "&gt; Extrayendo PDF...",         badge: "OK",         badgeClass: "bg-slate-100 dark:bg-primary/10 text-slate-700 dark:text-primary" },
                      { label: "&gt; Consultando CrossRef API...",badge: "124 ms",     badgeClass: "bg-slate-100 dark:bg-primary/10 text-slate-700 dark:text-primary" },
                      { label: "&gt; Validando DOIs...",          badge: "VERIFICADO", badgeClass: "bg-green-50 dark:bg-green-500/20 text-green-600 dark:text-green-400 italic border border-green-100 dark:border-none" },
                    ].map(({ label, badge, badgeClass }) => (
                      <div key={label} className="flex justify-between items-center text-slate-600 dark:text-primary/80">
                        <span className="font-bold" dangerouslySetInnerHTML={{ __html: label }} />
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-black ${badgeClass}`}>
                          {badge}
                        </span>
                      </div>
                    ))}

                    <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mt-4 shadow-inner">
                      <div
                        className="h-full bg-primary animate-[loading_2s_ease-in-out_infinite] shadow-[0_0_10px_rgba(41,197,232,0.3)] dark:shadow-[0_0_10px_rgba(41,197,232,0.5)]"
                        style={{ width: "70%" }}
                      />
                    </div>
                  </div>

                </div>

                <div className="absolute -top-4 -right-4 h-20 w-20 rounded-full bg-primary/20 blur-2xl pointer-events-none" />
                <div className="absolute -bottom-6 -left-6 h-24 w-24 rounded-full bg-primary/10 blur-2xl pointer-events-none" />
              </div>
            </div>

          </div>
        </section>

        {/* Features Grid */}
        <section className="space-y-8">

          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">
              Todo lo que necesitas para tu bibliografía
            </h2>
            <p className="text-muted text-sm sm:text-base max-w-xl mx-auto font-semibold">
              Una suite completa de herramientas diseñadas para simplificar el
              proceso más tedioso de la investigación.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            {FEATURES.map((feature, i) => (
              <Card
                key={i}
                className="group relative overflow-hidden p-6 border border-slate-200 bg-white dark:border-border dark:bg-black/40 hover:-translate-y-1 hover:border-primary/25 transition-all duration-300 shadow-[0_14px_34px_rgba(15,23,42,0.05)] hover:shadow-[0_20px_44px_rgba(14,165,233,0.12)] dark:shadow-none"
              >
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
                <div className="space-y-4">
                  <div className="h-12 w-12 rounded-xl bg-white/80 dark:bg-primary/10 border border-primary/15 dark:border-primary/20 flex items-center justify-center shadow-[0_8px_18px_rgba(14,165,233,0.08)] group-hover:scale-110 group-hover:bg-sky-50 dark:group-hover:bg-primary/20 transition-all duration-300">
                    <div className="text-primary">{feature.icon}</div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-bold text-lg text-foreground">{feature.title}</h3>
                    <p className="text-sm text-slate-600 dark:text-muted leading-relaxed font-medium">
                      {feature.desc}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

        </section>

        {/* API Section */}
        <section className="rounded-3xl border border-slate-200 bg-white dark:border-border dark:bg-black/30 p-8 sm:p-12 space-y-10 shadow-[0_18px_45px_rgba(15,23,42,0.06)] dark:shadow-2xl transition-all duration-500">

          <div className="flex flex-col md:flex-row gap-10 items-center">

            <div className="flex-1 space-y-6">
              <h2 className="text-3xl font-bold tracking-tight text-foreground">
                Conectados al conocimiento mundial
              </h2>
              <p className="text-slate-600 dark:text-slate-200 leading-relaxed font-semibold">
                RefCheck se comunica en tiempo real con las bases de datos más
                prestigiosas del mundo académico. No adivinamos, verificamos.
              </p>

              <div className="space-y-4">
                {APIS.map((api) => (
                  <div key={api.name} className="flex items-start gap-3 group">
                    <div className="mt-1">
                      <CheckCircle className="h-4 w-4 text-primary opacity-80 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
                    </div>
                    <div>
                      <span className="font-bold text-sm block text-foreground">{api.name}</span>
                      <span className="text-xs text-slate-600 dark:text-muted font-medium">{api.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex-1 grid grid-cols-2 gap-4">
              <div className="space-y-4">
                {API_CARDS.slice(0, 2).map(({ icon, label, aspect }) => (
                  <div key={label} className={`${aspect} ${API_CARD_BASE}`}>
                    <div className="group-hover:scale-110 transition-transform">{icon}</div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-600 dark:text-muted">
                      {label}
                    </span>
                  </div>
                ))}
              </div>
              <div className="space-y-4 pt-8">
                {API_CARDS.slice(2, 4).map(({ icon, label, aspect }) => (
                  <div key={label} className={`${aspect} ${API_CARD_BASE}`}>
                    <div className="group-hover:scale-110 transition-transform">{icon}</div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-600 dark:text-muted">
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </section>

        {/* CTA */}
        <section className="text-center py-10 space-y-6">
          <h2 className="text-3xl font-bold tracking-tight text-foreground">
            ¿Listo para perfeccionar tu trabajo?
          </h2>
          <p className="text-muted max-w-lg mx-auto italic font-medium">
            "La diferencia entre una tesis buena y una excelente está en el
            rigor de sus fuentes."
          </p>
          <div className="flex justify-center gap-4">
            <Button
              asChild
              size="lg"
              className="rounded-xl px-10 shadow-xl shadow-primary/20 hover:scale-105 transition-transform"
            >
              <Link href="/login">Acceder ahora</Link>
            </Button>
          </div>
        </section>

        <footer className="pt-10 border-t border-border/50 text-center">
          <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-semibold">
            RefCheck &copy; 2026 · El estándar en validación bibliográfica
          </p>
        </footer>

      </div>
    </div>
  );
}