import { Action, ActionPanel, List, environment } from "@raycast/api";
import { useExec } from "@raycast/utils";
import { homedir } from "os";
import { useMemo } from "react";

const PLUGINS_DIR = `${homedir()}/.local/share/nvim/lazy`;

export default function Command() {
  // Borrowed from https://github.com/chrisgrieser/alfred-neovim-utilities/blob/main/scripts/search-installed-plugins.js
  const { data, isLoading } = useExec('grep --only-matching --no-filename --max-count=1 "http.*" ./*/.git/config', {
    cwd: PLUGINS_DIR,
    shell: true,
  });

  const plugins = useMemo(
    () =>
      data?.split("\n").map((url) => {
        const nonGitUrl = url.replace(/\.git$/, "");
        const urlParts = nonGitUrl.split("/");

        return {
          url: nonGitUrl,
          name: urlParts[urlParts.length - 1],
          author: urlParts[urlParts.length - 2],
        };
      }) ?? [],
    [data],
  );

  return (
    <List isLoading={isLoading}>
      {plugins.map(({ url, name, author }) => (
        <List.Item
          key={url}
          icon={
            environment.appearance === "dark"
              ? "https://github.githubassets.com/favicons/favicon-dark.svg"
              : "https://github.githubassets.com/favicons/favicon.svg"
          }
          title={name}
          subtitle={author}
          keywords={[name, author]}
          accessories={[{ text: url }]}
          actions={
            <ActionPanel>
              <Action.OpenInBrowser url={url} />
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
}
