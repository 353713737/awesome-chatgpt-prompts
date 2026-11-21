import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import userEvent from "@testing-library/user-event";
import { ToolsDemo, type ToolsDemoCopy } from "./tools-demo";

const copy: ToolsDemoCopy = {
  title: "Tool connection simulator",
  description: "Scripted only; no AI calls or real connections. Both connected modes use the same test account.",
  routeLabel: "Connection route",
  directLabel: "Direct API",
  mcpLabel: "MCP",
  toolLabel: "Requested action",
  readLabel: "Search issues",
  writeLabel: "Create issue",
  accessLabel: "Connection and scope",
  disconnectedLabel: "Disconnected",
  readOnlyLabel: "Read-only",
  readWriteLabel: "Read and write",
  appLabel: "AI app",
  hostLabel: "AI app and MCP client",
  connectorLabel: "Direct connector",
  serverLabel: "Issue-tracker MCP server",
  serviceLabel: "Fictional issue tracker",
  requestLabel: "Request preview",
  resultLabel: "Result",
  run: "Try request",
  reset: "Reset",
  approve: "Approve this write",
  decline: "Decline this write",
  query: "empty search",
  issueTitle: "Follow up on BUG-42",
  policyNote: "The route does not grant access. This demo app requires separate approval for writes.",
  states: {
    ready: "Choose a request to simulate.",
    disconnected: "No connection is configured. No tool ran.",
    denied: "The account only allows reads. No write was sent.",
    read: "Found BUG-42. No issue was changed.",
    approval: "Write access is available, but this app still requires approval. Nothing has been created.",
    created: "Simulated issue FOLLOWUP-108 was created.",
    declined: "Approval was declined. No issue was created.",
  },
};

describe("ToolsDemo", () => {
  it.each([copy.directLabel, copy.mcpLabel])("keeps read-only access read-only over %s", async route => {
    const user = userEvent.setup();
    render(<ToolsDemo copy={copy} />);
    await user.click(screen.getByRole("button", { name: route }));
    await user.click(screen.getByRole("button", { name: copy.run }));
    expect(screen.getByRole("status")).toHaveTextContent(copy.states.read);

    await user.click(screen.getByRole("button", { name: copy.writeLabel }));
    await user.click(screen.getByRole("button", { name: copy.run }));
    expect(screen.getByRole("status")).toHaveTextContent(copy.states.denied);
    expect(screen.queryByRole("button", { name: copy.approve })).not.toBeInTheDocument();
  });

  it.each([copy.directLabel, copy.mcpLabel])("does not imply a connection is created by selecting %s", async route => {
    const user = userEvent.setup();
    render(<ToolsDemo copy={copy} />);
    await user.click(screen.getByRole("button", { name: copy.disconnectedLabel }));
    await user.click(screen.getByRole("button", { name: route }));
    await user.click(screen.getByRole("button", { name: copy.run }));
    expect(screen.getByRole("status")).toHaveTextContent(copy.states.disconnected);
    expect(screen.queryByRole("button", { name: copy.approve })).not.toBeInTheDocument();
  });

  it.each([copy.approve, copy.decline])("waits for explicit per-action approval and handles %s", async answer => {
    const user = userEvent.setup();
    render(<ToolsDemo copy={copy} />);
    await user.click(screen.getByRole("button", { name: copy.writeLabel }));
    await user.click(screen.getByRole("button", { name: copy.readWriteLabel }));
    await user.click(screen.getByRole("button", { name: copy.run }));
    expect(screen.getByRole("status")).toHaveTextContent(copy.states.approval);
    expect(screen.getByRole("button", { name: copy.run })).toBeDisabled();

    await user.click(screen.getByRole("button", { name: answer }));
    expect(screen.getByRole("status")).toHaveTextContent(answer === copy.approve ? copy.states.created : copy.states.declined);
    expect(screen.queryByRole("button", { name: copy.approve })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: copy.run })).toHaveFocus();
  });

  it.each([copy.mcpLabel, copy.readLabel, copy.readOnlyLabel])("discards pending approval when %s changes", async setting => {
    const user = userEvent.setup();
    render(<ToolsDemo copy={copy} />);
    await user.click(screen.getByRole("button", { name: copy.writeLabel }));
    await user.click(screen.getByRole("button", { name: copy.readWriteLabel }));
    await user.click(screen.getByRole("button", { name: copy.run }));
    await user.click(screen.getByRole("button", { name: setting }));
    expect(screen.getByRole("status")).toHaveTextContent(copy.states.ready);
    expect(screen.queryByRole("button", { name: copy.approve })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: copy.run })).toBeEnabled();
  });

  it("updates the route diagram without preserving a result from another configuration", async () => {
    const user = userEvent.setup();
    render(<ToolsDemo copy={copy} />);
    await user.click(screen.getByRole("button", { name: copy.run }));
    await user.click(screen.getByRole("button", { name: copy.mcpLabel }));
    const diagram = within(screen.getByRole("list", { name: copy.routeLabel }));
    expect(diagram.getByText(copy.hostLabel)).toBeVisible();
    expect(diagram.getByText(copy.serverLabel)).toBeVisible();
    expect(diagram.queryByText(copy.connectorLabel)).not.toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent(copy.states.ready);
  });
});
