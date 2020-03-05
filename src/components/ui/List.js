import React from "react";

// import Activity from "components/views/Activity";
import Consumer from "components/views/Consumer";
// import Invoice from "components/views/Invoice";
// import Scheduled from "components/views/Scheduled";

import { Box, Notification } from "components/ui/bulma/elements";

export default function List({ type, view, data, actions }) {
  if (!data || data.length < 1)
    return (
      <Notification color="dark">
        <strong>{`No ${type} found. Please check back later!`}</strong>
      </Notification>
    );

  return (
    <div className="columns">
      <div className="column">
        <div>
          {view !== "table" ? (
            <div
              className={
                view === "grid" ? "columns is-multiline is-mobile" : ""
              }
            >
              {data.map(data => (
                <Item
                  type={type}
                  view={view}
                  data={data}
                  actions={actions}
                  key={data.id}
                />
              ))}
            </div>
          ) : (
            <Box>
              <table className="table is-fullwidth is-hoverable">
                <TabHeader type={type} />
                <tbody>
                  {data.map(data => (
                    <Item
                      type={type}
                      view={view}
                      data={data}
                      actions={actions}
                      key={data.id}
                    />
                  ))}
                </tbody>
              </table>
            </Box>
          )}
        </div>
      </div>
    </div>
  );
}

const activity = [
  { id: 1, name: "" },
  { id: 2, name: "customer" },
  { id: 3, name: "date" },
  { id: 4, name: "amount" },
  { id: 5, name: "card" },
  { id: 6, name: "" }
];
const customers = [
  { id: 1, name: "" },
  { id: 2, name: "customer" },
  { id: 3, name: "phone" },
  { id: 4, name: "purchases" },
  { id: 5, name: "total" },
  { id: 6, name: "avg" },
  { id: 7, name: "latest transaction" },
  { id: 8, name: "" }
];

const invoices = ["", "customer", "amount"];

const scheduled = [
  { id: 1, name: "" },
  { id: 2, name: "customer" },
  { id: 3, name: "amount" },
  { id: 4, name: "frequency" },
  { id: 5, name: "last run" },
  { id: 6, name: "next run" },
  { id: 7, name: "" }
];

const TabHeader = ({ type }) => {
  switch (type) {
    case "activity":
      return (
        <thead>
          <tr>
            {activity.map(header => (
              <th key={header.id}>{header.name}</th>
            ))}
          </tr>
        </thead>
      );

    case "customers":
      return (
        <thead>
          <tr>
            {customers.map(header => (
              <th key={header.id}>{header.name}</th>
            ))}
          </tr>
        </thead>
      );

    case "scheduled payments":
      return (
        <thead>
          <tr>
            {scheduled.map(header => (
              <th key={header.id}>{header.name}</th>
            ))}
          </tr>
        </thead>
      );

    default:
      break;
  }

  return null;
};

const Item = ({ type, view, data, actions }) => {
  switch (type) {
    // case "activity":
    //   return <Activity view={view} data={data} actions={actions} />;
    case "customers":
      return <Consumer view={view} data={data} actions={actions} />;
    // case "invoices":
    //   return <Invoice view={view} data={data} actions={actions} />;
    // case "scheduled payments":
    //   return <Scheduled view={view} data={data} actions={actions} />;
    default:
      break;
  }
};
