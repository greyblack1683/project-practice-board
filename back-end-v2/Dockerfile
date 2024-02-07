# select base node image
FROM node:20-alpine 

# set working directory
WORKDIR /app

# copy app dependancies
COPY package.json .

# install dependancies
RUN npm install

# copy source code
COPY . .

# creating a non-root user
RUN adduser -u 1001 -D crown

# switching to non-root user
USER crown

# start app after the container runs
CMD ["node","src/index.js"]