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

export default function SdkVersion({ language, version, source, status = 'added', removal }: SdkVersionProps) {
  const label = labels[language] ?? language;
  const url = releaseUrl(language, version, source);
  const versionLink = <a href={url}>{label} v{version}</a>;

  if (status === 'deprecated') {
    const removalUrl = removal ? releaseUrl(language, removal, source) : '';
    return (
      <strong style={{ color: 'var(--ifm-color-warning-darkest)' }}>
        Deprecated in {versionLink}
        {removal && (
          <>, scheduled for removal in {removalUrl
            ? <a href={removalUrl}>v{removal}</a>
            : <>v{removal}</>
          }</>
        )}
      </strong>
    );
  }

  return (
    <em>
      Available since {versionLink}
    </em>
  );
}
