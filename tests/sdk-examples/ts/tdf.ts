/**
 * Compile-only type-assertion tests for the OpenTDF TypeScript SDK.
 * These functions are never run; they exist solely so that `tsc --noEmit` will fail
 * if a documented method signature or option property drifts from the actual SDK.
 *
 * Return-type annotations act as the type assertions:
 *   async function f(): Promise<DecoratedStream>  →  compile error if createZTDF return type changes
 *   function f(): TDFReader                        →  compile error if open return type changes
 */

import type {
  CreateZTDFOptions,
  DecoratedStream,
  ReadOptions,
  Source,
  TDFReader,
} from "@opentdf/sdk";
import { OpenTDF } from "@opentdf/sdk";

// A minimal Source value used to populate required option fields without runtime deps.
const mockSource: Source = { type: "buffer", location: new Uint8Array() };

/**
 * Verifies: createZTDF(opts: CreateZTDFOptions) => Promise<DecoratedStream>
 * Also verifies key CreateZTDFOptions property names and types.
 */
async function verifyCreateZTDF(client: OpenTDF): Promise<DecoratedStream> {
  const opts: CreateZTDFOptions = {
    source: mockSource,
    attributes: ["https://example.com/attr/clearance/value/executive"],
    defaultKASEndpoint: "https://kas.example.com",
    mimeType: "text/plain",
    metadata: { info: "example" },
    splitPlan: [{ kas: "https://kas.example.com" }],
    autoconfigure: true,
  };
  return client.createZTDF(opts);
}

/**
 * Verifies: read(opts: ReadOptions) => Promise<DecoratedStream>
 * Also verifies key ReadOptions property names and types.
 */
async function verifyRead(client: OpenTDF): Promise<DecoratedStream> {
  const opts: ReadOptions = {
    source: mockSource,
    platformUrl: "https://platform.example.com",
    allowedKASEndpoints: ["https://kas.example.com"],
    ignoreAllowlist: false,
    noVerify: false,
  };
  return client.read(opts);
}

/**
 * Verifies: open(opts: ReadOptions) => TDFReader  (synchronous, no Promise)
 */
function verifyOpen(client: OpenTDF): TDFReader {
  const opts: ReadOptions = { source: mockSource };
  return client.open(opts);
}

// Suppress unused-variable warnings so the file compiles under --strict
export { verifyCreateZTDF, verifyOpen, verifyRead };
