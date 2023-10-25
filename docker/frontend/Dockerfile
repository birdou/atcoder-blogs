FROM ubuntu:20.04

RUN apt-get update \
&& apt-get -y install build-essential procps curl file git

# homebrewのインストール
RUN /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
RUN (echo; echo 'eval "$(/home/linuxbrew/.linuxbrew/bin/brew shellenv)"') >> /root/.profile
ENV PATH="$PATH:/home/linuxbrew/.linuxbrew/bin/"
RUN brew install gcc

# nodebrewのインストール
RUN curl -L git.io/nodebrew | perl - setup
ENV PATH=/root/.nodebrew/current/bin:$PATH

# Node.jsのインストール
RUN nodebrew install v20.5.1 \
&& nodebrew use v20.5.1 \
&& npm install npm@latest -g

WORKDIR /work/atcoder-blogs-frontend