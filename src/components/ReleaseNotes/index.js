import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';

const GitHubReleases = ({ repo, filter = 'all' }) => {
  const [releases, setReleases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReleases = async () => {
      const response = await fetch(`https://api.github.com/repos/${repo}/releases`);
      const data = await response.json();
      setReleases(data);
      setLoading(false);
    };

    fetchReleases();
  }, [repo]);

  // Apply the filter to the releases
  const filteredReleases = releases.filter(release => {
    if (filter === 'all') {
      return true;
    }
    // Adjust this condition to match how the filter should work, e.g., checking tags or release names
    return release.tag_name.includes(filter) || release.name.includes(filter);
  });

  if (loading) return <p>Loading releases...</p>;

  return (
    <div>
      {filteredReleases.length > 0 ? (
        <ul>
          {filteredReleases.map(release => (
            <li key={release.id}>
              <a href={release.html_url} target="_blank" rel="noopener noreferrer">
                {release.name || release.tag_name}
              </a>
              <div>
                <small>Published on {new Date(release.published_at).toLocaleDateString()}</small>
              </div>
              <ReactMarkdown remarkPlugins={[gfm]}>{release.body}</ReactMarkdown>
            </li>
          ))}
        </ul>
      ) : (
        <p>No releases found matching filter.</p>
      )}
    </div>
  );
};

export default GitHubReleases;
