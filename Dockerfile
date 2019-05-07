FROM ruby:2.6

RUN apt-get update && apt-get install -y git default-jdk

RUN curl --create-dirs -o /usr/local/bin/embulk -L "https://dl.embulk.org/embulk-latest.jar"
RUN chmod +x /usr/local/bin/embulk

RUN useradd --create-home --user-group --uid 1000 app && mkdir /app /vendor && chown app:app /app /vendor

USER app

WORKDIR /app

ENV BUNDLE_PATH=/app/vendor/bundle
ENV BUNDLE_GEMFILE=/app/Gemfile
ENV BUNDLE_JOBS=4

RUN gem install unofficial_buildkite_client google-cloud-bigquery sentry-raven redis

COPY --chown=app Gemfile .
COPY --chown=app Gemfile.lock .

RUN embulk bundle install

COPY --chown=app . .
