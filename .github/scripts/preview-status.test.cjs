const assert = require("node:assert/strict");
const test = require("node:test");
const { updatePreviewComment } = require("./preview-status.cjs");

function fixture(comments = []) {
  const calls = [];
  const issues = {
    listComments() {},
    async createComment({ body }) {
      calls.push("create");
      comments.push({ id: 99, body, user: { login: "github-actions[bot]" } });
    },
    async updateComment({ comment_id, body }) {
      calls.push("update");
      comments.find((comment) => comment.id === comment_id).body = body;
    },
    async deleteComment({ comment_id }) {
      calls.push("delete");
      comments.splice(comments.findIndex((comment) => comment.id === comment_id), 1);
    },
  };
  return {
    calls, comments,
    github: { rest: { issues }, paginate: async () => comments },
    context: { repo: { owner: "opentdf", repo: "docs" } },
  };
}

test("success replaces the legacy failure comment", async () => {
  const state = fixture([{
    id: 1, body: "❌ Surge preview build failed — no preview was deployed.",
    user: { login: "github-actions[bot]" },
  }]);
  await updatePreviewComment({ ...state, prNumber: 398, status: "deployed" });
  assert.deepEqual(state.calls, ["update"]);
  assert.match(state.comments[0].body, /Preview deployed to https:\/\/opentdf-docs-pr-398\.surge\.sh/);
});

test("duplicate bot statuses are removed without touching reviewer comments", async () => {
  const state = fixture([
    { id: 1, body: "📄 Preview deployed to https://opentdf-docs-pr-398.surge.sh", user: { login: "github-actions[bot]" } },
    { id: 2, body: "❌ Surge preview build failed", user: { login: "github-actions[bot]" } },
    { id: 3, body: "<!-- opentdf-surge-preview-status:1:2 -->\n❌ Surge preview build failed", user: { login: "github-actions[bot]" } },
    { id: 4, body: "❌ Surge preview build failed", user: { login: "reviewer" } },
  ]);
  await updatePreviewComment({ ...state, prNumber: 398, status: "deployed" });
  assert.deepEqual(state.calls, ["update", "delete", "delete"]);
  assert.deepEqual(state.comments.map((comment) => comment.id), [3, 4]);
});

test("repeat failures reuse the same comment, then success clears the failure", async () => {
  const state = fixture();
  const args = { ...state, prNumber: 398, runUrl: "https://github.com/opentdf/docs/actions/runs/7" };
  await updatePreviewComment({ ...args, status: "build-failed" });
  await updatePreviewComment({ ...args, status: "build-failed" });
  await updatePreviewComment({ ...args, status: "deployed" });
  assert.deepEqual(state.calls, ["create", "update"]);
  assert.equal(state.comments.length, 1);
  assert.match(state.comments[0].body, /Preview deployed/);
});
