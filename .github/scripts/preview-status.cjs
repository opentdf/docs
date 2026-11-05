const marker = "<!-- opentdf-surge-preview-status -->";

/** Reuse one bot preview comment and remove older duplicate statuses. */
async function updatePreviewComment({ github, context, prNumber, status, runUrl }) {
  if (!Number.isSafeInteger(prNumber) || prNumber < 1) {
    throw new Error("Invalid PR number");
  }
  const previewUrl = `https://opentdf-docs-pr-${prNumber}.surge.sh`;
  const message = {
    deployed: `📄 Preview deployed to ${previewUrl}`,
    "build-failed": `❌ Surge preview build failed. [Build logs](${runUrl})`,
    "deploy-failed": `❌ Surge preview deployment failed. [Workflow logs](${runUrl})`,
  }[status];
  if (!message) throw new Error(`Unknown preview status: ${status}`);

  const comments = (await github.paginate(github.rest.issues.listComments, {
    ...context.repo, issue_number: prNumber, per_page: 100,
  })).filter((comment) => comment.user?.login === "github-actions[bot]" && (
    comment.body?.startsWith("<!-- opentdf-surge-preview-status") ||
    comment.body?.startsWith("❌ Surge preview build failed") ||
    comment.body?.startsWith("📄 Preview deployed to https://opentdf-docs-pr-")
  ));
  const current = comments.findLast((comment) =>
    comment.body?.startsWith("<!-- opentdf-surge-preview-status")) ?? comments.at(-1);
  const body = `${marker}\n${message}`;
  if (current?.body !== body) {
    if (current) {
      await github.rest.issues.updateComment({ ...context.repo, comment_id: current.id, body });
    } else {
      await github.rest.issues.createComment({ ...context.repo, issue_number: prNumber, body });
    }
  }
  for (const comment of comments) {
    if (comment.id !== current?.id) {
      await github.rest.issues.deleteComment({ ...context.repo, comment_id: comment.id });
    }
  }
}

module.exports = { updatePreviewComment };
