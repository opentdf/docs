const marker = "<!-- opentdf-surge-preview-status";
const versionedMarker = /<!-- opentdf-surge-preview-status:(\d+):(\d+) -->/;

/** Identify comments owned by this workflow, including its older comment formats. */
function isPreviewComment(comment) {
  if (comment.user?.login !== "github-actions[bot]") {
    return false;
  }

  const body = comment.body || "";
  return body.includes(marker) ||
    body.startsWith("❌ Surge preview build failed") ||
    body.startsWith("📄 Preview deployed to https://opentdf-docs-pr-");
}

/** Format the current result for the PR timeline. */
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

/** Order runs by the build start time, then by run ID when starts share a second. */
function sourceOrder(context, sourceTime, sourceRunId) {
  const time = Date.parse(sourceTime);
  const runId = Number(sourceRunId ?? context.runId);
  if (!Number.isSafeInteger(time) || !Number.isSafeInteger(runId) || runId < 1) {
    throw new Error("Invalid preview run timestamp or ID");
  }
  return { time, runId };
}

/** Read the run order recorded in a managed comment; older comments have none. */
function commentOrder(comment) {
  const match = comment.body?.match(versionedMarker);
  return match ? { time: Number(match[1]), runId: Number(match[2]) } : undefined;
}

/** Compare two run orders. */
function compareOrder(left, right) {
  return left.time - right.time || left.runId - right.runId;
}

/** Find the newest managed comment, falling back to the last legacy comment. */
function currentComment(comments) {
  const versioned = comments.filter((comment) => commentOrder(comment));
  return versioned.reduce((current, comment) =>
    compareOrder(commentOrder(comment), commentOrder(current)) > 0 ? comment : current,
    versioned[0],
  ) || comments[comments.length - 1];
}

/** List preview status comments on a PR. */
async function previewComments(github, context, prNumber) {
  if (!Number.isSafeInteger(prNumber) || prNumber < 1) {
    throw new Error(`Invalid PR number: ${prNumber}`);
  }
  const comments = await github.paginate(github.rest.issues.listComments, {
    ...context.repo,
    issue_number: prNumber,
    per_page: 100,
  });
  return comments.filter(isPreviewComment);
}

/** Skip a build that started before the status already displayed on this PR. */
async function isStalePreviewRun({ github, context, prNumber, sourceTime, sourceRunId }) {
  const order = sourceOrder(context, sourceTime, sourceRunId);
  const current = currentComment(await previewComments(github, context, prNumber));
  const existingOrder = current && commentOrder(current);
  return Boolean(existingOrder && compareOrder(order, existingOrder) < 0);
}

/** Create or update one preview status comment and remove older duplicates. */
async function updatePreviewComment({ github, context, prNumber, status, runUrl, sourceTime, sourceRunId }) {
  const order = sourceOrder(context, sourceTime, sourceRunId);
  const { owner, repo } = context.repo;
  const issue_number = prNumber;
  const previewUrl = `https://opentdf-docs-pr-${prNumber}.surge.sh`;
  const workflowUrl = runUrl || `${process.env.GITHUB_SERVER_URL || "https://github.com"}/${owner}/${repo}/actions/runs/${context.runId}`;
  const body = `${marker}:${order.time}:${order.runId} -->\n${statusBody(status, previewUrl, workflowUrl)}`;
  const comments = await previewComments(github, context, prNumber);
  const current = currentComment(comments);
  const existingOrder = current && commentOrder(current);

  if (existingOrder && compareOrder(order, existingOrder) < 0) {
    return;
  }

  if (current) {
    if (current.body !== body) {
      await github.rest.issues.updateComment({ owner, repo, comment_id: current.id, body });
    }
  } else {
    await github.rest.issues.createComment({ owner, repo, issue_number, body });
  }

  for (const comment of comments) {
    if (comment.id !== current?.id) {
      await github.rest.issues.deleteComment({ owner, repo, comment_id: comment.id });
    }
  }
}

module.exports = { isStalePreviewRun, updatePreviewComment };
