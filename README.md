## crm

![Screenshot from 2023-02-16 10-46-40](https://user-images.githubusercontent.com/45355788/219303012-462f4d44-eef3-4960-b405-4617d82e17ab.png)

# Docs
https://documenter.getpostman.com/view/21601681/2s935rJ2Fk



# required env variables
HOST=localhost
PORT=5000
NODE_ENV="development"

# mongodb environment variables
DB_URL=mongodb+srv://username:password@cluster_name/?retryWrites=true&w=majority

# jwt auth keys
`default 1 minute`
JWT_ACCESS_EXPIRE="" like -> 1h,1m,10s etc.
JWT_ACCESS_USER_SECRET=some strong secret
COOKIE_EXPIRE=5 //in minutes

# cloudinary keys
CLOUDINARY_API_KEY=********************
CLOUDINARY_SECRET_KEY=*************
CLOUDINARY_CLOUD_NAME=*****

# email facilities
EMAIL_HOST=smptp.your_service.com
EMAIL_PORT= service port
EMAIL_SERVICE=service name
APP_EMAIL=email id
APP_EMAIL_PASSWORD=email password
