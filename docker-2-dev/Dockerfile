# select base node image
FROM node:20-alpine 

# set working directory
WORKDIR /app

# copy module tgz 
COPY project-practice-board-back-end-1.0.0.tgz .
# install using tgz
RUN npm install project-practice-board-back-end-1.0.0.tgz

# copy rest of source code over
COPY . .

# check for differing packages
RUN diff package.json node_modules/project-practice-board-back-end/package.json || exit 1

# move modules to their proper folder structure
RUN mv node_modules/project-practice-board-back-end/node_modules/* node_modules

# remove leftover files/folders
RUN rm -r node_modules/project-practice-board-back-end
RUN rm project-practice-board-back-end-1.0.0.tgz

# set container to run as non-root
RUN adduser -u 1001 -D defaultuser
USER defaultuser


# start app after the container runs
CMD ["node","src/index.js"]