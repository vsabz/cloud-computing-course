sudo apt-get update
sudo apt-get -y install docker.io
sudo apt-get -y install git
sudo apt-get -y install nodejs
sudo apt-get -y install npm
git clone https://github.com/phani-p3/Cloud-Computing.git
sudo docker run --name db -d -e MYSQL_ROOT_PASSWORD=password -e MYSQL_DATABASE=graduate -p 3306:3306 mysql:latest
sudo docker exec -i db mysql -uroot -ppassword graduate < graduate.sql
sudo apt-get update
npm install express
npm install request
npm install mysql
npm install body-parser
cp /root/Cloud-Computing/application1.js /root/application1.js
sudo iptables -A INPUT -p tcp --dport 9000 -j ACCEPT
nodejs application1.js
