mysql -u root -p1234 -e "create database $1; GRANT ALL PRIVILEGES ON $1.* TO www@localhost IDENTIFIED BY '1234'"
