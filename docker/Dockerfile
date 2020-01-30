FROM node:13

EXPOSE 3000 8888
WORKDIR   /root/
RUN apt-get update &&  \
    apt-get install -y git && \
    git clone https://github.com/mongodb-appeng/gaming-example
WORKDIR   /root/gaming-example

ENTRYPOINT [ "npm" ]
CMD ["install config serve"]