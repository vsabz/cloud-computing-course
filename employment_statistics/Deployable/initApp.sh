#!/bin/sh
service mysql start
./createDB.sh empdb
python CreateTable.py
python DBGen.py
#python3 InjectTask3Data.py
echo "Initiating server!"
python server.py
echo "Server is running. You may close the terminal."
