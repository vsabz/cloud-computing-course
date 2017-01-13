import pymysql.cursors

DB_NAME = 'empdb'

#Enquires the DB connected to 'connection' about the
#parameters in the input.
#returns the result
def inquire(fName, mName, lName, DOB, connection):
    try:
        with connection.cursor() as cursor:
            # Read a single record
            sql = "SELECT * FROM Employee WHERE FirstName=%s AND MiddleName=%s AND LastName=%s AND DOB=%s"
            # sql = "SELECT * FROM Employee WHERE (FirstName=%s AND MiddleName=%s AND LastName=%s) OR DOB=%s"#for DEBUGGING TODO REMOVE
            # print(sql, (fName, mName, lName, DOB))
            cursor.execute(sql, (fName, mName, lName, DOB))
            results = []
            result = cursor.fetchone()
            if result is None:
                return result
            while(result):
                results.append(result)
                result = cursor.fetchone()
    except:
        print('error!')
        connection.close()
        exit()
    finally:
        return results

#for debugging
if __name__ == '__main__':
    # Connect to the database
    connection = pymysql.connect(host='127.0.0.1',
                                 user='root',
                                 password='1234',
                                 db=DB_NAME,
                                 charset='utf8mb4',
                                 cursorclass=pymysql.cursors.DictCursor)
    fName = 'MARKETTA'
    mName = 'JAMES'
    lName = 'CONIGLIARO'
    DOB = '1.2.34'
    inquire(fName, mName, lName, DOB, connection)
    print("2:")
    a1 = {"firstName": "MARKETTA",
          "middleName": "MOSES",
          "lastName": "MAYNEZ"}
    inquire(a1['firstName'], a1['middleName'], a1['lastName'], DOB, connection)