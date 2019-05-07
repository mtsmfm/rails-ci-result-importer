# Rails CI result importer

Import https://buildkite.com/rails/rails to BigQuery public dataset.

Public dataset is available on `rails-ci-result.rails_ci_result.buildkite_jobs`.

For example, you can find the percentage of passed jobs by this SQL:

```sql
WITH x AS(
  SELECT JSON_EXTRACT_SCALAR(data, "$.state") as s, COUNT(*) as c FROM `rails-ci-result.rails_ci_result.buildkite_jobs`
  WHERE "2019-02-01" <= created_at AND created_at < "2019-03-01"
  AND JSON_EXTRACT_SCALAR(commit_data, "$.branch") = "master"
  AND JSON_EXTRACT_SCALAR(data, "$.allow_failure") = "false"
  AND JSON_EXTRACT_SCALAR(data, "$.state") IN ("failed", "passed")
  GROUP BY s
)
SELECT (SELECT c FROM x WHERE x.s = "passed") / (SELECT SUM(x.c) FROM x) * 100
```

https://console.cloud.google.com/bigquery?p=rails-ci-result&d=rails_ci_result&page=dataset

## Important notice as of 2019/05/08

- This dataset doesn’t have all results
- I paid to store this dataset but you need to pay money to run query
  - Be sure to query with “WHERE created_at”
