const marker = "<!-- opentdf-surge-preview-status -->";

function isPreviewComment(comment) {
  if (comment.user?.login !== "github-actions[bot]") {
    return false;
  }

  const body = comment.body || "";
  return body.includes(marker) ||
    body.startsWith("❌ Surge preview build failed") ||
    body.startsWith("📄 Preview deployed to https://opentdf-docs-pr-");
}

function statusBody(status, previewUrl, runUrl) {
  switch (status) {
    case "deployed":
      return `📄 Preview deployed to ${previewUrl}`;
    case "build-failed":
      return `❌ Surge preview build failed. The preview was not updated. [Build logs](${runUrl})`;
    case "deploy-failed":
      return `❌ Surge preview deployment failed. [Workflow logs](${runUrl})`;
    case "removed":
      return "🧹 Surge preview removed.";
    case "teardown-failed":
      return `❌ Surge preview teardown failed. [Workflow logs](${runUrl})`;
    default:
      throw new Error(`Unknown preview status: ${status}`);
  }
}

async function updatePreviewComment({ github, context, prNumber, status, runUrl }) {
  if (!Number.isInteger(prNumber) || prNumber < 1) {
    throw new Error(`Invalid PR number: ${prNumber}`);
  }

  const { owner, repo } = context.repo;
  const issue_number = prNumber;
  const previewUrl = `https://opentdf-docs-pr-${prNumber}.surge.sh`;
  const workflowUrl = runUrl || `${process.env.GITHUB_SERVER_URL || "https://github.com"}/${owner}/${repo}/actions/runs/${context.runId}`;
  const body = `${marker}\n${statusBody(status, previewUrl, workflowUrl)}`;
  const comments = await github.paginate(github.rest.issues.listComments, {
    owner,
    repo,
    issue_number,
    per_page: 100,
  });
  const previewComments = comments.filter(isPreviewComment);
  const current = [...previewComments].reverse().find((comment) => comment.body.includes(marker)) ||
    previewComments[previewComments.length - 1];

  if (current) {
    if (current.body !== body) {
      await github.rest.issues.updateComment({ owner, repo, comment_id: current.id, body });
    }
  } else {
    await github.rest.issues.createComment({ owner, repo, issue_number, body });
  }

  for (const comment of previewComments) {
    if (comment.id !== current?.id) {
      await github.rest.issues.deleteComment({ owner, repo, comment_id: comment.id });
    }
  }
}

module.exports = { updatePreviewComment };
