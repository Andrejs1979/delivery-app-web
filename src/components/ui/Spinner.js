import React from "react";
import { Logo, Icon } from "components/ui/Brand";
export default function Spinner() {
  return (
    <section className="hero is-medium">
      <div className="hero-body">
        <div className="container">
          <div className="columns is-centered">
            <div className="column is-one-third has-text-centered">
              {/* <div style={{ width: 75 }}>
                <Icon />
              </div> */}

              <p className="title is-4">Loading, please wait...</p>
              <progress className="progress is-small" max="100" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
