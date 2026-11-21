"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ArrowDown, ArrowRight, Bot, Check, Cable, LockKeyhole, Network, RotateCcw, Search, ShieldQuestion, Ticket, Unplug, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Route = "direct" | "mcp";
type Tool = "search_issues" | "create_issue";
type Access = "disconnected" | "readOnly" | "readWrite";
type Result = "ready" | "disconnected" | "denied" | "read" | "approval" | "created" | "declined";

export interface ToolsDemoCopy {
  title: string;
  description: string;
  routeLabel: string;
  directLabel: string;
  mcpLabel: string;
  toolLabel: string;
  readLabel: string;
  writeLabel: string;
  accessLabel: string;
  disconnectedLabel: string;
  readOnlyLabel: string;
  readWriteLabel: string;
  appLabel: string;
  hostLabel: string;
  connectorLabel: string;
  serverLabel: string;
  serviceLabel: string;
  requestLabel: string;
  resultLabel: string;
  run: string;
  reset: string;
  approve: string;
  decline: string;
  query: string;
  issueTitle: string;
  policyNote: string;
  states: Record<Result, string>;
}

interface ToolsDemoProps {
  copy: ToolsDemoCopy;
}

interface ChoiceGroupProps<Value extends string> {
  label: string;
  value: Value;
  options: { value: Value; label: string }[];
  onChange: (value: Value) => void;
}

function ChoiceGroup<Value extends string>({ label, value, options, onChange }: ChoiceGroupProps<Value>) {
  return (
    <fieldset className="min-w-0">
      <legend className="mb-2 text-sm font-semibold">{label}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map(option => (
          <Button
            key={option.value}
            type="button"
            variant="outline"
            size="sm"
            aria-pressed={value === option.value}
            onClick={() => onChange(option.value)}
            className={cn("h-auto min-h-8 whitespace-normal text-start", value === option.value && "border-primary/40 bg-primary/10 text-primary")}
          >
            {option.label}
          </Button>
        ))}
      </div>
    </fieldset>
  );
}

const RESULT_ICONS = { ready: Cable, disconnected: Unplug, denied: LockKeyhole, read: Search, approval: ShieldQuestion, created: Check, declined: X };

export function ToolsDemo({ copy }: ToolsDemoProps) {
  const id = useId();
  const [route, setRoute] = useState<Route>("direct");
  const [tool, setTool] = useState<Tool>("search_issues");
  const [access, setAccess] = useState<Access>("readOnly");
  const [result, setResult] = useState<Result>("ready");
  const approvalRef = useRef<HTMLDivElement>(null);
  const runRef = useRef<HTMLButtonElement>(null);
  const ResultIcon = RESULT_ICONS[result];
  const args = tool === "search_issues" ? { query: copy.query } : { title: copy.issueTitle };
  const nodes = [
    { label: route === "mcp" ? copy.hostLabel : copy.appLabel, Icon: Bot },
    { label: route === "mcp" ? copy.serverLabel : copy.connectorLabel, Icon: route === "mcp" ? Network : Cable },
    { label: copy.serviceLabel, Icon: Ticket },
  ];

  useEffect(() => {
    if (result === "approval") approvalRef.current?.focus();
    else if (result === "created" || result === "declined") runRef.current?.focus();
  }, [result]);

  function runRequest() {
    if (access === "disconnected") setResult("disconnected");
    else if (tool === "search_issues") setResult("read");
    else if (access === "readOnly") setResult("denied");
    else setResult("approval");
  }

  function answerApproval(approved: boolean) {
    if (result === "approval" && access === "readWrite" && tool === "create_issue") {
      setResult(approved ? "created" : "declined");
    }
  }

  return (
    <section aria-labelledby={`${id}-title`} className="not-prose my-8 overflow-hidden rounded-xl border bg-background">
      <div className="border-b bg-muted/30 p-4 sm:p-5">
        <h4 id={`${id}-title`} className="text-base font-semibold tracking-tight">{copy.title}</h4>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{copy.description}</p>
      </div>

      <div className="space-y-5 p-4 sm:p-5">
        <ChoiceGroup<Route>
          label={copy.routeLabel}
          value={route}
          options={[{ value: "direct", label: copy.directLabel }, { value: "mcp", label: copy.mcpLabel }]}
          onChange={value => { setRoute(value); setResult("ready"); }}
        />

        <ol aria-label={copy.routeLabel} className="flex flex-col gap-2 rounded-lg border border-dashed bg-muted/20 p-3 sm:flex-row sm:items-stretch">
          {nodes.map(({ label, Icon }, index) => (
            <li key={index} className="flex min-w-0 flex-1 flex-col items-center gap-2 sm:flex-row">
              <div className="flex min-h-20 w-full min-w-0 flex-1 flex-col items-center justify-center gap-2 rounded-md border bg-background p-3 text-center">
                <Icon aria-hidden="true" className="size-5 text-primary" />
                <span className="text-xs font-medium leading-relaxed">{label}</span>
              </div>
              {index < nodes.length - 1 && <span aria-hidden="true" className="shrink-0 text-muted-foreground">
                <ArrowRight className="hidden size-4 sm:block rtl:rotate-180" />
                <ArrowDown className="size-4 sm:hidden" />
              </span>}
            </li>
          ))}
        </ol>

        <div className="grid gap-5 sm:grid-cols-2">
          <ChoiceGroup<Tool>
            label={copy.toolLabel}
            value={tool}
            options={[{ value: "search_issues", label: copy.readLabel }, { value: "create_issue", label: copy.writeLabel }]}
            onChange={value => { setTool(value); setResult("ready"); }}
          />
          <ChoiceGroup<Access>
            label={copy.accessLabel}
            value={access}
            options={[
              { value: "disconnected", label: copy.disconnectedLabel },
              { value: "readOnly", label: copy.readOnlyLabel },
              { value: "readWrite", label: copy.readWriteLabel },
            ]}
            onChange={value => { setAccess(value); setResult("ready"); }}
          />
        </div>

        <div className="grid overflow-hidden rounded-lg border sm:grid-cols-2">
          <div className="min-w-0 border-b p-4 sm:border-b-0 sm:border-e">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{copy.requestLabel}</p>
            <pre dir="ltr" className="overflow-x-auto whitespace-pre-wrap break-words text-xs leading-relaxed"><code>{`${tool}(${JSON.stringify(args, null, 2)})`}</code></pre>
          </div>
          <div className={cn(
            "min-w-0 p-4",
            (result === "denied" || result === "disconnected") && "bg-amber-500/5",
            (result === "created" || result === "read") && "bg-emerald-500/5",
          )}>
            <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <ResultIcon aria-hidden="true" className="size-4" />{copy.resultLabel}
            </p>
            <p id={`${id}-result`} role="status" aria-live="polite" aria-atomic="true" className="text-sm leading-relaxed">{copy.states[result]}</p>
            {result === "approval" && (
              <div ref={approvalRef} tabIndex={-1} aria-describedby={`${id}-result`} className="mt-4 flex flex-wrap gap-2 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                <Button type="button" variant="outline" size="sm" className="h-auto min-h-8 whitespace-normal" onClick={() => answerApproval(false)}>{copy.decline}</Button>
                <Button type="button" size="sm" className="h-auto min-h-8 whitespace-normal" onClick={() => answerApproval(true)}>{copy.approve}</Button>
              </div>
            )}
          </div>
        </div>
        <p className="text-xs leading-relaxed text-muted-foreground">{copy.policyNote}</p>
      </div>

      <div className="flex flex-wrap items-center justify-end gap-2 border-t bg-muted/20 p-3 sm:px-5">
        <Button type="button" variant="ghost" size="sm" onClick={() => setResult("ready")} disabled={result === "ready"}>
          <RotateCcw aria-hidden="true" className="size-3.5" />{copy.reset}
        </Button>
        <Button ref={runRef} type="button" size="sm" aria-controls={`${id}-result`} disabled={result === "approval"} onClick={runRequest}>
          {copy.run}<ArrowRight aria-hidden="true" className="size-3.5 rtl:rotate-180" />
        </Button>
      </div>
    </section>
  );
}
