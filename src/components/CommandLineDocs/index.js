import { ErrorBoundary } from "react-error-boundary";
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";

function Flag({
  name,
  shorthand,
  description,
  default: defaultValue,
  required,
}) {
  const flag = (
    <code>
      --{name} &lt;{name}&gt;
    </code>
  );
  const shorthandFlag = shorthand && (
    <>
      <code>-{shorthand}</code>,
    </>
  );
  return (
    <dl>
      <dt>
        {shorthandFlag} {flag}
      </dt>
      <dd>
        {description}
        &nbsp;(<em>required</em>: <code>{required ? "true" : "false"}</code>)
        {defaultValue && (
          <>
            &nbsp;(<em>default</em>: <code>{defaultValue}</code>)
          </>
        )}
      </dd>
    </dl>
  );
}

function renderFlags(flags) {
  if (!flags) return null;
  return (
    <div>
      <h2>Options</h2>
      {flags?.map((flag) => (
        <Flag {...flag} />
      ))}
    </div>
  );
}

function renderAliases(aliases) {
  if (!aliases) return null;
  return (
    <div>
      <h2>Aliases</h2>
      {aliases?.map((alias, i) => (
        <>
          <code>{alias}</code>
          {i < aliases.length - 1 && ", "}
        </>
      ))}
    </div>
  );
}

function RenderCLICommand({ children, fullCommand, title, command }) {
  console.log(command);

  const {
    flags,
    args,
    arbitrary_args: arbitraryArgs,
    aliases,
    hidden,
  } = command;

  let synopsis = fullCommand;
  // add flag placeholder if flags are present
  if (flags) {
    synopsis += " [flags]";
  }

  // construct arguments
  if (args) {
    synopsis +=
      " " +
      args
        .map((arg) => {
          return `<${arg}>`;
        })
        .join(" ");
  }

  if (arbitraryArgs) {
    synopsis +=
      " " +
      arbitraryArgs
        .map((arg) => {
          return `[${arg}]`;
        })
        .join(" ");
  }

  return (
    <>
      <div>
        <p>
          {command.name} - {title}
        </p>
      </div>
      <div>
        <h2>Synopsis</h2>
        <pre>
          <code>{synopsis}</code>
        </pre>
      </div>
      <div>
        <h2>Description</h2>
        {children}
      </div>
      {renderFlags(flags)}
      {renderAliases(aliases)}
    </>
  );
}

export default function ({ children, ...props }) {
  return (
    <ErrorBoundary
      fallback={({ error, tryAgain }) => (
        <div>
          <p>This component crashed because of error: {error.message}.</p>
          <button onClick={tryAgain}>Try Again!</button>
        </div>
      )}
    >
      <RenderCLICommand {...props}>{children}</RenderCLICommand>
    </ErrorBoundary>
  );
}
