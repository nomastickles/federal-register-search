import React from "react";
import { TopicOpen } from "../types";

function TopicComponentOpen({ info }: { info: TopicOpen }) {
  return (
    <div>
      {info.results?.map((doc) => {
        return (
          <article className="doc-item" key={doc.document_number}>
            <div className="doc-eyebrow">
              {doc.publication_date && <span>{doc.publication_date}</span>}
              {doc.type && (
                <>
                  {doc.publication_date && <span> &middot; </span>}
                  <span>{doc.type}</span>
                </>
              )}
            </div>

            <h3 className="doc-title">{doc.title}</h3>

            {doc.abstract && <p className="doc-abstract">{doc.abstract}</p>}

            {doc.excerpts && (
              <div
                className="doc-excerpts"
                dangerouslySetInnerHTML={{ __html: doc.excerpts }}
              />
            )}

            <div className="doc-footer">
              <a
                href={doc.html_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                doc {doc.document_number} &rarr;
              </a>
            </div>
          </article>
        );
      })}
    </div>
  );
}

export default TopicComponentOpen;
