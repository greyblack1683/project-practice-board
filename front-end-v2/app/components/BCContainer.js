import React from "react";
import { useNavigate } from "react-router-dom";

import { Breadcrumbs, Link } from "@mui/joy";

function BCContainer({ appid = null, planid = null, taskid = null, control = 0, create = false }) {
  const navigate = useNavigate();
  // console.log("appid", appid, "planid", planid, "taskid", taskid, "control", control, "create", create);

  let listing = {
    app: {
      view: "/apps",
      viewOne: `/apps/${appid}`
    },
    plan: {
      view: `/apps/${appid}/plans`,
      viewOne: `/apps/${appid}/plans/${planid}`,
      create: `/apps/${appid}/plans/create`
    },
    task: {
      view: `/apps/${appid}/tasks`,
      viewOne: `/apps/${appid}/tasks/${taskid}`,
      create: `/apps/${appid}/tasks/create`
    }
  };

  return (
    <>
      {control >= 0 && (
        <Breadcrumbs aria-label="breadcrumbs" size="sm" sx={{ ml: "2rem", mt: "2rem", mb: "-1rem", padding: "0px" }}>
          {/* control = 0 */}
          <Link color="neutral" onClick={() => navigate("/apps")}>
            Applications
          </Link>
          {control === 0 && create === true ? (
            <Link color="neutral" disabled>
              Create
            </Link>
          ) : (
            <Link color="neutral" onClick={() => navigate(`/apps/${appid}`)} disabled={control === 0.5 ? true : false}>
              {appid}
            </Link>
          )}
          {/* control = 0.5 */}
          {control >= 0.5 && (
            <Link color="neutral" onClick={() => navigate(`/apps/${appid}`)} disabled={control === 0.5 ? true : false}>
              {appid}
            </Link>
          )}
          {/* control = 1 */}
          {control == 1 && (
            <Link color="neutral" onClick={() => navigate(`/apps/${appid}/plans`)} disabled={control === 1 && create === false ? true : false}>
              Plans
            </Link>
          )}
          {control === 1 && create === true && (
            <Link color="neutral" disabled>
              Create
            </Link>
          )}
          {/* control = 1.5 */}
          {planid && (
            <Link color="neutral" onClick={() => navigate(`/apps/${appid}/plans/${planid}`)} disabled={control === 1.5 ? true : false}>
              {planid}
            </Link>
          )}
          {/* control = 2 */}
          {control >= 2 && (
            <Link color="neutral" onClick={() => navigate(`/apps/${appid}/plans/${planid}/tasks`)} disabled={control === 2 ? true : false}>
              Tasks
            </Link>
          )}
          {control === 2 && create === true && (
            <Link color="neutral" disabled>
              Create
            </Link>
          )}
          {/* control = 2.5 */}
          {taskid && (
            <Link color="neutral" onClick={() => navigate(`/apps/${appid}/plans/${planid}/tasks/${taskid}`)} disabled={control === 2.5 ? true : false}>
              {taskid}
            </Link>
          )}
        </Breadcrumbs>
      )}
    </>
  );
}

export default BCContainer;
