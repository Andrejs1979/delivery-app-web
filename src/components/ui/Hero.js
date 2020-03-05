import React from "react";
import UserAvatar from "react-user-avatar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Toolbar from "components/ui/Toolbar";

import { Icon } from "components/ui/bulma/elements";
export default function Hero({
  color = "light",
  icon,
  avatar,
  title,
  subtitle,
  tabs,
  activeTab,
  setTab,
  view,
  setView,
  toolbar,
  item
}) {
  return (
    <section className={`hero is-${color} is-bold box`}>
      {toolbar && (
        <div className="hero-head">
          <nav className="level">
            <div className="level-left" />

            <div className="level-right">
              <Toolbar
                itemID={item}
                buttons={toolbar}
                color="primary"
                size="large"
              />
            </div>
          </nav>
        </div>
      )}
      <div className="hero-body">
        <nav className="level">
          <div className="level-left">
            <div className="level-item">
              {icon && <FontAwesomeIcon icon={icon} color="white" size="3x" />}
            </div>
            <div className="level-item">
              {avatar && <UserAvatar size="100" name={avatar} src={avatar} />}
            </div>
            <div className="level-item">
              <div>
                <p className="title">{title}</p>
                <p className="subtitle">{subtitle}</p>
              </div>
            </div>
          </div>
        </nav>
      </div>

      <div className="hero-foot">
        <nav className="level">
          <div className="level-left">
            {tabs && (
              <Tabs
                tabs={tabs}
                color={color}
                active={activeTab}
                setTab={setTab}
              />
            )}
          </div>

          <div className="level-right">
            {view && (
              <ToggleViewBar view={view} color={color} setView={setView} />
            )}
          </div>
        </nav>
      </div>
    </section>
  );
}

const Tabs = ({ color, tabs, active, setTab }) => (
  <div className="field has-addons">
    {tabs.map(tab => (
      <p className="control" key={tab.title}>
        <button
          className={`button is-${color} ${
            active === tab.title ? "is-active" : ""
          }`}
          onClick={() => setTab(tab.title)}
        >
          <span className={`icon is-medium`}>
            <i className={`fas fa-${tab.icon}`} />
          </span>
          <span className={`has-text-weight-semibold is-capitalized`}>
            {tab.title}
          </span>
        </button>
      </p>
    ))}
  </div>
);

// ${active === tab.title ? 'has-text-dark' : ''}

const ToggleViewBar = ({ view, color, setView }) => (
  <div className="field has-addons">
    <p className="control">
      <button className={`button is-${color}`} onClick={() => setView("large")}>
        <FontAwesomeIcon icon="address-card" color="white" size="1x" />
      </button>
    </p>
    <p className="control">
      <button className={`button is-${color}`} onClick={() => setView("grid")}>
        <FontAwesomeIcon icon="th-large" color="white" size="1x" />
      </button>
    </p>
    <p className="control">
      <button className={`button is-${color}`} onClick={() => setView("table")}>
        <FontAwesomeIcon icon="th" color="white" size="1x" />
      </button>
    </p>
  </div>
);
