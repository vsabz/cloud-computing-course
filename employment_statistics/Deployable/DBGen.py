import pymysql.cursors
from random import randint, choice

NUMBER_OF_RECS = 10000
MAX_SALARY = 100000
TABLE_NAME = 'Employee'
DB_NAME = 'empdb'

#convert a txt of data into a list
def createData(filePath):
    fd = open(filePath, 'r')
    data = []
    for line in fd:
        data.append(line.strip())
    return data

#creates an SQL enquiry of the form "INSERT INTO Employee VALUES ([employee values...]);
def createSql(firstName, middleName, lastName, DOB, ID, table):
    sql = "INSERT INTO " + table + " VALUES " "('" + firstName + "', '" + middleName + "', '" \
          + lastName + "', '" + DOB + "', '" + ID + "', "
    for i in range(1, 12):
        num = randint(0, MAX_SALARY)
        sql += str(num) + ", "
    num = randint(0, MAX_SALARY)
    sql += str(num) + ");"
    return sql

#creates an SQL enquiry of the form "INSERT INTO Employee VALUES ([employee values...]);
#using randomized names(for first, middle and last names) data
def randomize_entree(mData, fData, lData, eId):
    t = randint(0, 1)
    if (t == 0):
        frstname = choice(mData)
    else:
        frstname = choice(fData)
    t = randint(0, 1)
    if (t == 0):
        mdlname = choice(mData)
    else:
        mdlname = choice(fData)
    lstname = choice(lData)
    day = randint(1, 30)
    month = randint(1, 12)
    year = randint(1900, 2016)
    dob = str(day) + "." + str(month) + "." + str(year)
    sql = createSql(frstname, mdlname, lstname, dob, eId, TABLE_NAME)
    return sql



if __name__ == '__main__':
    mpath = 'dataFiles/cMnew.txt'
    fpath = 'dataFiles/cFnew.txt'
    lpath = 'dataFiles/cLnew.txt'
    mData = createData(mpath)
    fData = createData(fpath)
    lData = createData(lpath)

    # Connect to the database
    connection = pymysql.connect(host='127.0.0.1',
                                 user='root',
                                 password='1234',
                                 db=DB_NAME,
                                 charset='utf8mb4',
                                 cursorclass=pymysql.cursors.DictCursor)
    print("begins generating data:")
    for i in range(0, NUMBER_OF_RECS):
        sql = randomize_entree(mData, fData, lData, str(i))
        # if i%5000 == 0:
        #     print(sql)
        # send entry
        try:
            with connection.cursor() as cursor:
                # Create a new record
                cursor.execute(sql)

            connection.commit()
            if (i+1)%10000 == 0:
                print(str(i + 1) + " entries so far")

        except:
            print('error!')
            connection.close()
            exit()
    print("completed")
    connection.close()
