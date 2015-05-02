FROM dockerfile/nodejs

MAINTAINER Matthias Luebken, matthias@catalyst-zero.com

WORKDIR /home/joursferies

# Install Mean.JS Prerequisites
RUN npm install -g grunt-cli
RUN npm install -g bower

# Install Mean.JS packages
ADD package.json /home/joursferies/package.json
RUN npm install

# Manually trigger bower. Why doesnt this work via npm install?
ADD .bowerrc /home/joursferies/.bowerrc
ADD bower.json /home/joursferies/bower.json
RUN bower install --config.interactive=false --allow-root

# Make everything available for start
ADD . /home/joursferies

# currently only works for development
ENV NODE_ENV development

# Port 3000 for server
EXPOSE 3000
CMD ["grunt"]
