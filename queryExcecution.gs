function queryExecution(query) {
  const projectId = "projectName";

  const request = {
    query: query,
    useLegacySql: false,
    maxResults: 1000,
    timeoutMs: 100000,
    location: "asia-northeast1",
  };
  let result = BigQuery.Jobs.query(request, projectId);
  const jobId = result.jobReference.jobId;

  // Check on status of the Query Job.
  let sleepTimeMs = 500;
  while (!result.jobComplete) {
    Utilities.sleep(sleepTimeMs);
    sleepTimeMs *= 2;
    result = BigQuery.Jobs.getQueryResults(projectId, jobId, {
      location: request.location,
    });
  }

  // Get all the rows of results.
  let rows = result.rows;
  while (result.pageToken) {
    result = BigQuery.Jobs.getQueryResults(projectId, jobId, {
      pageToken: result.pageToken,
      location: request.location,
    });
    rows = rows.concat(result.rows);
  }

  if (rows) {
    // Store the dataset into rows
    rows = rows.map((row) => {
      return row.f.map((cell) => cell.v);
    });

    let fields = result.schema.fields;
    fields = fields.map((field) => field.name);

    // Store the dataset into rows
    var rowsAsObjects = rows.map((row) => {
      let obj = {};
      row.forEach((value, index) => {
        obj[fields[index]] = value;
      });
      return obj;
    });
  } else {
    var rowsAsObjects = rows;
  }

  return rowsAsObjects;
}
