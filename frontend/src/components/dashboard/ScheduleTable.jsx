// Convert a backend timestamp into a JavaScript Date.
const getDate = value => {
  const hasTimezone = /(Z|[+-]\d{2}:\d{2})$/.test(value);

  // Backend times without a timezone are UTC. Z means UTC.
  if (value && !hasTimezone) {
    return new Date(value + "Z");
  }
  return new Date(value);
};
const ScheduleTable = ({
  schedules = [],
  onEdit
}) => {
  // Show a message when there are no schedules.
  if (schedules.length === 0) {
    return <p className="pc-empty">No schedules found for this selection.</p>;
  }
  const canEdit = typeof onEdit === "function";
  return <div className="pc-table-wrap">
      <table className="pc-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Area code</th>
            <th>Start time</th>
            <th>End time</th>
            <th>Duration</th>
            <th>Status</th>
            <th>Reason</th>
            {canEdit && <th>Action</th>}
          </tr>
        </thead>

        <tbody>
          {/* Create one table row for each schedule. */}
          {schedules.map(schedule => {
          const startDate = getDate(schedule.start_time);
          const endDate = getDate(schedule.end_time);
          const date = startDate.toLocaleDateString("en-GB");
          const timeOptions = {
            hour: "2-digit",
            minute: "2-digit"
          };
          const startTime = startDate.toLocaleTimeString([], timeOptions);
          const endTime = endDate.toLocaleTimeString([], timeOptions);

          // Date subtraction gives milliseconds. Convert them to hours.
          const millisecondsPerHour = 60 * 60 * 1000;
          const duration = (endDate - startDate) / millisecondsPerHour;
          const durationHours = duration.toFixed(1);
          let reason = schedule.reason;
          if (!reason) {
            reason = "—";
          }
          return <tr key={schedule.id}>
                <td>{date}</td>
                <td>{schedule.postal_code}</td>
                <td>{startTime}</td>
                <td>{endTime}</td>
                <td>{durationHours} hrs</td>
                <td><StatusBadge status={schedule.status} /></td>
                <td>{reason}</td>

                {/* Show Edit only when the parent provides onEdit. */}
                {canEdit && <td>
                    <button className="pc-text-button" onClick={() => onEdit(schedule)}>
                      Edit
                    </button>
                  </td>}
              </tr>;
        })}
        </tbody>
      </table>
    </div>;
};
export default ScheduleTable;
function StatusBadge({
  status
}) {
  return <span className={"pc-status " + String(status).toLowerCase()}>{status}</span>;
}
