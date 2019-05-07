# Rails CI result importer

Import https://buildkite.com/rails/rails to BigQuery public dataset.

Public dataset is available on `rails-ci-result.rails_ci_result.buildkite_jobs`.

For example, you can find the percentage of passed jobs by this SQL:

```sql
WITH builds AS (
  SELECT DISTINCT build_number, JSON_EXTRACT_SCALAR(build_data, "$.state") as state
  FROM `rails-ci-result.rails_ci_result.buildkite_jobs`
  WHERE "2019-05-01" <= created_at AND created_at < "2019-06-01"
  AND JSON_EXTRACT_SCALAR(build_data, "$.branch_name") = "master"
)
SELECT COUNT(IF(state = "passed", 1, NULL)) as passed_count, COUNT(*) as count,
COUNT(IF(state = "passed", 1, NULL)) / COUNT(*) as passed_percent
FROM builds
```

https://console.cloud.google.com/bigquery?p=rails-ci-result&d=rails_ci_result&page=dataset

## Important notice as of 2019/05/08

- This dataset doesn’t have all results
- I paid to store this dataset but you need to pay money to run query
  - Be sure to query with “WHERE created_at”
