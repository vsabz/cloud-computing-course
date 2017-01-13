import pymysql.cursors

DB_NAME = 'empdb'

# Connect to the database
connection = pymysql.connect(host='127.0.0.1',
                             user='root',
                             password='1234',
                             db=DB_NAME,
                             charset='utf8mb4',
                             cursorclass=pymysql.cursors.DictCursor)
try:
    with connection.cursor() as cursor:
        sql = "CREATE TABLE Employee(FirstName varchar(255)," \
              " MiddleName varchar(255), LastName varchar(255)," \
              " DOB varchar(255), ID varchar(255)," \
              " ASM1 int, ASM2 int, ASM3 int, ASM4 int," \
              " ASM5 int, ASM6 int, ASM7 int, ASM8 int," \
              " ASM9 int, ASM10 int, ASM11 int, ASM12 int);"
        print(sql)
        cursor.execute(sql)

    # with connection.cursor() as cursor:
    #     # Create a new record
    #     sql = "INSERT INTO `users` (`email`, `password`) VALUES (%s, %s)"
    #     cursor.execute(sql, ('webmaster@python.org', 'very-secret'))
    #
    # # connection is not autocommit by default. So you must commit to save
    # # your changes.
    # connection.commit()

    # with connection.cursor() as cursor:
    #     # Read a single record
    #     sql = "SELECT `id`, `password` FROM `users` WHERE `email`=%s"
    #     cursor.execute(sql, ('webmaster@python.org',))
    #     result = cursor.fetchone()
    #     print(result)
except:
    print('error!')
    connection.close()
    exit()
finally:
    connection.close()
