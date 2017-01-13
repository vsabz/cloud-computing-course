import json
from DBGen import *

if __name__ == '__main__':

    jfile = 'graduate2.json'
    jData = open(jfile, 'r')
    pkg = json.load(jData)
    jData.close()

    # Connect to the database
    connection = pymysql.connect(host='127.0.0.1',
                                 user='root',
                                 password='1234',
                                 db=DB_NAME,
                                 charset='utf8mb4',
                                 cursorclass=pymysql.cursors.DictCursor)

    cnt = 0
    print("begins generating data:")
    for entree in pkg:
        eId = entree['ID']
        dob = entree['DOB']
        frstname = entree['FirstName']
        mdlname = entree['MiddleName']
        lstname = entree['LastName']

        sql = createSql(frstname, mdlname, lstname, dob, eId, TABLE_NAME)
        # if cnt%5000 == 0:
        #     print(sql)
        # send entry
        try:
            with connection.cursor() as cursor:
                # Create a new record
                cursor.execute(sql)

            connection.commit()
            if (cnt+1)%10000 == 0:
                print(str(cnt + 1) + " entries so far")
            cnt += 1
        except:
            print('error!')
            connection.close()
            exit()
    print("completed")
    connection.close()
