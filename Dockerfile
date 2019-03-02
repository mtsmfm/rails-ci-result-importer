FROM ruby:2.6

RUN apt-get update && apt-get install -y git default-jdk

RUN curl --create-dirs -o /usr/local/bin/embulk -L "https://dl.embulk.org/embulk-latest.jar"
RUN chmod +x /usr/local/bin/embulk

RUN useradd --create-home --user-group --uid 1000 app && mkdir /app /vendor && chown app:app /app /vendor

USER app

WORKDIR /app

COPY --chown=app Gemfile .
COPY --chown=app Gemfile.lock .

ENV BUNDLE_PATH=/app/vendor/bundle
ENV BUNDLE_GEMFILE=/app/Gemfile
ENV BUNDLE_JOBS=4

RUN embulk bundle install

RUN gem install redis -v 4.1.0

COPY --chown=app . .
