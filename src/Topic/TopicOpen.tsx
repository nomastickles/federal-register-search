import React from "react";
import { TopicOpenInfo } from "../types";

function TopicOpen({ info }: { info: TopicOpenInfo }) {
  return (
    <div>
      <h2>{info.description}</h2>

      {info.results?.map((doc) => {
        return (
          <div key={doc.document_number}>
            <hr />

            <p style={{ fontWeight: "bold" }}>{doc.title}</p>
            <p>
              Document #{" "}
              <a href={doc.html_url} target="_blank" rel="noopener noreferrer">
                {doc.document_number}
              </a>{" "}
              | {doc.publication_date} | {doc.type}
            </p>
            <p>{doc.abstract}</p>

            <div className="paragraph">
              Excerpts:{" "}
              <div dangerouslySetInnerHTML={{ __html: doc.excerpts }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default TopicOpen;
