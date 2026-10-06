const assert = require("node:assert/strict");
const test = require("node:test");
const { isStalePreviewRun, updatePreviewComment } = require("./preview-status.cjs");
const sourceTime = "2026-10-06T15:00:00Z";

function fixture(comments = []) {
  const calls = [];
  const context = { repo: { owner: "opentdf", repo: "docs" }, runId: 123 };
  const issues = {
    listComments() {},
    async createComment({ body }) {
      calls.push(["create", body]);
      comments.push({ id: 1000, body, user: { login: "github-actions[bot]" } });
    },
    async updateComment({ comment_id, body }) {
      calls.push(["update", comment_id, body]);
      comments.find((comment) => comment.id === comment_id).body = body;
    },
    async deleteComment({ comment_id }) {
      calls.push(["delete", comment_id]);
      comments.splice(comments.findIndex((comment) => comment.id === comment_id), 1);
    },
  };
  const github = {
    rest: { issues },
    async paginate(method, options) {
      assert.equal(method, issues.listComments);
      assert.equal(options.issue_number, 398);
      return comments;
    },
  };

  return { calls, comments, context, github };
}

test("a successful build replaces a legacy failure comment", async () => {
  const state = fixture([{
    id: 42,
    body: "❌ Surge preview build failed — no preview was deployed.",
    user: { login: "github-actions[bot]" },
  }]);

  await updatePreviewComment({
    github: state.github,
    context: state.context,
    prNumber: 398,
    status: "deployed",
    sourceTime,
  });

  assert.deepEqual(state.calls.map((call) => call.slice(0, 2)), [["update", 42]]);
  assert.match(state.comments[0].body, /Preview deployed to https:\/\/opentdf-docs-pr-398\.surge\.sh/);
});

test("duplicate preview comments are removed without touching other comments", async () => {
  const state = fixture([
    { id: 1, body: "📄 Preview deployed to https://opentdf-docs-pr-398.surge.sh", user: { login: "github-actions[bot]" } },
    { id: 2, body: "❌ Surge preview build failed", user: { login: "github-actions[bot]" } },
    { id: 3, body: "<!-- opentdf-surge-preview-status -->\n❌ Surge preview build failed", user: { login: "github-actions[bot]" } },
    { id: 4, body: "❌ Surge preview build failed", user: { login: "reviewer" } },
  ]);

  await updatePreviewComment({
    github: state.github,
    context: state.context,
    prNumber: 398,
    status: "deployed",
    sourceTime,
  });

  assert.deepEqual(state.calls.map((call) => call.slice(0, 2)), [
    ["update", 3], ["delete", 1], ["delete", 2],
  ]);
  assert.deepEqual(state.comments.map((comment) => comment.id), [3, 4]);
});

test("new status comments are reused for later runs", async () => {
  const state = fixture();
  const args = { github: state.github, context: state.context, prNumber: 398, sourceTime };

  await updatePreviewComment({ ...args, status: "build-failed", runUrl: "https://github.com/opentdf/docs/actions/runs/7" });
  await updatePreviewComment({ ...args, status: "build-failed", runUrl: "https://github.com/opentdf/docs/actions/runs/7" });
  await updatePreviewComment({ ...args, status: "deployed" });

  assert.deepEqual(state.calls.map((call) => call[0]), ["create", "update"]);
  assert.match(state.calls[0][1], /actions\/runs\/7/);
  assert.equal(state.comments.length, 1);
});

test("an older run cannot replace a newer status", async () => {
  const state = fixture();
  const args = { github: state.github, context: state.context, prNumber: 398 };

  await updatePreviewComment({ ...args, status: "deployed", sourceTime: "2026-10-06T16:00:00Z", sourceRunId: 200 });
  const stale = await isStalePreviewRun({ ...args, sourceTime: "2026-10-06T15:00:00Z", sourceRunId: 100 });
  const sameSecondOlderRun = await isStalePreviewRun({ ...args, sourceTime: "2026-10-06T16:00:00Z", sourceRunId: 199 });
  await updatePreviewComment({ ...args, status: "build-failed", sourceTime: "2026-10-06T15:00:00Z", sourceRunId: 100 });

  assert.equal(stale, true);
  assert.equal(sameSecondOlderRun, true);
  assert.deepEqual(state.calls.map((call) => call[0]), ["create"]);
  assert.match(state.comments[0].body, /Preview deployed/);
});
