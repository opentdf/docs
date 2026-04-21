import React from 'react';

type SdkVersionProps = {
  language: 'go' | 'java' | 'js';
  version: string;
  source: 'opentdf';
  status?: 'added' | 'deprecated';
  removal?: string;
};

const labels: Record<string, string> = {
  go: 'Go SDK',
  java: 'Java SDK',
  js: 'JS SDK',
};

function releaseUrl(language: string, version: string, source: string): string {
  if (source === 'opentdf') {
    switch (language) {
      case 'go':
        return `https://github.com/opentdf/platform/releases/tag/sdk/v${version}`;
      case 'java':
        return `https://github.com/opentdf/java-sdk/releases/tag/v${version}`;
      case 'js':
        return `https://github.com/opentdf/web-sdk/releases/tag/sdk-v${version}`;
    }
  }
  return '';
}

function VersionLink({ url, children }: { url: string; children: React.ReactNode }) {
  if (url) {
    return <a href={url} target="_blank" rel="noopener noreferrer">{children}</a>;
  }
  return <>{children}</>;
}

export default function SdkVersion({ language, version, source, status = 'added', removal }: SdkVersionProps) {
  const label = labels[language] ?? language;
  const url = releaseUrl(language, version, source);

  if (status === 'deprecated') {
    const removalUrl = removal ? releaseUrl(language, removal, source) : '';
    return (
      <strong style={{ color: 'var(--ifm-color-warning-darkest)' }}>
        Deprecated in <VersionLink url={url}>{label} v{version}</VersionLink>
        {removal && (
          <>, scheduled for removal in <VersionLink url={removalUrl}>v{removal}</VersionLink></>
        )}
      </strong>
    );
  }

  return (
    <em>
      Available since <VersionLink url={url}>{label} v{version}</VersionLink>
    </em>
  );
}
