from Inquire import *
import json
from pprint import pprint

#calculates and average salary from the 12 salaries in 'employee'
def get_employees_salary(employee):#input is dict
    avgSalary = (employee['ASM1'] + employee['ASM2'] + employee['ASM3'] + employee['ASM4']
    + employee['ASM5'] + employee['ASM6'] + employee['ASM7'] + employee['ASM8']
    + employee['ASM9'] + employee['ASM10'] + employee['ASM11'] + employee['ASM12'])/12
    return avgSalary

def process_inquiery(jsonQuery):
    fin = {"stats" : []}
    for query in jsonQuery:
        retPkg = process_single_package_inquiery(jsonQuery[query])
        retPkg['packageID'] = query
        # print("single package:\n")
        # print(retPkg)
        fin["stats"].append(retPkg)
    return json.dumps(fin)


#for an enquiry in json form of the format of team 2
#returns a json string package of the results
def process_single_package_inquiery(jsonQuery):
    # pathName = 'pkg.json'
    # retPathName = 'retpkg.json'
    # jData = open(pathName, 'r')
    # jsonQuery = json.load(jData)
    # jData.close()

    # DOB = jsonQuery['dateOfBirth']
    print("hereJquery:")
    # print(jsonQuery)
    pId = jsonQuery['packageUniqueID']
    requiredEntries = jsonQuery['graduates']#containing first, middle and last names
    matchedEmployees = []
    salaries = 0
    numberOfWorking = 0
    numberOfNotFound = 0
    numberOfFound = 0
    # Connect to the database
    connection = pymysql.connect(host='127.0.0.1',
                                 user='root',
                                 password='1234',
                                 db=DB_NAME,
                                 charset='utf8mb4',
                                 cursorclass=pymysql.cursors.DictCursor)
    for entree in requiredEntries:
        DOB = entree['birth']
        employees = inquire(entree['firstName'], entree['middleName'], entree['lastName'], DOB, connection)
        if not employees:
            numberOfNotFound += 1
            continue
        matchedEmployees.extend(employees)
        for employee in employees:
            numberOfFound += 1
            salary = get_employees_salary(employee)
            salaries += salary
            if salary > 0:
                numberOfWorking += 1
    if numberOfFound > 0:
        averageSalary = salaries/numberOfFound
    else:
        averageSalary = 0

    retPkg = {"packageID" : pId,
              "numberOfPersons" : len(requiredEntries),
              "numberOfWorkingPersons" : numberOfWorking,
              "notFoundPersons" : numberOfNotFound,
              "averageSalary" : averageSalary}
    # retFile = open(retPathName, 'w')
    # json.dump(retPkg, retFile)
    return retPkg

if __name__ == '__main__':
    pathName = 'pkg.json'
    retPathName = 'retpkg.json'
    jPack = process_inquiery(pathName)
    pprint(jPack)