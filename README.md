# Rails CI result importer

Import https://travis-ci.org/rails/rails to BigQuery public dataset.

Public dataset is available on `rails-travis-result.rails_travis_result.jobs`.

For example, you can find the percentage of passed jobs by this SQL:

```sql
WITH x AS(
  SELECT JSON_EXTRACT_SCALAR(data, "$.state") as s, COUNT(*) as c FROM `rails-travis-result.rails_travis_result.jobs`
  WHERE "2019-02-01" <= started_at AND started_at < "2019-03-01"
  AND JSON_EXTRACT_SCALAR(commit_data, "$.branch") = "master"
  AND JSON_EXTRACT_SCALAR(data, "$.allow_failure") = "false"
  AND JSON_EXTRACT_SCALAR(data, "$.state") IN ("failed", "passed")
  GROUP BY s
)
SELECT (SELECT c FROM x WHERE x.s = "passed") / (SELECT SUM(x.c) FROM x) * 100
```

https://console.cloud.google.com/bigquery?p=rails-travis-result&d=rails_travis_result&page=dataset

## Important notice as of 2019/03/22

- This dataset doesn’t have all results
- Some rows don’t have commit_data
- I paid to store this dataset but you need to pay money to run query
  - Be sure to query with “WHERE started_at”
  - Full scan costs only \$0.2 but amount of data keeps increasing
