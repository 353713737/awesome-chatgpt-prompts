import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import userEvent from "@testing-library/user-event";
import { HarnessDemo, type HarnessDemoCopy } from "./harness-demo";

const copy: HarnessDemoCopy = {
  title: "Harness simulation",
  description: "A scripted example. No model or tools run.",
  taskLabel: "Task",
  task: "Fix empty search results",
  modelLabel: "Model",
  model: "Same model",
  controlsLabel: "Configure the harness",
  resetHint: "Changing a setting resets the trace.",
  traceLabel: "Execution trace",
  ready: "Ready",
  running: "In progress",
  complete: "Checked in this simulation",
  unverified: "Unverified",
  start: "Start",
  next: "Next step",
  reset: "Reset",
  controls: {
    clearPrompt: { label: "Clear prompt", description: "Define the expected outcome." },
    skill: { label: "Bug-fix skill", description: "Load a reusable workflow." },
    tools: { label: "Workspace tools", description: "Allow inspection and tests." },
  },
  steps: {
    context: { title: "Build context", clearPrompt: "Show an empty state and run search tests.", vaguePrompt: "Fix search.", skillLoaded: "Bug-fix workflow loaded.", skillMissing: "No skill loaded." },
    request: { title: "Model request", guided: "Inspect the implementation and edge cases.", unguided: "Inspect the implementation." },
    permission: { title: "Permission check", allowed: "Workspace actions allowed.", blocked: "Workspace actions blocked." },
    observation: { title: "Tool results", guided: "The script returns search and edge-case test results.", unguided: "The script returns search test results.", unavailable: "No files changed or tests run." },
    review: { title: "Review evidence", checked: "The scripted checks match the criteria.", unclear: "The requested outcome remains unclear.", unavailable: "No evidence available." },
    finish: { title: "Stop", verified: "Limited checks complete, not a guarantee of no bugs.", unverified: "Return guidance with the missing evidence." },
  },
};

async function finishTrace(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole("button", { name: copy.start }));
  for (let i = 1; i < 6; i++) await user.click(screen.getByRole("button", { name: copy.next }));
}

describe("HarnessDemo", () => {
  it("blocks execution without tools and never claims successful verification", async () => {
    const user = userEvent.setup();
    render(<HarnessDemo copy={copy} />);
    await user.click(screen.getByRole("checkbox", { name: /Workspace tools/ }));
    await finishTrace(user);

    const trace = within(screen.getByRole("list", { name: copy.traceLabel }));
    expect(trace.getByText(copy.steps.permission.blocked)).toBeVisible();
    expect(trace.getByText(copy.steps.observation.unavailable)).toBeVisible();
    expect(trace.queryByText(copy.steps.observation.guided)).not.toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent(copy.unverified);
    expect(screen.getByRole("button", { name: copy.next })).toBeDisabled();
  });

  it("can complete the scripted checks without a skill", async () => {
    const user = userEvent.setup();
    render(<HarnessDemo copy={copy} />);
    await user.click(screen.getByRole("checkbox", { name: /Bug-fix skill/ }));
    await finishTrace(user);

    const trace = within(screen.getByRole("list", { name: copy.traceLabel }));
    expect(trace.getByText(copy.steps.request.unguided)).toBeVisible();
    expect(trace.getByText(copy.steps.observation.unguided)).toBeVisible();
    expect(screen.getByRole("status")).toHaveTextContent(copy.complete);
  });

  it("does not treat tool output as proof of meeting an unclear goal", async () => {
    const user = userEvent.setup();
    render(<HarnessDemo copy={copy} />);
    await user.click(screen.getByRole("checkbox", { name: /Clear prompt/ }));
    await finishTrace(user);

    const trace = within(screen.getByRole("list", { name: copy.traceLabel }));
    expect(trace.getByText(copy.steps.observation.guided)).toBeVisible();
    expect(trace.getByText(copy.steps.review.unclear)).toBeVisible();
    expect(screen.getByRole("status")).toHaveTextContent(copy.unverified);
  });

  it.each([/Clear prompt/, /Bug-fix skill/, /Workspace tools/])("clears completed evidence when %s changes", async controlName => {
    const user = userEvent.setup();
    render(<HarnessDemo copy={copy} />);
    await finishTrace(user);
    await user.click(screen.getByRole("checkbox", { name: controlName }));

    expect(screen.getByRole("status")).toHaveTextContent(copy.ready);
    expect(screen.queryByText(copy.steps.finish.verified)).not.toBeInTheDocument();
    expect(screen.queryByText(copy.steps.observation.guided)).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: copy.start })).toBeEnabled();
  });

  it("resets the trace without silently changing the selected configuration", async () => {
    const user = userEvent.setup();
    render(<HarnessDemo copy={copy} />);
    await user.click(screen.getByRole("checkbox", { name: /Workspace tools/ }));
    await finishTrace(user);
    await user.click(screen.getByRole("button", { name: copy.reset }));

    expect(screen.getByRole("status")).toHaveTextContent(copy.ready);
    expect(screen.getByRole("checkbox", { name: /Workspace tools/ })).not.toBeChecked();
    expect(screen.getByRole("button", { name: copy.start })).toBeEnabled();
  });
});
