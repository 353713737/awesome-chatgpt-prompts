"use client";

import { useId, useState } from "react";
import { ArrowRight, Check, Cpu, RotateCcw, ShieldCheck, ShieldX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

type HarnessOption = "clearPrompt" | "skill" | "tools";

interface HarnessControl {
  label: string;
  description: string;
}

export interface HarnessDemoCopy {
  title: string;
  description: string;
  taskLabel: string;
  task: string;
  modelLabel: string;
  model: string;
  controlsLabel: string;
  resetHint: string;
  traceLabel: string;
  ready: string;
  running: string;
  complete: string;
  unverified: string;
  start: string;
  next: string;
  reset: string;
  controls: Record<HarnessOption, HarnessControl>;
  steps: {
    context: { title: string; clearPrompt: string; vaguePrompt: string; skillLoaded: string; skillMissing: string };
    request: { title: string; guided: string; unguided: string };
    permission: { title: string; allowed: string; blocked: string };
    observation: { title: string; guided: string; unguided: string; unavailable: string };
    review: { title: string; checked: string; unclear: string; unavailable: string };
    finish: { title: string; verified: string; unverified: string };
  };
}

interface HarnessDemoProps {
  copy: HarnessDemoCopy;
}

const OPTIONS: HarnessOption[] = ["clearPrompt", "skill", "tools"];

export function HarnessDemo({ copy }: HarnessDemoProps) {
  const id = useId();
  const [config, setConfig] = useState({ clearPrompt: true, skill: true, tools: true });
  const [revealed, setRevealed] = useState(0);
  const verified = config.clearPrompt && config.tools;
  const steps = [
    {
      title: copy.steps.context.title,
      body: [
        config.clearPrompt ? copy.steps.context.clearPrompt : copy.steps.context.vaguePrompt,
        config.skill ? copy.steps.context.skillLoaded : copy.steps.context.skillMissing,
      ],
      warning: false,
    },
    {
      title: copy.steps.request.title,
      body: [config.skill ? copy.steps.request.guided : copy.steps.request.unguided],
      warning: false,
    },
    {
      title: copy.steps.permission.title,
      body: [config.tools ? copy.steps.permission.allowed : copy.steps.permission.blocked],
      warning: !config.tools,
    },
    {
      title: copy.steps.observation.title,
      body: [!config.tools ? copy.steps.observation.unavailable : config.skill ? copy.steps.observation.guided : copy.steps.observation.unguided],
      warning: !config.tools,
    },
    {
      title: copy.steps.review.title,
      body: [!config.tools ? copy.steps.review.unavailable : config.clearPrompt ? copy.steps.review.checked : copy.steps.review.unclear],
      warning: !verified,
    },
    {
      title: copy.steps.finish.title,
      body: [verified ? copy.steps.finish.verified : copy.steps.finish.unverified],
      warning: !verified,
    },
  ];
  const finished = revealed === steps.length;
  const activeStep = steps[revealed - 1];
  const status = finished ? (verified ? copy.complete : copy.unverified) : revealed ? copy.running : copy.ready;

  function updateConfig(option: HarnessOption, enabled: boolean) {
    setConfig(previous => ({ ...previous, [option]: enabled }));
    setRevealed(0);
  }

  return (
    <section aria-labelledby={`${id}-title`} className="not-prose my-8 overflow-hidden rounded-xl border bg-background">
      <div className="border-b bg-muted/30 p-4 sm:p-5">
        <h4 id={`${id}-title`} className="text-base font-semibold tracking-tight">{copy.title}</h4>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{copy.description}</p>
      </div>

      <div className="grid min-w-0 md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
        <div className="min-w-0 border-b p-4 sm:p-5 md:border-b-0 md:border-e">
          <div className="border-s-2 border-amber-500 ps-3">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{copy.taskLabel}</p>
            <p className="mt-1 text-sm font-medium leading-relaxed">{copy.task}</p>
          </div>
          <div className="mt-4 flex items-start gap-2 rounded-md bg-muted/50 px-3 py-2 text-xs">
            <Cpu aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
            <div>
              <span className="text-muted-foreground">{copy.modelLabel}</span>
              <p className="mt-0.5 font-mono">{copy.model}</p>
            </div>
          </div>

          <fieldset aria-describedby={`${id}-reset-hint`} className="mt-6 space-y-2">
            <legend className="mb-3 text-sm font-semibold">{copy.controlsLabel}</legend>
            {OPTIONS.map(option => (
              <label
                key={option}
                htmlFor={`${id}-${option}`}
                className={cn(
                  "flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50",
                  config[option] ? "border-primary/25 bg-primary/5" : "border-transparent bg-muted/30",
                )}
              >
                <Checkbox
                  id={`${id}-${option}`}
                  checked={config[option]}
                  onCheckedChange={checked => updateConfig(option, checked === true)}
                  aria-describedby={`${id}-${option}-description`}
                  className="mt-0.5"
                />
                <span className="min-w-0">
                  <span className="block text-sm font-medium">{copy.controls[option].label}</span>
                  <span id={`${id}-${option}-description`} className="mt-1 block text-xs leading-relaxed text-muted-foreground">
                    {copy.controls[option].description}
                  </span>
                </span>
              </label>
            ))}
          </fieldset>
          <p id={`${id}-reset-hint`} className="mt-3 text-xs leading-relaxed text-muted-foreground">{copy.resetHint}</p>
        </div>

        <div className="min-w-0 p-4 sm:p-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <p id={`${id}-trace-label`} className="text-sm font-semibold">{copy.traceLabel}</p>
            <span className={cn(
              "rounded-full border px-2 py-0.5 text-xs",
              finished && verified ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300" :
                finished ? "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300" : "text-muted-foreground",
            )}>
              {status}
            </span>
          </div>
          <ol id={`${id}-trace`} aria-labelledby={`${id}-trace-label`} className="space-y-0">
            {steps.map((step, index) => {
              const visible = index < revealed;
              const current = index === revealed - 1;
              return (
                <li key={index} aria-current={current ? "step" : undefined} className="relative flex gap-3 pb-4 last:pb-0">
                  {index < steps.length - 1 && <span aria-hidden="true" className="absolute start-3.5 top-7 bottom-0 w-px bg-border" />}
                  <span aria-hidden="true" className={cn(
                    "relative z-10 flex size-7 shrink-0 items-center justify-center rounded-full border bg-background font-mono text-xs",
                    visible ? step.warning ? "border-amber-500/50 text-amber-700 dark:text-amber-300" : "border-primary/40 text-primary" : "text-muted-foreground/60",
                  )}>
                    {visible && index === 2 ? config.tools ? <ShieldCheck className="size-3.5" /> : <ShieldX className="size-3.5" /> : visible && index === 5 && verified ? <Check className="size-3.5" /> : index + 1}
                  </span>
                  <div className="min-w-0 flex-1 pt-1">
                    <p className={cn("text-sm font-medium", !visible && "text-muted-foreground")}>{step.title}</p>
                    {visible && (
                      <div className={cn("mt-2 space-y-2 rounded-md border-s-2 py-1 ps-3", step.warning ? "border-amber-500/50" : "border-primary/20")}>
                        {step.body.map((paragraph, bodyIndex) => <p key={bodyIndex} className="text-xs leading-relaxed text-muted-foreground">{paragraph}</p>)}
                      </div>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-end gap-2 border-t bg-muted/20 p-3 sm:px-5">
        <Button type="button" variant="ghost" size="sm" onClick={() => setRevealed(0)} disabled={revealed === 0}>
          <RotateCcw aria-hidden="true" className="size-3.5" />{copy.reset}
        </Button>
        <Button type="button" size="sm" aria-controls={`${id}-trace`} disabled={finished} onClick={() => setRevealed(previous => Math.min(previous + 1, steps.length))}>
          {revealed === 0 ? copy.start : copy.next}<ArrowRight aria-hidden="true" className="size-3.5 rtl:rotate-180" />
        </Button>
      </div>
      <p role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        {status}{activeStep ? `: ${activeStep.title}. ${activeStep.body.join(" ")}` : ""}
      </p>
    </section>
  );
}
