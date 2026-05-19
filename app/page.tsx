"use client";

import Link from "next/link";
import { FileText, SearchCheck, ShieldCheck, ArrowRight, Database, Globe as GlobeIcon, Zap, CheckCircle, ExternalLink, Cpu } from "lucide-react";
import { App } from "@/components/app";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

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
        {/* Hero Section - "Publicidad" Style */}
        <section className="relative overflow-hidden rounded-3xl border border-border bg-surface dark:bg-black/20 p-8 sm:p-12 shadow-xl dark:shadow-2xl transition-all duration-500">
          <div className="absolute top-0 right-0 -mt-20 -mr-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl animate-pulse" />
          
          <div className="relative grid lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider animate-bounce">
                <Zap className="h-3 w-3" />
                <span>Inteligencia Académica Global</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight tracking-tight text-foreground transition-colors">
                Eleva tus <span className="text-primary">Investigaciones</span> al estándar mundial.
              </h1>
              
              <p className="text-lg text-black dark:text-slate-100 leading-relaxed font-bold transition-colors">
                RefCheck transforma tus citas en un ecosistema de metadatos verificados. Conéctate con la red de conocimiento global y asegura la excelencia bibliográfica en segundos.
              </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <Button asChild size="lg" className="rounded-xl px-8 h-12 text-base font-semibold transition-all hover:scale-105 shadow-lg shadow-primary/20">
                <Link href="/login">
                  Empezar ahora
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-xl px-8 h-12 text-base font-semibold hover:bg-surface/50 transition-all">
                <Link href="/register">Crear cuenta gratuita</Link>
              </Button>
            </div>

            <div className="flex items-center gap-6 pt-6 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-500">
              <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-1">Potenciado por</span>
                <div className="flex gap-4">
                  <span className="text-xs font-bold">OpenAlex</span>
                  <span className="text-xs font-bold">CrossRef</span>
                  <span className="text-xs font-bold">SemanticScholar</span>
                </div>
              </div>
            </div>
          </div>

          <div className="relative hidden lg:block">
            <div className="aspect-square rounded-2xl bg-slate-100 dark:bg-gradient-to-br dark:from-primary/30 dark:to-transparent border border-slate-200 dark:border-white/10 p-4 relative overflow-hidden group shadow-inner">
              <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10 dark:opacity-20" />
              <div className="relative h-full w-full rounded-xl border border-slate-300 dark:border-primary/30 bg-white dark:bg-black/80 p-6 flex flex-col justify-center space-y-4 shadow-2xl transition-colors">
                <div className="flex items-center gap-3 border-b border-slate-100 dark:border-border/50 pb-4">
                  <div className="h-3 w-3 rounded-full bg-red-400 dark:bg-red-500/70" />
                  <div className="h-3 w-3 rounded-full bg-yellow-400 dark:bg-yellow-500/70" />
                  <div className="h-3 w-3 rounded-full bg-green-400 dark:bg-green-500/70" />
                  <div className="ml-auto text-[10px] font-mono font-bold text-slate-400 dark:text-slate-400">analizador.py</div>
                </div>
                <div className="space-y-3 font-mono text-[11px] sm:text-xs">
                  <p className="text-blue-600 dark:text-blue-400 font-bold"># Analizando Referencias...</p>
                  <div className="flex justify-between items-center text-slate-600 dark:text-primary/80">
                    <span className="font-bold">&gt; Extrayendo PDF...</span>
                    <span className="text-[10px] bg-slate-100 dark:bg-primary/10 px-1.5 py-0.5 rounded font-black text-slate-700 dark:text-primary">OK</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-600 dark:text-primary/80">
                    <span className="font-bold">&gt; Consultando CrossRef API...</span>
                    <span className="text-[10px] bg-slate-100 dark:bg-primary/10 px-1.5 py-0.5 rounded font-black text-slate-700 dark:text-primary">124 ms</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-600 dark:text-primary/80">
                    <span className="font-bold">&gt; Validando DOIs...</span>
                    <span className="text-[10px] bg-green-50 dark:bg-green-500/20 text-green-600 dark:text-green-400 px-1.5 py-0.5 rounded font-black italic border border-green-100 dark:border-none">VERIFICADO</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mt-4 shadow-inner">
                    <div className="h-full bg-primary animate-[loading_2s_ease-in-out_infinite] shadow-[0_0_10px_rgba(41,197,232,0.3)] dark:shadow-[0_0_10px_rgba(41,197,232,0.5)]" style={{ width: '70%' }} />
                  </div>
                </div>
              </div>
              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 h-20 w-20 rounded-full bg-primary/20 blur-2xl" />
              <div className="absolute -bottom-6 -left-6 h-24 w-24 rounded-full bg-primary/10 blur-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid - Clean & Bold */}
      <section className="space-y-8 relative">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold tracking-tight text-slate-950 dark:text-white">Todo lo que necesitas para tu bibliografía</h2>
          <p className="text-slate-800 dark:text-slate-300 text-sm sm:text-base max-w-xl mx-auto font-bold">
            Una suite completa de herramientas diseñadas para simplificar el proceso más tedioso de la investigación.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          {[
            {
              icon: <FileText className="h-5 w-5" />,
              title: "Extracción Precisa",
              desc: "Usamos tecnología de procesamiento de lenguaje natural para identificar citas incluso en los formatos más complejos."
            },
            {
              icon: <SearchCheck className="h-5 w-5" />,
              title: "Validación Global",
              desc: "Contrastamos cada referencia con millones de registros académicos para asegurar que tus datos sean reales y actuales."
            },
            {
              icon: <ShieldCheck className="h-5 w-5" />,
              title: "Integridad Total",
              desc: "Evita el plagio accidental y los errores tipográficos. Garantizamos que tus fuentes sean rastreables y veraces."
            }
          ].map((feature, i) => (
            <Card key={i} className="group p-6 border-border bg-surface dark:bg-black/40 hover:bg-surface-2 dark:hover:bg-black/60 transition-all duration-300 shadow-lg dark:shadow-none">
              <div className="space-y-4">
                <div className="h-12 w-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:scale-110 transition-all duration-300">
                  <div className="text-primary">{feature.icon}</div>
                </div>
                <div className="space-y-2">
                  <h3 className="font-bold text-lg text-black dark:text-white">{feature.title}</h3>
                  <p className="text-sm text-black/70 dark:text-muted leading-relaxed font-bold">
                    {feature.desc}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* API Connection Section - Explaining "What we do" */}
      <section className="rounded-3xl border border-border bg-surface dark:bg-black/30 p-8 sm:p-12 space-y-10 shadow-xl dark:shadow-2xl transition-all duration-500">
        <div className="flex flex-col md:flex-row gap-10 items-center">
          <div className="flex-1 space-y-6">
            <h2 className="text-3xl font-bold tracking-tight text-black dark:text-white">Conectados al conocimiento mundial</h2>
            <p className="text-black/80 dark:text-slate-200 leading-relaxed font-bold">
              RefCheck se comunica en tiempo real con las bases de datos más prestigiosas del mundo académico. No adivinamos, verificamos.
            </p>
            
            <div className="space-y-4">
              {[
                { name: "OpenAlex", desc: "Catálogo masivo de 250M+ de trabajos científicos." },
                { name: "CrossRef", desc: "La infraestructura global para el registro de DOIs." },
                { name: "PubMed", desc: "Especialización en literatura biomédica y salud." },
                { name: "Semantic Scholar", desc: "Búsqueda potenciada por IA para impacto académico." }
              ].map((api, i) => (
                <div key={i} className="flex items-start gap-3 group">
                  <div className="mt-1">
                    <CheckCircle className="h-4 w-4 text-primary opacity-80 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div>
                    <span className="font-bold text-sm block text-foreground">{api.name}</span>
                    <span className="text-xs text-muted font-medium">{api.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex-1 grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="aspect-[4/3] rounded-2xl bg-surface-2 dark:bg-black/50 border border-border p-6 flex flex-col items-center justify-center text-center space-y-3 group hover:border-primary/40 transition-all shadow-md">
                <Database className="h-8 w-8 text-primary group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-foreground/70 dark:text-slate-300">Big Data Académico</span>
              </div>
              <div className="aspect-square rounded-2xl bg-primary/5 dark:bg-primary/10 border border-primary/10 p-6 flex flex-col items-center justify-center text-center space-y-3 group hover:bg-primary/20 dark:hover:bg-primary/20 transition-all shadow-md">
                <GlobeIcon className="h-8 w-8 text-primary group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-foreground/70 dark:text-slate-300">Fuentes Globales</span>
              </div>
            </div>
            <div className="space-y-4 pt-8">
              <div className="aspect-square rounded-2xl bg-primary/5 dark:bg-primary/10 border border-primary/10 p-6 flex flex-col items-center justify-center text-center space-y-3 group hover:bg-primary/20 dark:hover:bg-primary/20 transition-all shadow-md">
                <Cpu className="h-8 w-8 text-primary group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-foreground/70 dark:text-slate-300">Procesamiento IA</span>
              </div>
              <div className="aspect-[4/3] rounded-2xl bg-surface-2 dark:bg-black/50 border border-border p-6 flex flex-col items-center justify-center text-center space-y-3 group hover:border-primary/40 transition-all shadow-md">
                <ExternalLink className="h-8 w-8 text-primary group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-foreground/70 dark:text-slate-300">DOIs Dinámicos</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center py-10 space-y-6 relative">
        <h2 className="text-3xl font-bold tracking-tight text-foreground">¿Listo para perfeccionar tu trabajo?</h2>
        <p className="text-muted max-w-lg mx-auto italic font-medium">
          "La diferencia entre una tesis buena y una excelente está en el rigor de sus fuentes."
        </p>
        <div className="flex justify-center gap-4">
          <Button asChild size="lg" className="rounded-xl px-10 shadow-xl shadow-primary/20 hover:scale-105 transition-transform">
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
