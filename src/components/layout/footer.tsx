import React from "react";

export default function footer() {
  return (
    <footer className="w-full">
      <div className="text-sm text-center text-muted-foreground">
        Made by{" "}
        <a
          href="https://github.com/jeanpzh"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
        >
          jeanpzh
        </a>
      </div>
    </footer>
  );
}
