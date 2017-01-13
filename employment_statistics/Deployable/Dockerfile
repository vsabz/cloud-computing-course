FROM debian:latest
MAINTAINER Roy Nevo <roy.nevo@mail.huji.ac.il>
EXPOSE 3036
EXPOSE 8081
RUN apt-get update -y && apt-get install -y \
    python-pip \
    python-dev \
    libbz2-dev \
    libsqlite3-dev \
    libreadline-dev \
    zlib1g-dev \
    libncurses5-dev \
    libssl-dev \
    libgdbm-dev \
    build-essential \
    debconf-utils \
    && echo mysql-server mysql-server/root_password password 1234 | debconf-set-selections \
    && echo mysql-server mysql-server/root_password_again password 1234 | debconf-set-selections \
    && apt-get install -y mysql-server -o pkg::Options::="--force-confdef" -o pkg::Options::="--force-confold" --fix-missing \
    && apt-get install -y net-tools --fix-missing
COPY . /app
WORKDIR /app
RUN pip install -r requirements.txt
CMD ./initApp.sh
